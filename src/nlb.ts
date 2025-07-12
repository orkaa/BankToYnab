
import Papa from 'papaparse';
import { YnabRow } from './ynab';
import { InvalidHeaderError } from './errors';

const expectedHeader = [
  'Opis/Description',
  'Kategorija/Category',
  '+/-',
  'Znesek/Amount',
  'Valuta/Currency',
  'Datum plačila/Value date',
  'Naziv prejemnika/plačnika/Counter party name',
  'Račun prejemnika/plačnika/Counter party Account',
  'Status/Status',
  'BIC koda/BIC Code',
  'Menjalni tečaj/Foreign Exchange rate',
  'Referenca prejemnika/Creditor Reference',
  'Datum poravnave/Settlement date',
  'Dodatni stroški/Additional Charges',
  'Naslov prejemnika/plačnika/Counter party Address',
  'ID transakcije/Transaction ID',
  'Namen/Purpose'
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
          const date = row['Datum plačila/Value date'];
          const payee = row['Naziv prejemnika/plačnika/Counter party name'];
          const memo = row['Opis/Description'];
          const amount = parseFloat(row['Znesek/Amount'].replace('.', '').replace(',', '.'));
          const sign = row['+/-'];

          if (!isNaN(amount)) {
            ynabRows.push({
              Date: date,
              Payee: payee,
              Memo: memo,
              Amount: sign === '+' ? amount.toString() : (-amount).toString(),
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
