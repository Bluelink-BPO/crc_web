// lib/tokenStore.ts
import fs from 'fs';
import path from 'path';

const tokenPath = path.resolve('/tmp/token_temporal.txt');

export const guardarTokenTemporal = (token: string) => {
  fs.writeFileSync(tokenPath, token, 'utf-8');
};

export const obtenerTokenTemporal = (): string | null => {
  if (fs.existsSync(tokenPath)) {
    return fs.readFileSync(tokenPath, 'utf-8').trim();
  }
  return null;
};

export const borrarTokenTemporal = () => {
  if (fs.existsSync(tokenPath)) {
    fs.unlinkSync(tokenPath);
  }
};
