import Typesense from 'typesense';

export function createTypesenseClient(): Typesense.Client {
  const apiKey = process.env.TYPESENSE_API_KEY || 'changeme';
  const host = process.env.TYPESENSE_HOST || 'localhost';
  const port = Number(process.env.TYPESENSE_PORT || 8108);
  const protocol = process.env.TYPESENSE_PROTOCOL || 'http';

  return new Typesense.Client({
    apiKey,
    nodes: [{ host, port, protocol }],
    connectionTimeoutSeconds: 5
  });
}

export const EVENTS_COLLECTION = 'events';

export const eventsSchema = {
  name: EVENTS_COLLECTION,
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string', facet: true },
    { name: 'startsAt', type: 'int64' },
    { name: 'endsAt', type: 'int64' },
    { name: 'country', type: 'string', facet: true },
    { name: 'region', type: 'string', facet: true },
    { name: 'city', type: 'string', facet: true },
    { name: 'vibe', type: 'string[]', facet: true },
    { name: 'amenities', type: 'string[]', facet: true }
  ],
  default_sorting_field: 'startsAt'
};
