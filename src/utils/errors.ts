export class InvalidHeaderError extends Error {
  expected: string[];
  actual: string[];

  constructor(expected: string[], actual: string[]) {
    super('Invalid CSV header');
    this.expected = expected;
    this.actual = actual;
  }
}
