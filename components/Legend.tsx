"use client";

import { useAppStore } from "./../lib/state/store";

export function Legend() {
  const tags = useAppStore((s) => s.tagsById);
  const tagList = Object.values(tags);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Legend</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#E8DCC4" }} />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#E5E7EB" }} />
          <span>Not visited</span>
        </div>
      </div>
      {tagList.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Tags</div>
          <div className="flex flex-wrap gap-2">
            {tagList.map((t) => (
              <span key={t.id} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                <span aria-hidden>{t.emoji ?? "🏷️"}</span>
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                {t.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


