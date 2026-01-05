export function toNumber(v: string | number | null | undefined) {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return v;
  const n = Number(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function money(amount: string | number) {
  const n = toNumber(amount);
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export function formatDate(input?: string | null) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });
}

