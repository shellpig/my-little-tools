import town from './town.js';
import station from './station.js';

export const LEVELS = [town, station];

export function levelById(id) {
  return LEVELS.find(l => l.id === id) ?? town;
}
