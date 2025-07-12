
import React from 'react';

interface Props {
  onBankSelected: (bank: string) => void;
}

const BankSelector: React.FC<Props> = ({ onBankSelected }) => {
  return (
    <select onChange={(e) => onBankSelected(e.target.value)}>
      <option value="">Select a bank</option>
      <option value="Delavska hranilnica">Delavska hranilnica</option>
      <option value="NLB">NLB</option>
    </select>
  );
};

export default BankSelector;
