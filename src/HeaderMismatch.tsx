import React from 'react';

interface HeaderMismatchProps {
  expected: string[];
  actual: string[];
}

const HeaderMismatch: React.FC<HeaderMismatchProps> = ({ expected, actual }) => {
  return (
    <div className="error">
      <p><strong>Invalid CSV Header</strong></p>
      <p>The uploaded file's header does not match the expected format for the selected bank.</p>
      <table>
        <thead>
          <tr>
            <th>Expected Header</th>
            <th>Actual Header</th>
          </tr>
        </thead>
        <tbody>
          {expected.map((value, index) => (
            <tr key={index} className={value === actual[index] ? '' : 'mismatch'}>
              <td>{value}</td>
              <td>{actual[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeaderMismatch;
