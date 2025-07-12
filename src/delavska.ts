
import Papa from 'papaparse';
import { YnabRow } from './ynab';

export const convertDelavska = (file: File): Promise<YnabRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      delimiter: ';',
      skipEmptyLines: true,
      complete: (results) => {
        const ynabRows: YnabRow[] = [];
        // Skip the header rows
        for (let i = 9; i < results.data.length; i++) {
          const row = results.data[i] as string[];
          if (row.length < 11) continue;

          const date = row[1];
          const payee = row[5];
          const memo = row[10];
          const breme = parseFloat(row[6].replace('.', '').replace(',', '.'));
          const dobro = parseFloat(row[7].replace('.', '').replace(',', '.'));

          if (!isNaN(breme) && breme !== 0) {
            ynabRows.push({
              Date: date,
              Payee: payee,
              Memo: memo,
              Amount: (-breme).toString(),
            });
          } else if (!isNaN(dobro) && dobro !== 0) {
            ynabRows.push({
              Date: date,
              Payee: payee,
              Memo: memo,
              Amount: dobro.toString(),
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
