
import React from 'react';

interface Props {
  onFileUploaded: (file: File) => void;
}

const FileUploader: React.FC<Props> = ({ onFileUploaded }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUploaded(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv" />
    </div>
  );
};

export default FileUploader;
