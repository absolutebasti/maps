"use client";

import { Button } from "./ui/button";
import { exportJson } from "./../lib/persist/local";
import { useAppStore } from "./../lib/state/store";

export function ExportJsonButton() {
  const snapshot = useAppStore((s) => ({
    countriesById: s.countriesById,
    tagsById: s.tagsById,
    settings: s.settings
  }));

  const onClick = () => {
    const text = exportJson(snapshot);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mymap.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return <Button variant="secondary" onClick={onClick}>Export JSON</Button>;
}


