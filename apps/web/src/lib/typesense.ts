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

export { client as typesense };