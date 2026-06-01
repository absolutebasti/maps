// Country detail / edit sheet — native port of the web CountryEditDialog.
// Same fields and store actions (visited toggle, note, visited date, rating,
// tags). Opened by long-pressing a country on the map (tap = toggle visited).
// Rendered as a bottom-anchored Modal; web-only analytics/toast are dropped.
import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppStore, PREDEFINED_TAGS } from "../core/state/store";
import { getCountryNameById } from "../core/map";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/tokens";

export function CountryEditSheet() {
  const insets = useSafeAreaInsets();
  const { c } = useTheme();

  const editingId = useAppStore((s) => s.editingCountryId);
  const closeEditDialog = useAppStore((s) => s.closeEditDialog);
  const country = useAppStore((s) =>
    editingId ? s.countriesById[editingId] : undefined
  );
  const toggleVisited = useAppStore((s) => s.toggleVisited);
  const setNote = useAppStore((s) => s.setNote);
  const setVisitedAt = useAppStore((s) => s.setVisitedAt);
  const setRating = useAppStore((s) => s.setRating);
  const addTagToCountry = useAppStore((s) => s.addTagToCountry);
  const removeTagFromCountry = useAppStore((s) => s.removeTagFromCountry);

  const visible = !!editingId;
  const countryName = editingId ? getCountryNameById(editingId) : "";
  const isVisited = country?.visited ?? false;
  const rating = country?.rating ?? 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={closeEditDialog}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: c.backdrop }]}
        onPress={closeEditDialog}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kav}
        pointerEvents="box-none"
      >
        <View style={[styles.sheet, { backgroundColor: c.card, paddingBottom: insets.bottom + 16 }]}>
          <View style={[styles.grabber, { backgroundColor: c.border }]} />
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: c.text, fontFamily: fonts.bold }]} numberOfLines={1}>
              {countryName}
            </Text>
            <Pressable onPress={closeEditDialog} hitSlop={10}>
              <Text style={[styles.close, { color: c.subtext }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Visited toggle */}
            <Pressable
              onPress={() => editingId && toggleVisited(editingId)}
              style={[
                styles.visitedBtn,
                isVisited
                  ? styles.visitedOn
                  : [styles.visitedOff, { backgroundColor: c.muted, borderColor: c.border }],
              ]}
            >
              <Text
                style={[
                  styles.visitedText,
                  isVisited ? styles.visitedTextOn : { color: c.text },
                ]}
              >
                {isVisited ? "✓  Visited" : "○  Mark as visited"}
              </Text>
            </Pressable>

            {/* Note */}
            <Text style={[styles.label, { color: c.subtext }]}>Note</Text>
            <TextInput
              style={[styles.noteInput, { backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }]}
              placeholder="Add notes about your trip…"
              placeholderTextColor={c.placeholder}
              value={country?.note ?? ""}
              onChangeText={(text) => editingId && setNote(editingId, text)}
              maxLength={2000}
              multiline
              textAlignVertical="top"
            />

            {/* Visited date */}
            <Text style={[styles.label, { color: c.subtext }]}>Visited date</Text>
            <TextInput
              style={[styles.dateInput, { backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={c.placeholder}
              value={country?.visitedAt ?? ""}
              onChangeText={(text) =>
                editingId && setVisitedAt(editingId, text || undefined)
              }
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Rating */}
            <View style={styles.ratingHeader}>
              <Text style={[styles.label, { color: c.subtext }]}>Rating</Text>
              {rating > 0 && (
                <Pressable onPress={() => editingId && setRating(editingId, undefined)}>
                  <Text style={styles.clear}>Clear</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Pressable
                  key={idx}
                  hitSlop={6}
                  onPress={() => editingId && setRating(editingId, idx + 1)}
                >
                  <Text
                    style={[
                      styles.star,
                      { color: idx < rating ? "#FBBF24" : "#D1D5DB" },
                    ]}
                  >
                    ★
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Tags */}
            <Text style={[styles.label, { color: c.subtext }]}>Tags</Text>
            <View style={styles.tagsRow}>
              {PREDEFINED_TAGS.map((tag) => {
                const isActive = country?.tags?.includes(tag.id) ?? false;
                return (
                  <Pressable
                    key={tag.id}
                    onPress={() => {
                      if (!editingId) return;
                      if (isActive) removeTagFromCountry(editingId, tag.id);
                      else addTagToCountry(editingId, tag.id);
                    }}
                    style={[
                      styles.tag,
                      {
                        borderColor: tag.color,
                        backgroundColor: isActive ? tag.color : "transparent",
                        opacity: isActive ? 1 : 0.7,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: isActive ? "#fff" : c.text },
                      ]}
                    >
                      {tag.emoji}  {tag.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  kav: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    maxHeight: "85%",
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "700", flex: 1 },
  close: { fontSize: 18, color: "#6B7280", paddingHorizontal: 4 },
  scroll: { flexGrow: 0 },
  scrollContent: { paddingBottom: 8 },
  visitedBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  visitedOn: { backgroundColor: "#16A34A" },
  visitedOff: {
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
  },
  visitedText: { fontSize: 15, fontWeight: "600" },
  visitedTextOn: { color: "#fff" },
  visitedTextOff: { color: "#374151" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 6,
  },
  noteInput: {
    minHeight: 84,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  dateInput: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clear: { color: "#2563EB", fontSize: 13, fontWeight: "600", marginTop: 16 },
  starsRow: { flexDirection: "row", gap: 8 },
  star: { fontSize: 34 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tagText: { fontSize: 14, fontWeight: "600" },
});
