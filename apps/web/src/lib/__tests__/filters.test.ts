import { describe, it, expect } from 'vitest';
import { buildTypesenseFilters, parseUrlFilters, buildUrlFromFilters } from '../filters';

describe('Filters', () => {
  describe('buildTypesenseFilters', () => {
    it('should build empty filter string for no filters', () => {
      const result = buildTypesenseFilters({});
      expect(result).toBe('');
    });

    it('should build filter string for single filter', () => {
      const result = buildTypesenseFilters({ country: 'United Kingdom' });
      expect(result).toBe('country:=United Kingdom');
    });

    it('should build filter string for multiple filters', () => {
      const result = buildTypesenseFilters({
        country: 'United Kingdom',
        type: 'WEEK',
        estSize: 'L',
      });
      expect(result).toBe('country:=United Kingdom && type:=WEEK && estSize:=L');
    });

    it('should handle array filters', () => {
      const result = buildTypesenseFilters({
        vibe: ['dance', 'social'],
      });
      expect(result).toBe('(vibe:=dance || vibe:=social)');
    });

    it('should handle date filters', () => {
      const result = buildTypesenseFilters({
        start: '2024-06-01',
        end: '2024-06-30',
      });
      expect(result).toContain('startsAt:>=');
      expect(result).toContain('endsAt:<=');
    });
  });

  describe('parseUrlFilters', () => {
    it('should parse empty search params', () => {
      const searchParams = new URLSearchParams();
      const result = parseUrlFilters(searchParams);
      expect(result).toEqual({
        q: undefined,
        country: undefined,
        region: undefined,
        city: undefined,
        type: undefined,
        estSize: undefined,
        priceBand: undefined,
        vibe: [],
        clothingOptional: undefined,
        amenities: [],
        start: undefined,
        end: undefined,
        limit: 20,
      });
    });

    it('should parse single filter', () => {
      const searchParams = new URLSearchParams('country=United Kingdom');
      const result = parseUrlFilters(searchParams);
      expect(result.country).toBe('United Kingdom');
    });

    it('should parse array filters', () => {
      const searchParams = new URLSearchParams();
      searchParams.append('vibe', 'dance');
      searchParams.append('vibe', 'social');
      const result = parseUrlFilters(searchParams);
      expect(result.vibe).toEqual(['dance', 'social']);
    });
  });

  describe('buildUrlFromFilters', () => {
    it('should build empty query string for no filters', () => {
      const result = buildUrlFromFilters({});
      expect(result).toBe('');
    });

    it('should build query string for single filter', () => {
      const result = buildUrlFromFilters({ country: 'United Kingdom' });
      expect(result).toBe('country=United%20Kingdom');
    });

    it('should build query string for array filters', () => {
      const result = buildUrlFromFilters({ vibe: ['dance', 'social'] });
      expect(result).toBe('vibe=dance&vibe=social');
    });
  });
});