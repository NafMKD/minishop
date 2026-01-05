export function OrdersLayout({
  list,
  sidebar,
}: {
  list: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">{list}</div>
      <div className="lg:col-span-4">{sidebar}</div>
    </div>
  );
}
