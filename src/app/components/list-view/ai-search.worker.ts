/// <reference lib="webworker" />

import { pipeline, env } from '@huggingface/transformers';

// Skip local model check if you want to use the Hugging Face hub directly
env.allowLocalModels = false;

let embedder: any = null;

addEventListener('message', async ({ data }) => {
  if (data.type === 'init') {
    try {
      // Load the feature extraction pipeline (embeddings)
      // 'all-MiniLM-L6-v2' is a common, small, and fast model for semantic search
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      postMessage({ type: 'ready' });
    } catch (error) {
    }
  }

  if (data.type === 'embed') {
    if (!embedder) return;

    try {
      // Generate the embedding for the text
      const output = await embedder(data.text, {
        pooling: 'mean',
        normalize: true,
      });

      const embedding = Array.from(output.data);
      postMessage({ type: 'embedding_complete', embedding, id: data.id });
    } catch (error) {
    }
  }
});