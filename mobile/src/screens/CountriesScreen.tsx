// Countries tab — the searchable / filterable country list with per-row toggle,
// edit, and "show on map". Ports the web Legend's country list + filter buttons
// + CountrySearch + the /countries manage page into one native screen.
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppStore } from "../core/state/store";
import { getWorldCountryList } from "../core/map";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/tokens";

type Filter = "all" | "visited" | "bucket";

type Props = {
  /** Select a country and jump to the Map tab. */
  onLocate?: (id: string) => void;
};

const ALL_COUNTRIES = getWorldCountryList();

export function CountriesScreen({ onLocate }: Props) {
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const countriesById = useAppStore((s) => s.countriesById);
  const toggleVisited = useAppStore((s) => s.toggleVisited);
  const openEditDialog = useAppStore((s) => s.openEditDialog);

  const visitedCount = useMemo(
    () => Object.values(countriesById).filter((c) => c.visited).length,
    [countriesById]
  );

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_COUNTRIES.filter((c) => {
      const visited = Boolean(countriesById[c.id]?.visited);
      if (filter === "visited" && !visited) return false;
      if (filter === "bucket" && visited) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, filter, countriesById]);

  return (
    <View style={[styles.root, { backgroundColor: c.bg, paddingTop: insets.top + 8 }]}>
      <Text style={[styles.title, { color: c.text, fontFamily: fonts.bold }]}>Countries</Text>
      <Text style={[styles.subtitle, { color: c.subtext }]}>
        {visitedCount} / {ALL_COUNTRIES.length} visited
      </Text>

      <TextInput
        style={[styles.search, { backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }]}
        placeholder="Find any country…"
        placeholderTextColor={c.placeholder}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <View style={styles.filters}>
        {(
          [
            { key: "all", label: "All" },
            { key: "visited", label: "Visited" },
            { key: "bucket", label: "Bucket List" },
          ] as Array<{ key: Filter; label: string }>
        ).map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              style={[
                styles.filterBtn,
                { backgroundColor: active ? c.primary : c.muted },
              ]}
              onPress={() => setFilter(f.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: active ? c.primaryText : c.mutedText },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        initialNumToRender={20}
        windowSize={10}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: c.subtext }]}>
            No matches. Try a different search.
          </Text>
        }
        renderItem={({ item }) => {
          const visited = Boolean(countriesById[item.id]?.visited);
          return (
            <View style={[styles.row, visited && { backgroundColor: c.rowVisitedBg }]}>
              <Pressable
                style={styles.rowMain}
                onPress={() => toggleVisited(item.id)}
              >
                <Text style={[styles.rowName, { color: c.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                {visited && <Text style={styles.check}>✓</Text>}
              </Pressable>
              {onLocate && (
                <Pressable
                  style={styles.iconBtn}
                  hitSlop={6}
                  onPress={() => onLocate(item.id)}
                >
                  <Text style={styles.icon}>📍</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.iconBtn}
                hitSlop={6}
                onPress={() => openEditDialog(item.id)}
              >
                <Text style={styles.icon}>✎</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "800" },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2, marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    color: "#111827",
    marginBottom: 10,
  },
  filters: { flexDirection: "row", gap: 8, marginBottom: 12 },
  filterBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  filterBtnActive: { backgroundColor: "#111827" },
  filterText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  filterTextActive: { color: "#fff" },
  listContent: { paddingBottom: 24 },
  empty: { textAlign: "center", color: "#9CA3AF", marginTop: 32, fontSize: 13 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 2,
  },
  rowVisited: { backgroundColor: "#F0FDF4" },
  rowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  rowName: { fontSize: 15, color: "#111827", flex: 1 },
  check: { color: "#16A34A", fontWeight: "800", fontSize: 16, marginLeft: 8 },
  iconBtn: { padding: 10 },
  icon: { fontSize: 16 },
});
