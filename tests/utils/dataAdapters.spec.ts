import { formatMoney, parseStringNumberToFloat, capitalizeFirstLetter } from '../../src/utils/dataAdapters';

describe('formatMoney', () => {
  it('should format a number to BRL currency', () => {
    const formatted = formatMoney(1234.56);
    expect(formatted).toBe('R$ 1.234,56');
  });

  it('should return "R$ 0,00" when value is null or undefined', () => {
    expect(formatMoney(undefined)).toBe('R$ 0,00');
    expect(formatMoney(null)).toBe('R$ 0,00');
  });
});

describe('parseStringNumberToFloat', () => {
  it('should parse a BRL formatted string to a float', () => {
    const result = parseStringNumberToFloat('R$ 1.234,56');
    expect(result).toBeCloseTo(1234.56);
  });

  it('should return 0 for invalid input', () => {
    const result = parseStringNumberToFloat('Invalid String');
    expect(result).toBe(0);
  });

  it('should handle strings without "R$"', () => {
    const result = parseStringNumberToFloat('1.000,99');
    expect(result).toBeCloseTo(1000.99);
  });
});

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    const result = capitalizeFirstLetter('hello');
    expect(result).toBe('Hello');
  });

  it('should return an empty string if input is empty', () => {
    const result = capitalizeFirstLetter('');
    expect(result).toBe('');
  });

  it('should not change already capitalized strings', () => {
    const result = capitalizeFirstLetter('Hello');
    expect(result).toBe('Hello');
  });
});
