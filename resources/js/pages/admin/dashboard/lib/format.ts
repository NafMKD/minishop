export function money(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export function formatDate(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}
