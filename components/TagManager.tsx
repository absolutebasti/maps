"use client";

import { useState } from "react";
import { useAppStore, type TagData } from "./../lib/state/store";
import { Button } from "./ui/button";

export function TagManager() {
  const tags = useAppStore((s) => s.tagsById);
  const upsertTag = useAppStore((s) => s.upsertTag);
  const deleteTag = useAppStore((s) => s.deleteTag);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [emoji, setEmoji] = useState("🏷️");

  const handleAdd = () => {
    if (!name.trim()) return;
    const id = name.trim().toLowerCase().replace(/\s+/g, "-");
    const tag: TagData = { id, name: name.trim(), color, emoji };
    upsertTag(tag);
    setName("");
  };

  const entries = Object.values(tags);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Tags</h4>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 text-sm rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          placeholder="New tag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="color"
          className="h-9 w-10 rounded-md border"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          className="w-16 text-sm rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          placeholder="Emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags yet.</p>
        ) : (
          entries.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden>
                  {t.emoji ?? "🏷️"}
                </span>
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-sm">{t.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteTag(t.id)}>
                Remove
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


