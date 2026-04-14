import { Injectable, signal } from '@angular/core';
import { AnyOrama, insertMultiple, search, create } from '@orama/orama';


@Injectable({ providedIn: 'root' })
export class SmartSearchService {
  private worker = new Worker(new URL('../workers/ai-search.worker.ts', import.meta.url));
  private db?: AnyOrama;
  private requestId = 0;

  isModelLoading = signal(false);
  isSearching = signal(false);
  isReady = signal(false);
  isIndexReady = signal(false);
  isIndexing = signal(false);

  private workerReady = new Promise<void>(resolve => {
    this.worker.onmessage = ({ data }) => {
      if (data.type === 'ready') {
        this.isReady.set(true);
        resolve();
      }
    };
  });

  constructor() {
    this.worker.postMessage({ type: 'init' });
  }

  // 1. Initialize the Orama DB and Index your local data
  async initializeIndex(listings: any[]) {
  if (this.isIndexReady() || this.isIndexing()) return;

  this.isIndexing.set(true);

  // Wait for the worker model to finish loading before sending embed messages
  await this.workerReady;

  this.db = await create({
    schema: {
      id: 'string',
      position: 'string',
      company: 'string',
      location: 'string',
      contract: 'string',
      logo: 'string',
      logoBackground: 'string',
      postedAt: 'string',
      fullText: 'string',
      embedding: 'vector[384]',
    } as const,
  });

  // Keep text short to stay within the 256-token model limit
  // Position + key requirements is enough signal for semantic matching
  const entries = await Promise.all(listings.map(async (job) => {
      const requirementsSummary = job.requirements?.items?.slice(0, 3).join('. ') ?? '';
      const textToEmbed = `${job.position} at ${job.company}. ${requirementsSummary}`.toLowerCase();

      const embedding = await this.getQueryEmbedding(textToEmbed);

      return {
        id: job.id.toString(),
        position: job.position,
        company: job.company,
        location: job.location,
        contract: job.contract,
        logo: job.logo,
        logoBackground: job.logoBackground,
        postedAt: job.postedAt,
        fullText: textToEmbed,
        embedding: embedding
      };
  }));

  await insertMultiple(this.db, entries);
  this.isIndexReady.set(true);
  this.isIndexing.set(false);
}

  // 2. The Smart Search function
  async performSearch(queryText: string) {
    if (!this.db || !this.isIndexReady() || !queryText) return null;
    
    // Normalize query to match the indexing style
    const normalizedQuery = queryText.toLowerCase().trim();
    this.isSearching.set(true);
    const queryEmbedding = await this.getQueryEmbedding(normalizedQuery);

    const results = await search(this.db, {
      mode: 'hybrid',
      term: normalizedQuery,
      vector: {
        value: queryEmbedding,
        property: 'embedding',
      },
      similarity: 0.25,
      limit: 20,
    });

    this.isSearching.set(false);
    this.isIndexReady.set(true);
    return results.hits.map(hit => hit.document);
  }

  // Your existing Worker communication logic
  async getQueryEmbedding(text: string): Promise<number[]> {
    const id = ++this.requestId;
    return new Promise((resolve) => {
      const listener = ({ data }: MessageEvent) => {
        if (data.type === 'embedding_complete' && data.id === id) {
          this.worker.removeEventListener('message', listener);
          resolve(data.embedding);
        }
      };
      this.worker.addEventListener('message', listener);
      this.worker.postMessage({ type: 'embed', text, id });
    });
  }
}