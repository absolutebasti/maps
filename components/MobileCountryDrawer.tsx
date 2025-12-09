"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { CountryDrawer } from "./CountryDrawer";
import { useAppStore } from "./../lib/state/store";
import { getCountryNameById } from "./../lib/map";

export function MobileCountryDrawer() {
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const selectCountry = useAppStore((s) => s.selectCountry);

  const countryName = selectedId ? getCountryNameById(selectedId) : "Country Details";

  // Only render on mobile (hidden on md and up via CSS in parent)
  return (
    <div className="md:hidden">
      <Sheet open={!!selectedId} onOpenChange={(open) => !open && selectCountry(undefined)}>
        <SheetContent
          side="bottom"
          className="max-h-[60vh] overflow-y-auto rounded-t-2xl pb-safe"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">{countryName}</SheetTitle>
          </SheetHeader>
          <div className="pb-4">
            <CountryDrawer />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}



