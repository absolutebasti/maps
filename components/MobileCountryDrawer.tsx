"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { CountryDrawer } from "./CountryDrawer";
import { useAppStore } from "./../lib/state/store";

export function MobileCountryDrawer() {
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const selectCountry = useAppStore((s) => s.selectCountry);

  return (
    <Sheet open={!!selectedId} onOpenChange={(open) => !open && selectCountry(undefined)}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] max-h-[85vh] overflow-y-auto pb-safe"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <SheetHeader>
          <SheetTitle>Country Details</SheetTitle>
        </SheetHeader>
        <div className="mt-4 sm:mt-6 pb-4">
          <CountryDrawer />
        </div>
      </SheetContent>
    </Sheet>
  );
}

