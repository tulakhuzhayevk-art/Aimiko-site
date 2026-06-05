export function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      <div
        className="aspect-[4/3] animate-pulse"
        style={{ background: "var(--bg-deeper)" }}
      />
      <div className="flex flex-1 flex-col gap-2 p-3 md:p-6">
        <div
          className="h-3 w-1/3 animate-pulse rounded"
          style={{ background: "var(--bg-deeper)" }}
        />
        <div
          className="h-5 w-3/4 animate-pulse rounded"
          style={{ background: "var(--bg-deeper)" }}
        />
        <div
          className="mt-2 h-6 w-1/2 animate-pulse rounded"
          style={{ background: "var(--bg-deeper)" }}
        />
      </div>
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
