import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

@Injectable()
export class CompaniesService {
  private cleanValue(value: unknown): string {
    return (value ?? '').toString().trim();
  }

  private collectFields(record: Record<string, unknown>, prefix: string, max: number): string[] {
    const values: string[] = [];

    for (let i = 1; i <= max; i++) {
      const value = this.cleanValue(record[`${prefix} ${i}`]);
      if (value) values.push(value);
    }

    return values;
  }

  getCompanies() {
    const filePath = path.join(process.cwd(), 'dati.csv');

    if (!fs.existsSync(filePath)) {
      console.error('File non trovato:', filePath);
      return [];
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const records: Record<string, unknown>[] = parse(fileContent, {
      delimiter: ';',
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      bom: true,
      trim: true,
    });

    return records.map((record, index) => {
      const id = Number(this.cleanValue(record['id'])) || index + 1;
      const nomeSocieta = this.cleanValue(record['Nome società']);
      const brandConsulenzaEsg = this.cleanValue(record['Nome del brand di consulenza ESG']);
      const sitoWeb = this.cleanValue(record['Sito web']);

      return {
        id,
        nomeSocieta,
        brandConsulenzaEsg,
        displayName:
          nomeSocieta ||
          brandConsulenzaEsg ||
          sitoWeb ||
          `Società ${id}`,
        sitoWeb,
        email: this.cleanValue(record['Email']),
        telefono: this.cleanValue(record['Telefono']),
        annoFondazione: this.cleanValue(record['Anno fondazione']),
        annoInizioAttivitaEsg: this.cleanValue(
          record["Anno di inizio dell'attività di consulenza Esg"]
        ),
        fasciaFatturatoComplessivo: this.cleanValue(
          record['Fascia fatturato complessivo della società in Italia']
        ),
        fatturatoEsg: this.cleanValue(
          record['Fatturato derivante da attività di consulenza e servizi Esg svolti in Italia']
        ),
        progettoEsgSignificativo: this.cleanValue(
          record['Progetto Esg particolarmente significativo portato a termine da un vostro cliente nel 2024']
        ),
        particolaritaConsulenzaEsg: this.cleanValue(
          record['Indicare le particolarità della società/brand nella consulenza Esg']
        ),
        fasciaNumeroDipendentiTotale: this.cleanValue(
          record['Fascia numero complessivo dipendenti, e collaboratori se presenti, nella/e sede/i della società in Italia']
        ),
        fasciaNumeroDipendentiEsg: this.cleanValue(
          record['Fascia numero dipendenti, e collaboratori se presenti, nella/e sede/i della società in Italia che svolgono attività in ambito Esg']
        ),
        purpose: this.cleanValue(record['Purpose']),
        rendicontaFattoriEsg: this.cleanValue(
          record['La società rendiconta le informazioni sui fattori ESG?']
        ),
        sedi: this.collectFields(record, 'Sede', 3),
        clienti: this.collectFields(record, 'Cliente', 5),
        servizi: this.collectFields(record, 'Servizio', 28),
      };
    });
  }

  getCompanyById(id: number) {
    return this.getCompanies().find((company) => company.id === id);
  }
}