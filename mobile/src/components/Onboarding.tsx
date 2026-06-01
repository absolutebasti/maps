// First-launch onboarding — native port of the web 4-step intro, gated by an
// AsyncStorage flag. Copy is adapted to touch interactions (tap / long-press /
// tabs) instead of the web's mouse + menu hints.
import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/tokens";
import { OnboardingIcon, type GlyphName } from "./OnboardingIcon";

export const ONBOARDING_KEY = "mymap.onboarding.completed";

const STEPS: Array<{ glyph: GlyphName; title: string; body: string }> = [
  {
    glyph: "globe",
    title: "Welcome to MyMap",
    body: "Tap any country on the map to mark it as visited.",
  },
  {
    glyph: "pin",
    title: "Mark your travels",
    body: "Long-press a country to add notes, a visit date, a star rating, and tags like Favorite or Want to Visit.",
  },
  {
    glyph: "list",
    title: "Browse & search",
    body: "Use the Countries tab to search, filter, and manage every country — tap the locate icon to jump to it on the map.",
  },
  {
    glyph: "palette",
    title: "Make it yours",
    body: "Change your map's colors and fill style in Settings, then share or export your travel map.",
  },
];

export function Onboarding() {
  const { c } = useTheme();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const done = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (active && !done) setShow(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const complete = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setShow(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else void complete();
  };
  const back = () => step > 0 && setStep(step - 1);

  if (!show) return null;
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={complete}>
      <View style={[styles.backdrop, { backgroundColor: c.backdrop }]}>
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <Pressable style={styles.skip} onPress={complete} hitSlop={10}>
            <Text style={[styles.skipText, { color: c.subtext }]}>Skip</Text>
          </Pressable>

          <View style={styles.icon}>
            <OnboardingIcon name={current.glyph} color={c.text} />
          </View>
          <Text style={styles.stepBadge}>
            Step {step + 1} of {STEPS.length}
          </Text>
          <Text style={[styles.title, { color: c.text, fontFamily: fonts.bold }]}>
            {current.title}
          </Text>
          <Text style={[styles.body, { color: c.subtext }]}>{current.body}</Text>

          <View style={styles.dots}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: c.border },
                  i === step ? [styles.dotActive, { backgroundColor: c.primary }] : undefined,
                ]}
              />
            ))}
          </View>

          <View style={styles.actions}>
            {step > 0 ? (
              <Pressable style={[styles.backBtn, { borderColor: c.border }]} onPress={back}>
                <Text style={[styles.backText, { color: c.text }]}>Back</Text>
              </Pressable>
            ) : (
              <View style={styles.backBtnSpacer} />
            )}
            <Pressable style={[styles.nextBtn, { backgroundColor: c.primary }]} onPress={next}>
              <Text style={[styles.nextText, { color: c.primaryText }]}>
                {isLast ? "Get started" : "Next"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  skip: { position: "absolute", top: 14, right: 16, padding: 4 },
  skipText: { color: "#9CA3AF", fontSize: 14, fontWeight: "600" },
  icon: { marginTop: 12, marginBottom: 14 },
  stepBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  body: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  dots: { flexDirection: "row", gap: 6, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#E5E7EB" },
  dotActive: { width: 22, backgroundColor: "#111827" },
  actions: { flexDirection: "row", gap: 10, alignSelf: "stretch" },
  backBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  backBtnSpacer: { flex: 1 },
  backText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  nextBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
  },
  nextText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
