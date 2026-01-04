import type React from 'react';

export function CartLayout({
  items,
  summary,
}: {
  items: React.ReactNode;
  summary: React.ReactNode;
}) {
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]">{items}{summary}</div>;
}
