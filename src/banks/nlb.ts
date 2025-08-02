
import Papa from 'papaparse';
import { YnabRow } from '../utils/ynab';
import { InvalidHeaderError } from '../utils/errors';

const expectedHeader = [
  'Namen',
  'Kategorija',
  '+/-',
  'Znesek',
  'Valuta',
  'Datum plačila',
  'Naziv prejemnika/plačnika',
  'Naslov prejemnika/plačnika',
  'Račun prejemnika/plačnika',
  'BIC koda',
  'Status',
  'Menjalni tečaj',
  'Referenca prejemnika',
  'Datum poravnave',
  'Dodatni stroški',
  'ID transakcije'
];

export const convertNlb = (file: File): Promise<YnabRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const actualHeader = results.meta.fields as string[];
        if (JSON.stringify(actualHeader) !== JSON.stringify(expectedHeader)) {
          reject(new InvalidHeaderError(expectedHeader, actualHeader));
          return;
        }

        const ynabRows: YnabRow[] = [];
        for (const row of results.data as any[]) {
          const date = row['Datum plačila'];
          // Remove commas from payee and memo to prevent CSV parsing issues
          const payee = row['Naziv prejemnika/plačnika'].replace(/,/g, '');
          const memo = row['Namen'].replace(/,/g, '');
          // Remove thousand separators and replace decimal comma with a period
          const amount = parseFloat(row['Znesek'].replace(/\./g, '').replace(',', '.'));
          const sign = row['+/-'];

          if (!isNaN(amount)) {
            ynabRows.push({
              Date: date,
              Payee: payee,
              Memo: memo,
              Amount: (sign === '+' ? amount : -amount).toFixed(2),
            });
          }
        }
        resolve(ynabRows);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
