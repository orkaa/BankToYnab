import React, { useState } from 'react';
import './App.css';
import BankSelector from './BankSelector';
import FileUploader from './FileUploader';
import DataTable from './DataTable';
import DownloadButton from './DownloadButton';
import { convertFile } from './services';
import { YnabRow } from './ynab';
import HeaderMismatch from './HeaderMismatch';
import { InvalidHeaderError } from './errors';

function App() {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [convertedData, setConvertedData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [headerMismatch, setHeaderMismatch] = useState<{ expected: string[], actual: string[] } | null>(null);

  const handleBankSelected = (bank: string) => {
    setSelectedBank(bank);
    setError(null); // Clear error when bank is selected
    setConvertedData([]); // Clear data when bank is changed
    setHeaderMismatch(null);
  };

  const handleFileUploaded = async (file: File) => {
    if (!selectedBank) {
      setError('Please select a bank first.');
      return;
    }
    setError(null);
    setHeaderMismatch(null);
    try {
      const ynabRows: YnabRow[] = await convertFile(file, selectedBank);
      const header = [['Date', 'Payee', 'Memo', 'Amount']];
      const rows = ynabRows.map(row => [row.Date, row.Payee, row.Memo, row.Amount]);
      setConvertedData(header.concat(rows));
    } catch (err) {
      if (err instanceof InvalidHeaderError) {
        setHeaderMismatch({ expected: err.expected, actual: err.actual });
      } else {
        setError('Error converting file. Please check the file format and selected bank.');
      }
      setConvertedData([]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bank CSV to YNAB Converter</h1>
      </header>
      <main>
        <div>
          <h2>1. Select Bank</h2>
          <BankSelector onBankSelected={handleBankSelected} />
        </div>
        <div>
          <h2>2. Upload CSV</h2>
          <FileUploader onFileUploaded={handleFileUploaded} />
        </div>
        {error && <p className="error">{error}</p>}
        {headerMismatch && <HeaderMismatch expected={headerMismatch.expected} actual={headerMismatch.actual} />}
        {convertedData.length > 0 && (
          <div>
            <h2>3. Preview and Download</h2>
            <DataTable data={convertedData.slice(0, 6)} />
            <DownloadButton data={convertedData} fileName={`ynab_import_${selectedBank}.csv`} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
