import React from 'react';

export const CLOUDFLARE_R2_BUCKET_URL = 'https://a8fd2c76b4d3e6bbb74ce313746d2cbf.r2.cloudflarestorage.com/b2b';

/**
 * Resolves any B2B catalog image URL.
 * Automatically handles Cloudflare R2 bucket URLs, routing them through local assets or
 * the /api/r2/b2b proxy to guarantee 100% successful rendering without 400 Bad Request errors.
 */
export function getCatalogImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return '/catalog/club-football/adidas-arsenal-fc-golden-cannon-trefoil-tee.jpg';
  }

  const cleanUrl = url.trim();

  // If it's a Cloudflare R2 bucket URL
  if (cleanUrl.includes('a8fd2c76b4d3e6bbb74ce313746d2cbf.r2.cloudflarestorage.com/b2b')) {
    // Extract key path
    const keyPath = cleanUrl.replace(/https?:\/\/a8fd2c76b4d3e6bbb74ce313746d2cbf\.r2\.cloudflarestorage\.com\/b2b\/?/, '');
    const decodedKey = decodeURIComponent(keyPath);

    // If key starts with catalog/ or public/
    if (decodedKey.startsWith('catalog/')) {
      return `/${decodedKey}`;
    }
    if (decodedKey.startsWith('public/')) {
      return `/${decodedKey.replace(/^public\//, '')}`;
    }
    // Route via server proxy endpoint with local cache
    return `/api/r2/b2b/${encodeURIComponent(decodedKey)}`;
  }

  // Already a relative path or direct external link
  return cleanUrl;
}

/**
 * Fallback error handler for <img> tags.
 * Switches smoothly to the matching local asset if any network or CORS glitch occurs.
 */
export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  defaultFallback = '/catalog/club-football/adidas-arsenal-fc-golden-cannon-trefoil-tee.jpg'
) {
  const target = e.currentTarget;
  if (target.dataset.hasFailedTwice) return;

  if (!target.dataset.hasFailedOnce) {
    target.dataset.hasFailedOnce = 'true';
    try {
      const src = target.src || '';
      const filename = decodeURIComponent(src.split('/').pop()?.split('?')[0] || '');

      if (filename.includes('club-')) {
        target.src = `/catalog/club-football/${filename}`;
        return;
      }
      if (filename.includes('football_club')) {
        target.src = `/${filename}`;
        return;
      }
      if (
        filename.includes('adidas-') ||
        filename.includes('nike-') ||
        filename.includes('cactus-') ||
        filename.includes('air-jordan-')
      ) {
        target.src = `/catalog/club-football/${filename}`;
        return;
      }
      if (
        filename.includes('arutemika-') ||
        filename.includes('rawx-junior') ||
        filename.includes('rawx-stealth')
      ) {
        target.src = `/catalog/arutemika/${filename}`;
        return;
      }
      if (filename.includes('jute') || filename.includes('golden-jute') || filename.includes('fiber')) {
        target.src = `/catalog/jute/${filename}`;
        return;
      }
      if (filename.includes('rawx-')) {
        target.src = `/catalog/rawx/${filename}`;
        return;
      }
    } catch {
      // ignore
    }
  }

  target.dataset.hasFailedTwice = 'true';
  target.src = defaultFallback;
}
