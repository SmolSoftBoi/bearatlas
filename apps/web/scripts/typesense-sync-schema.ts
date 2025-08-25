import Typesense from 'typesense-instantsearch-adapter';

const client = new Typesense({
  nodes: [{
    host: process.env.TYPESENSE_HOST || 'typesense',
    port: parseInt(process.env.TYPESENSE_PORT || '8108'),
    protocol: process.env.TYPESENSE_PROTOCOL || 'http'
  }],
  apiKey: process.env.TYPESENSE_API_KEY || 'devkey',
  connectionTimeoutSeconds: 2
});

async function syncSchema() {
  console.log('🔄 Syncing Typesense schema...');

  try {
    // Check if collection exists
    try {
      await client.collections('events').retrieve();
      console.log('✅ Collection "events" already exists');
      return;
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create collection
    const schema = {
      name: 'events',
      fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string', facet: true },
        { name: 'startsAt', type: 'int64', facet: true, sort: true },
        { name: 'endsAt', type: 'int64', facet: true, sort: true },
        { name: 'durationDays', type: 'int32', facet: true, sort: true },
        { name: 'country', type: 'string', facet: true },
        { name: 'region', type: 'string', facet: true },
        { name: 'city', type: 'string', facet: true },
        { name: 'estSize', type: 'string', facet: true },
        { name: 'priceBand', type: 'string', facet: true },
        { name: 'vibe', type: 'string[]', facet: true },
        { name: 'clothingOptional', type: 'bool', facet: true },
        { name: 'amenities', type: 'string[]', facet: true },
        { name: 'latitude', type: 'float' },
        { name: 'longitude', type: 'float' },
        { name: 'venues', type: 'string[]' },
        { name: 'links', type: 'object' },
        { name: 'sourceId', type: 'string' },
        { name: 'sourceName', type: 'string' },
        { name: 'sourceCode', type: 'string' },
      ],
      default_sorting_field: 'startsAt'
    };

    await client.collections().create(schema);
    console.log('✅ Collection "events" created successfully');

  } catch (error) {
    console.error('❌ Error syncing schema:', error);
    throw error;
  }
}

syncSchema()
  .then(() => {
    console.log('🎉 Schema sync completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Schema sync failed:', error);
    process.exit(1);
  });