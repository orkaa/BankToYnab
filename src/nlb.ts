
import Papa from 'papaparse';
import { YnabRow } from './ynab';

export const convertNlb = (file: File): Promise<YnabRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
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
