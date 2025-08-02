
import { convertNlb } from '../banks/nlb';
import { InvalidHeaderError } from '../utils/errors';

describe('convertNlb', () => {
  const mockNlbCsvContent = `Namen;Kategorija;+/-;Znesek;Valuta;Datum plačila;Naziv prejemnika/plačnika;Naslov prejemnika/plačnika;Račun prejemnika/plačnika;BIC koda;Status;Menjalni tečaj;Referenca prejemnika;Datum poravnave;Dodatni stroški;ID transakcije
RANDOM_MEMO_1;RANDOM_CATEGORY_1;-;0,40;EUR;12-05-2025;RANDOM_PAYEE_1;RANDOM_ADDRESS_1;RANDOM_ACCOUNT_1;RANDOM_BIC_1;Status;1.0;REF1;12-05-2025;0;ID1
RANDOM_MEMO_2;RANDOM_CATEGORY_2;+;45.950,00;EUR;08-05-2025;RANDOM_PAYEE_2;RANDOM_ADDRESS_2;RANDOM_ACCOUNT_2;RANDOM_BIC_2;Status;1.0;REF2;08-05-2025;0;ID2
RANDOM_MEMO_3;RANDOM_CATEGORY_3;+;3,39;EUR;07-05-2025;RANDOM_PAYEE_3;RANDOM_ADDRESS_3;RANDOM_ACCOUNT_3;RANDOM_BIC_3;Status;1.0;REF3;07-05-2025;0;ID3`;

  it('should convert NLB CSV to YNAB format', async () => {
    const mockFile = new File([mockNlbCsvContent], 'nlb.csv', { type: 'text/csv' });
    const result = await convertNlb(mockFile);

    expect(result).toHaveLength(3); // Based on the provided CSV content
    expect(result[0]).toEqual({
      Date: '12-05-2025',
      Payee: 'RANDOM_PAYEE_1',
      Memo: 'RANDOM_MEMO_1',
      Amount: '-0.40',
    });
    expect(result[1]).toEqual({
      Date: '08-05-2025',
      Payee: 'RANDOM_PAYEE_2',
      Memo: 'RANDOM_MEMO_2',
      Amount: '45950.00',
    });
    expect(result[2]).toEqual({
      Date: '07-05-2025',
      Payee: 'RANDOM_PAYEE_3',
      Memo: 'RANDOM_MEMO_3',
      Amount: '3.39',
    });
  });

  it('should throw InvalidHeaderError for incorrect NLB CSV header', async () => {
    const incorrectCsvContent = `Incorrect;Header;Format\n${mockNlbCsvContent}`;
    const mockFile = new File([incorrectCsvContent], 'nlb_incorrect.csv', { type: 'text/csv' });

    await expect(convertNlb(mockFile)).rejects.toBeInstanceOf(InvalidHeaderError);
  });
});
