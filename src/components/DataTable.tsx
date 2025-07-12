
import React from 'react';

interface Props {
  data: string[][];
}

const DataTable: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <table>
      <thead>
        <tr>
          {data[0].map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
