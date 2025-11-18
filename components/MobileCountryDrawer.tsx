"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { CountryDrawer } from "./CountryDrawer";
import { useAppStore } from "./../lib/state/store";

export function MobileCountryDrawer() {
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const selectCountry = useAppStore((s) => s.selectCountry);

  return (
    <Sheet open={!!selectedId} onOpenChange={(open) => !open && selectCountry(undefined)}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Country Details</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <CountryDrawer />
        </div>
      </SheetContent>
    </Sheet>
  );
}

