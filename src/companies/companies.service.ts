import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

@Injectable()
export class CompaniesService {
  getCompanies() {
    const filePath = path.join(process.cwd(), 'dati.csv');

    if (!fs.existsSync(filePath)) {
      console.error('File non trovato:', filePath);
      return [];
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const records: any[] = parse(fileContent, {
      delimiter: ';',
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      bom: true,
      trim: true,
    });

    return records.map((record) => ({
      nomeSocieta: record['Nome societ'] || '',
      brandConsulenzaEsg: record['Nome del brand di consulenza ESG'] || '',
      sitoWeb: record['Sito web'] || '',
      email: record['Email'] || '',
      telefono: record['Telefono'] || '',
      annoFondazione: record['Anno fondazione'] || '',
      purpose: record['Purpose'] || '',

      sedi: [
        record['Sede 1'],
        record['Sede 2'],
        record['Sede 3'],
      ].filter(Boolean),

      clienti: [
        record['Cliente 1'],
        record['Cliente 2'],
        record['Cliente 3'],
        record['Cliente 4'],
        record['Cliente 5'],
      ].filter(Boolean),

      servizi: [
        record['Servizio 1'],
        record['Servizio 2'],
        record['Servizio 3'],
        record['Servizio 4'],
        record['Servizio 5'],
        record['Servizio 6'],
        record['Servizio 7'],
        record['Servizio 8'],
        record['Servizio 9'],
        record['Servizio 10'],
        record['Servizio 11'],
        record['Servizio 12'],
        record['Servizio 13'],
        record['Servizio 14'],
        record['Servizio 15'],
        record['Servizio 16'],
        record['Servizio 17'],
        record['Servizio 18'],
        record['Servizio 19'],
        record['Servizio 20'],
        record['Servizio 21'],
        record['Servizio 22'],
        record['Servizio 23'],
        record['Servizio 24'],
        record['Servizio 25'],
        record['Servizio 26'],
        record['Servizio 27'],
        record['Servizio 28'],
      ].filter(Boolean),
    }));
  }
}