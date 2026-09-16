import { cornwall } from './cornwall.js';
import { aucc } from './aucc.js';

export const clubs = {
  cornwall,
  aucc,
};

export const clubList = Object.values(clubs);

export function getClubBySlug(slug) {
  if (!slug) return null;
  const key = String(slug).toLowerCase();
  return clubs[key] || null;
}
