import { convertDelavska } from '../banks/delavska';
import { InvalidHeaderError } from '../utils/errors';

describe('convertDelavska', () => {
  const mockDelavskaCsvContent = `Banka:;DELAVSKA HRANILNICA D.D. LJUBLJANA;;;
Komitent:;RANDOM_NAME, RANDOM_ADDRESS;;;
Promet za obdobje:;30.12.2024 - 18.05.2025;;;
Datum izpisa:;18.05.2025;;;

Ra\uFFFDun;RANDOM_ACCOUNT_1;;;
Valuta;Za\uFFFDetno stanje;Breme;Dobro;Kon\uFFFDno stanje;
EUR;100;100;100;100;
;;;;
Valuta;Datum valute;Datum knji\uFFFDnja;ID transakcije;\uFFFDt. za reklamacijo;Prejemnik / Pla\uFFFDnik;Breme;Dobro;Referenca pla\uFFFDnika;Referenca prejemnika;Opis prejemnika
EUR;18.05.2025;18.05.2025;RANDOM_ID_1;RANDOM_ID_2;RANDOM_PAYEE_1;;0,40;RANDOM_REF_1;;RANDOM_MEMO_1
EUR;17.05.2025;17.05.2025;;RANDOM_ID_3;RANDOM_PAYEE_2;45.950,00;;;;RANDOM_MEMO_2
EUR;14.05.2025;14.05.2025;RANDOM_ID_4;RANDOM_ID_5;RANDOM_PAYEE_3;3,39;;RANDOM_REF_2;RANDOM_REF_3;RANDOM_MEMO_3`;

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

  it('should convert Delavska CSV to YNAB format', async () => {
    const mockFile = new File([mockDelavskaCsvContent], 'delavska.csv', { type: 'text/csv' });

    // Simulate FileReader onload event
    mockFileReader.mockImplementationOnce(() => {
      const reader = {
        readAsText: jest.fn((file, encoding) => {
          reader.onload({ target: { result: mockDelavskaCsvContent } });
        }),
        onload: null,
        onerror: null,
      };
      return reader;
    });

    const result = await convertDelavska(mockFile);

    expect(result).toHaveLength(3); // Based on the provided CSV content
    expect(result[0]).toEqual({
      Date: '18.05.2025',
      Payee: 'RANDOM_PAYEE_1',
      Memo: 'RANDOM_MEMO_1',
      Amount: '0.40',
    });
    expect(result[1]).toEqual({
      Date: '17.05.2025',
      Payee: 'RANDOM_PAYEE_2',
      Memo: 'RANDOM_MEMO_2',
      Amount: '-45950.00',
    });
    expect(result[2]).toEqual({
      Date: '14.05.2025',
      Payee: 'RANDOM_PAYEE_3',
      Memo: 'RANDOM_MEMO_3',
      Amount: '-3.39',
    });
  });

  it('should throw InvalidHeaderError for incorrect Delavska CSV header', async () => {
    const incorrectCsvContent = `Incorrect;Header;Format\n${mockDelavskaCsvContent}`;
    const mockFile = new File([incorrectCsvContent], 'delavska_incorrect.csv', { type: 'text/csv' });

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

    await expect(convertDelavska(mockFile)).rejects.toBeInstanceOf(InvalidHeaderError);
  });
});