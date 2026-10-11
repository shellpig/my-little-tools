import town from './town.js';

export const LEVELS = [town];

export function levelById(id) {
  return LEVELS.find(l => l.id === id) ?? town;
}
