import { NextRequest, NextResponse } from 'next/server';
import { typesense } from '@/lib/typesense';
import { parseUrlFilters, buildTypesenseFilters } from '@/lib/filters';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseUrlFilters(searchParams);
    
    const searchParameters = {
      q: filters.q || '*',
      query_by: 'name,country,region,city',
      filter_by: buildTypesenseFilters(filters),
      sort_by: 'startsAt:asc',
      per_page: 100, // Cap at 100 for calendar export
    };

    const searchResults = await typesense.collections('events').documents().search(searchParameters);

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BearAtlas//Bear Events Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    searchResults.hits.forEach((hit: any) => {
      const event = hit.document;
      const startDate = format(new Date(event.startsAt), 'yyyyMMddTHHmmss');
      const endDate = format(new Date(event.endsAt), 'yyyyMMddTHHmmss');
      
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${event.id}@bearatlas.com`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${event.name}`,
        `DESCRIPTION:${event.name} - ${event.city}, ${event.country}`,
        `LOCATION:${event.city}, ${event.country}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    return new NextResponse(icsContent.join('\r\n'), {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': 'attachment; filename="bear-events.ics"',
      },
    });
  } catch (error) {
    console.error('Error generating ICS:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    );
  }
}