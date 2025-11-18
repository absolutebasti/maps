"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { importJson } from "./../lib/persist/local";
import { useAppStore } from "./../lib/state/store";
import { useToast } from "./ui/toast";

export function ImportButton() {
  const [open, setOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const setState = useAppStore.setState;
  const { toast } = useToast();

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        const text = await file.text();
        const data = importJson(text);
        
        // Basic validation
        if (!data || typeof data !== "object") {
          throw new Error("Invalid file format");
        }

        setState((prev) => ({
          ...prev,
          countriesById: data.countriesById || {},
          tagsById: data.tagsById || {},
          settings: data.settings || prev.settings
        }));

        toast({
          title: "Import successful",
          description: "Your data has been imported",
          variant: "success",
        });
        setOpen(false);
      } catch (error) {
        toast({
          title: "Import failed",
          description: error instanceof Error ? error.message : "Invalid file format",
          variant: "error",
        });
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">Import</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import your map data from a JSON file. This will replace your current data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isImporting}>
            {isImporting ? "Importing..." : "Choose File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


