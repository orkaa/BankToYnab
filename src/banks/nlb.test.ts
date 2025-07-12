import { convertNlb } from '../banks/nlb';
import { InvalidHeaderError } from '../utils/errors';

describe('convertNlb', () => {
  const mockNlbCsvContent = `Opis/Description;Kategorija/Category;+/-;Znesek/Amount;Valuta/Currency;Datum plačila/Value date;Naziv prejemnika/plačnika/Counter party name;Račun prejemnika/plačnika/Counter party Account;Status/Status;BIC koda/BIC Code;Menjalni tečaj/Foreign Exchange rate;Referenca prejemnika/Creditor Reference;Datum poravnave/Settlement date;Dodatni stroški/Additional Charges;Naslov prejemnika/plačnika/Counter party Address;ID transakcije/Transaction ID;Namen/Purpose
RANDOM_MEMO_1;RANDOM_CATEGORY_1;-;0,40;EUR;12-05-2025;RANDOM_PAYEE_1;RANDOM_ACCOUNT_1;;RANDOM_BIC_1;;RANDOM_REF_1;12-05-2025;;RANDOM_ADDRESS_1;RANDOM_ID_1;RANDOM_PURPOSE_1
RANDOM_MEMO_2;RANDOM_CATEGORY_2;+;45.950,00;EUR;08-05-2025;RANDOM_PAYEE_2;RANDOM_ACCOUNT_2;;RANDOM_BIC_2;;RANDOM_REF_2;08-05-2025;;RANDOM_ADDRESS_2;RANDOM_ID_2;RANDOM_PURPOSE_2
RANDOM_MEMO_3;RANDOM_CATEGORY_3;+;3,39;EUR;07-05-2025;RANDOM_PAYEE_3;RANDOM_ACCOUNT_3;;RANDOM_BIC_3;;RANDOM_REF_3;07-05-2025;;RANDOM_ADDRESS_3;RANDOM_ID_3;RANDOM_PURPOSE_3`;

  let mockFileReader: jest.Mock;

  beforeAll(() => {
    // Mock FileReader
    mockFileReader = jest.fn().mockImplementation(() => ({
      readAsText: jest.fn(),
      onload: null,
      onerror: null,
    }));
    Object.defineProperty(global, 'FileReader', {
      writable: true,
      value: mockFileReader,
    });
  });

  it('should convert NLB CSV to YNAB format', async () => {
    const mockFile = new File([mockNlbCsvContent], 'nlb.csv', { type: 'text/csv' });

    // Simulate FileReader onload event
    mockFileReader.mockImplementationOnce(() => {
      const reader = {
        readAsText: jest.fn((file, encoding) => {
          reader.onload({ target: { result: mockNlbCsvContent } });
        }),
        onload: null,
        onerror: null,
      };
      return reader;
    });

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

    (FileReader as jest.Mock).mockImplementationOnce(() => {
      const reader = {
        readAsText: jest.fn((file, encoding) => {
          reader.onload({ target: { result: incorrectCsvContent } });
        }),
        onload: null,
        onerror: null,
      };
      return reader;
    });

    await expect(convertNlb(mockFile)).rejects.toBeInstanceOf(InvalidHeaderError);
  });
});