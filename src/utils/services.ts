
import { convertDelavska } from '../banks/delavska';
import { convertNlb } from '../banks/nlb';
import { YnabRow } from './ynab';

export const convertFile = (file: File, bank: string): Promise<YnabRow[]> => {
  if (bank === 'Delavska hranilnica') {
    return convertDelavska(file);
  } else if (bank === 'NLB') {
    return convertNlb(file);
  } else {
    return Promise.reject(new Error('Invalid bank selected'));
  }
};
