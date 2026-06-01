// Email/password sign-in & sign-up modal — native port of the web AuthDialog.
// Uses the ported signIn / signUp helpers. On sign-up, Supabase may require
// email confirmation (handled via the existing flow / a deep link later).
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import { signIn, signUp } from "../core/supabase/auth";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function AuthSheet({ visible, onClose, onSuccess }: Props) {
  const { c } = useTheme();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const reset = () => {
    setPassword("");
    setMessage(null);
    setLoading(false);
  };

  const submit = async () => {
    if (!email.trim() || !password) {
      setMessage("Enter your email and password.");
      return;
    }
    setLoading(true);
    setMessage(null);
    const fn = mode === "signin" ? signIn : signUp;
    const { user, session, error } = await fn(email.trim(), password);
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (mode === "signup" && !session) {
      setMessage("Check your email to confirm your account, then sign in.");
      setMode("signin");
      return;
    }
    if (user) {
      onSuccess();
      reset();
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: c.backdrop }]} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kav}
        pointerEvents="box-none"
      >
        <View style={[styles.sheet, { backgroundColor: c.card }]}>
          <View style={[styles.grabber, { backgroundColor: c.border }]} />
          <Text style={[styles.title, { color: c.text, fontFamily: fonts.bold }]}>
            {mode === "signin" ? "Sign in" : "Create account"}
          </Text>
          <Text style={[styles.subtitle, { color: c.subtext }]}>
            Sync your map across devices.
          </Text>

          <TextInput
            style={[styles.input, { backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }]}
            placeholder="Email"
            placeholderTextColor={c.placeholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            style={[styles.input, { backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }]}
            placeholder="Password"
            placeholderTextColor={c.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            textContentType="password"
          />

          {message && <Text style={[styles.message, { color: c.danger }]}>{message}</Text>}

          <Pressable
            style={[styles.submit, { backgroundColor: c.primary }]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={c.primaryText} />
            ) : (
              <Text style={[styles.submitText, { color: c.primaryText }]}>
                {mode === "signin" ? "Sign in" : "Sign up"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setMessage(null);
            }}
          >
            <Text style={[styles.switch, { color: c.subtext }]}>
              {mode === "signin"
                ? "No account? Create one"
                : "Already have an account? Sign in"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  kav: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 14, marginTop: 2, marginBottom: 16 },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  message: { fontSize: 13, marginBottom: 10 },
  submit: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  submitText: { fontSize: 16, fontWeight: "700" },
  switch: { textAlign: "center", fontSize: 14, marginTop: 16 },
});
