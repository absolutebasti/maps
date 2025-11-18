"use client";

import { Button } from "./ui/button";
import { exportJson } from "./../lib/persist/local";
import { useAppStore } from "./../lib/state/store";
import { useToast } from "./ui/toast";

export function ExportJsonButton() {
  const snapshot = useAppStore((s) => ({
    countriesById: s.countriesById,
    tagsById: s.tagsById,
    settings: s.settings
  }));
  const { toast } = useToast();

  const onClick = () => {
    try {
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
      
      toast({
        title: "Export successful",
        description: "Your data has been downloaded",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "error",
      });
    }
  };

  return <Button variant="secondary" size="sm" onClick={onClick}>Export JSON</Button>;
}


