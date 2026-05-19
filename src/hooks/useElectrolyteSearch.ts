import { useState, useRef, useEffect } from 'react';
import type { Electrolyte } from '../types';
import { cosineSimilarity } from '../utils/math';

export interface ProcessedElectrolyte extends Electrolyte {
  score: number;
  isVisible: boolean;
}

export const useElectrolyteSearch = (initialItems: Electrolyte[]) => {
  const [items, setItems] = useState<ProcessedElectrolyte[]>(
    initialItems.map(item => ({ ...item, score: 0, isVisible: true }))
  );
  const [imageEmbedding, setImageEmbedding] = useState<number[] | null>(null);
  const [ready, setReady] = useState(false);
  const [embeddingsReady, setEmbeddingsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/search.worker.ts', import.meta.url), {
      type: 'module',
    });

    workerRef.current.onmessage = (e) => {
      const { type, data } = e.data;

      switch (type) {
        case 'progress':
          if (data.status === 'progress') setProgress(data.progress);
          break;

        case 'text_embeddings_ready':
          setItems(prev =>
            prev.map(item => ({
              ...item,
              embedding: data[item.id],
            }))
          );
          console.log('Text embeddings attached:', Object.keys(data).length);
          setEmbeddingsReady(true);
          setReady(true);
          break;

        case 'image_embedding_ready':
          setImageEmbedding(data);
          break;

        case 'error':
          console.error('CLIP worker error:', data);
          break;

        default:
          break;
      }
    };

    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    setItems(initialItems.map(item => ({ ...item, score: 0, isVisible: true })));
    setImageEmbedding(null);

    if (initialItems.length === 0) {
      setEmbeddingsReady(false);
      setReady(false);
      return;
    }

    setEmbeddingsReady(false);
    setReady(false);
    workerRef.current?.postMessage({ type: 'init', data: initialItems });
  }, [initialItems]);

  useEffect(() => {
    if (!imageEmbedding || !embeddingsReady) return;

    setItems(prev => {
      if (!prev[0]?.embedding) return prev;

      const threshold = 0.03;
      const topK = 5;

      const processed = prev.map(item => {
        if (!item.embedding) return { ...item, score: 0, isVisible: false };

        const similarity = cosineSimilarity(imageEmbedding, item.embedding);
        console.log(`Item ${item.id} similarity:`, similarity);

        return {
          ...item,
          score: similarity,
          isVisible: similarity >= threshold,
        };
      });

      processed.sort((a, b) => b.score - a.score);

      let visibleCount = 0;
      return processed.map(item => {
        if (item.isVisible && visibleCount < topK) {
          visibleCount++;
          return item;
        }

        return { ...item, isVisible: false };
      });
    });
  }, [imageEmbedding, embeddingsReady]);

  const searchByImage = (file: File) => {
    if (!ready) return;
    workerRef.current?.postMessage({ type: 'image', data: file });
  };

  const resetSearch = () => {
    setImageEmbedding(null);
    setItems(prev => {
      const sortedById = [...prev].sort((a, b) => a.id - b.id);
      return sortedById.map(item => ({ ...item, score: 0, isVisible: true }));
    });
  };

  return { items, ready, progress, imageEmbedding, searchByImage, resetSearch };
};
