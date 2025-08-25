import { NextRequest, NextResponse } from 'next/server';
import { typesense } from '@/lib/typesense';
import { parseUrlFilters, buildTypesenseFilters } from '@/lib/filters';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseUrlFilters(searchParams);
    
    const searchParameters = {
      q: filters.q || '*',
      query_by: 'name,country,region,city',
      filter_by: buildTypesenseFilters(filters),
      sort_by: 'startsAt:asc',
      per_page: filters.limit || 20,
    };

    const searchResults = await typesense.collections('events').documents().search(searchParameters);

    return NextResponse.json({
      hits: searchResults.hits,
      total: searchResults.found,
      facets: searchResults.facet_counts,
    });
  } catch (error) {
    console.error('Error searching events:', error);
    return NextResponse.json(
      { error: 'Failed to search events' },
      { status: 500 }
    );
  }
}