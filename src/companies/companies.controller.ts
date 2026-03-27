import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompaniesService } from './companies.service';
import { parse } from 'csv-parse/sync';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  getCompanies() {
    return this.companiesService.getCompanies();
  }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File CSV mancante');
    }

    try {
      const csvText = file.buffer.toString('utf-8');

      const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';',
        bom: true,
        relax_quotes: true,
        relax_column_count: true,
        trim: true,
      });

      const companies = records.map((row: any, index: number) => {
        const clienti = [
          row['Cliente 1'],
          row['Cliente 2'],
          row['Cliente 3'],
          row['Cliente 4'],
          row['Cliente 5'],
        ].filter(Boolean);

        const sedi = [row['Sede 1'], row['Sede 2'], row['Sede 3']].filter(Boolean);

        const servizi = Array.from({ length: 28 }, (_, i) => row[`Servizio ${i + 1}`]).filter(Boolean);

        return {
          id: index + 1,
          nomeSocieta: row['Nome società'] || '',
          brandConsulenzaEsg: row['Nome del brand di consulenza ESG'] || '',
          sedi,
          sitoWeb: row['Sito web'] || '',
          email: row['Email'] || '',
          telefono: row['Telefono'] || '',
          annoFondazione: row['Anno fondazione'] || '',
          annoInizioConsulenzaEsg: row["Anno di inizio dell'attività di consulenza Esg"] || '',
          fasciaFatturatoTotaleItalia:
            row['Fascia fatturato complessivo della società in Italia'] || '',
          fatturatoEsgItalia:
            row['Fatturato derivante da attività di consulenza e servizi Esg svolti in Italia'] || '',
          clienti,
          progettoEsg2024:
            row['Progetto Esg particolarmente significativo portato a termine da un vostro cliente nel 2024'] || '',
          particolarita:
            row['Indicare le particolarità della società/brand nella consulenza Esg'] || '',
          fasciaDipendentiTotaliItalia:
            row['Fascia numero complessivo dipendenti, e collaboratori se presenti, nella/e sede/i della società in Italia'] || '',
          fasciaDipendentiEsgItalia:
            row['Fascia numero dipendenti, e collaboratori se presenti, nella/e sede/i della società in Italia che svolgono attività in ambito Esg'] || '',
          purpose: row['Purpose'] || '',
          rendicontaFattoriEsg:
            row['La società rendiconta le informazioni sui fattori ESG?'] || '',
          servizi,
        };
      });

      this.companiesService.setCompanies(companies);

      return {
        message: 'CSV caricato correttamente',
        total: companies.length,
      };
    } catch (error: any) {
      console.error('CSV ERROR:', error);
      throw new BadRequestException(error?.message || 'Errore parsing CSV');
    }
  }
}