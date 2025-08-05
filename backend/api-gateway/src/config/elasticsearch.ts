import { Client } from '@elastic/elasticsearch';
import { config } from './config';

let elasticsearch: Client;

export async function connectElasticsearch() {
  try {
    elasticsearch = new Client({
      node: config.elasticsearch.url,
      requestTimeout: 30000,
      pingTimeout: 3000,
      sniffOnStart: false,
    });

    // Test the connection
    const health = await elasticsearch.cluster.health();
    console.log('✅ Elasticsearch connection established');
    console.log(`📊 Cluster status: ${health.status}`);

    // Create indices if they don't exist
    await createIndices();
    
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error);
    throw error;
  }
}

async function createIndices() {
  try {
    // Transcripts index
    const transcriptsIndexExists = await elasticsearch.indices.exists({
      index: 'transcripts',
    });

    if (!transcriptsIndexExists) {
      await elasticsearch.indices.create({
        index: 'transcripts',
        body: {
          mappings: {
            properties: {
              eventId: { type: 'keyword' },
              companyId: { type: 'keyword' },
              companySymbol: { type: 'keyword' },
              companyName: { type: 'text' },
              content: {
                type: 'text',
                analyzer: 'standard',
                search_analyzer: 'standard',
              },
              speakers: { type: 'nested' },
              timestamps: { type: 'nested' },
              confidence: { type: 'float' },
              language: { type: 'keyword' },
              eventType: { type: 'keyword' },
              eventDate: { type: 'date' },
              createdAt: { type: 'date' },
            },
          },
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
            analysis: {
              analyzer: {
                financial_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'stop', 'financial_synonyms'],
                },
              },
              filter: {
                financial_synonyms: {
                  type: 'synonym',
                  synonyms: [
                    'revenue,sales,income',
                    'profit,earnings,income',
                    'ebitda,operating income',
                    'capex,capital expenditure',
                    'opex,operating expense',
                  ],
                },
              },
            },
          },
        },
      });
      console.log('✅ Transcripts index created');
    }

    // Documents index
    const documentsIndexExists = await elasticsearch.indices.exists({
      index: 'documents',
    });

    if (!documentsIndexExists) {
      await elasticsearch.indices.create({
        index: 'documents',
        body: {
          mappings: {
            properties: {
              eventId: { type: 'keyword' },
              companyId: { type: 'keyword' },
              companySymbol: { type: 'keyword' },
              companyName: { type: 'text' },
              type: { type: 'keyword' },
              title: {
                type: 'text',
                analyzer: 'standard',
              },
              extractedText: {
                type: 'text',
                analyzer: 'financial_analyzer',
              },
              fileName: { type: 'keyword' },
              fileUrl: { type: 'keyword' },
              mimeType: { type: 'keyword' },
              pageCount: { type: 'integer' },
              createdAt: { type: 'date' },
            },
          },
        },
      });
      console.log('✅ Documents index created');
    }

    // Companies index
    const companiesIndexExists = await elasticsearch.indices.exists({
      index: 'companies',
    });

    if (!companiesIndexExists) {
      await elasticsearch.indices.create({
        index: 'companies',
        body: {
          mappings: {
            properties: {
              symbol: { type: 'keyword' },
              name: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              exchange: { type: 'keyword' },
              sector: { type: 'keyword' },
              industry: { type: 'keyword' },
              marketCap: { type: 'long' },
              description: { type: 'text' },
              country: { type: 'keyword' },
              currency: { type: 'keyword' },
              isActive: { type: 'boolean' },
              createdAt: { type: 'date' },
            },
          },
        },
      });
      console.log('✅ Companies index created');
    }

  } catch (error) {
    console.error('❌ Error creating Elasticsearch indices:', error);
    throw error;
  }
}

export async function disconnectElasticsearch() {
  try {
    if (elasticsearch) {
      await elasticsearch.close();
      console.log('✅ Elasticsearch connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing Elasticsearch connection:', error);
    throw error;
  }
}

export { elasticsearch };