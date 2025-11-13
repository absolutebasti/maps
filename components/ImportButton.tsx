"use client";

import { Button } from "./ui/button";
import { importJson } from "./../lib/persist/local";
import { useAppStore } from "./../lib/state/store";

export function ImportButton() {
  const setState = useAppStore.setState;

  const onClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      const data = importJson(text);
      setState((prev) => ({
        ...prev,
        countriesById: data.countriesById,
        tagsById: data.tagsById,
        settings: data.settings
      }));
    };
    input.click();
  };

  return <Button variant="secondary" onClick={onClick}>Import</Button>;
}


