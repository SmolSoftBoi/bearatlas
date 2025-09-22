import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().optional(),
  country: z.string().length(2).regex(/^[A-Z]{2}$/).optional(),
  type: z.array(z.enum(['RUN', 'WEEK', 'CRUISE', 'RESORT', 'PARTY'])).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = searchSchema.parse(Object.fromEntries(searchParams));

    // Query Typesense directly to minimise deps
    const apiKey = process.env.TYPESENSE_API_KEY || 'changeme';
    const host = process.env.TYPESENSE_HOST || 'localhost';
    const port = Number(process.env.TYPESENSE_PORT || 8108);
    const protocol = process.env.TYPESENSE_PROTOCOL || 'http';

    const filters: string[] = [];
    if (parsed.country) filters.push(`country:=${parsed.country}`);
    if (parsed.type?.length) filters.push(`type:=[${parsed.type.join(',')}]`);

    const qs = new URLSearchParams({
      q: parsed.q || '*',
      query_by: 'name',
      sort_by: 'startsAt:asc',
      per_page: String(parsed.limit),
      page: String(parsed.page)
    });
    if (filters.length) {
      qs.set('filter_by', filters.join(' && '));
    }

    const url = `${protocol}://${host}:${port}/collections/events/documents/search?${qs.toString()}`;
    const res = await fetch(url, { headers: { 'X-TYPESENSE-API-KEY': apiKey } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Search failed' }, { status: 502 });
    }
    const data = await res.json();

    const total = data.found || 0;
    const events = (data.hits || []).map((h: any) => h.document);

    return NextResponse.json({
      events,
      pagination: {
        page: parsed.page,
        limit: parsed.limit,
        total,
        totalPages: Math.ceil(total / parsed.limit)
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
