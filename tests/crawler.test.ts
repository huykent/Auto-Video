import { describe, it, expect } from 'vitest';
import { parseFilamentInfo, sanitizeModelTitle, formatPrintTime } from '../lib/crawler/makerworld';

describe('MakerWorld Scraper Utilities', () => {
  it('should parse filament types and colors from description strings', () => {
    const description = 'Model printed on Bambu Lab A1 with PLA Basic Silk Gold and PETG Translucent Blue';
    const parsed = parseFilamentInfo(description);
    expect(parsed.types).toContain('PLA');
    expect(parsed.types).toContain('PETG');
    expect(parsed.colors).toContain('Gold');
    expect(parsed.colors).toContain('Blue');
  });

  it('should fallback to default PLA / Standard if no filaments detected', () => {
    const description = 'Just a cool 3d print model';
    const parsed = parseFilamentInfo(description);
    expect(parsed.types).toEqual(['PLA']);
    expect(parsed.colors).toEqual(['Standard']);
  });

  it('should sanitize titles for filenames', () => {
    const rawTitle = 'Articulated Dragon 3D / 3MF v1.0!';
    const sanitized = sanitizeModelTitle(rawTitle);
    expect(sanitized).toBe('Articulated Dragon 3D 3MF v10');
  });

  it('should format print time correctly', () => {
    const minutes = 145;
    const formatted = formatPrintTime(minutes);
    expect(formatted).toBe('2h 25m');
  });
});
