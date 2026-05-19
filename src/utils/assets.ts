import type { SyntheticEvent } from 'react';

export const DEFAULT_IMAGE = '/DefaultImage.jpg';

export const getAssetUrl = (url?: string) => {
  return url ?? '';
};

export const useDefaultImageOnError = (event: SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  if (!image.src.endsWith(DEFAULT_IMAGE)) {
    image.src = DEFAULT_IMAGE;
  }
};
