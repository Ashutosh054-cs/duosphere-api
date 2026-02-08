import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

export const now = () => Math.floor(Date.now());

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
