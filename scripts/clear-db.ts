import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const url = process.env.VITE_CONVEX_URL;

if (!url) {
  throw new Error('VITE_CONVEX_URL is required');
}

const client = new ConvexHttpClient(url);

await client.mutation(api.maintenance.clearAllData, {});
