"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAppStore } from "./../lib/state/store";

const AUTH_TIMER_DURATION = 15000; // 15 seconds

export function AuthTimer() {
  const [showModal, setShowModal] = useState(false);
  const user = useAppStore((s) => s.user);
  const hasSeenAuthModal = useAppStore((s) => s.hasSeenAuthModal);
  const setUser = useAppStore((s) => s.setUser);
  const setHasSeenAuthModal = useAppStore((s) => s.setHasSeenAuthModal);

  useEffect(() => {
    // Check if user is already logged in
    const authData = localStorage.getItem("mymap_auth");
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        setUser(parsedAuth);
        setHasSeenAuthModal(true);
        return;
      } catch (e) {
        // Invalid auth data
        localStorage.removeItem("mymap_auth");
      }
    }

    // If user is logged in or has seen the modal, don't show it
    if (user || hasSeenAuthModal) {
      return;
    }

    // Set timer to show modal after 15 seconds
    const timer = setTimeout(() => {
      setShowModal(true);
      setHasSeenAuthModal(true);
    }, AUTH_TIMER_DURATION);

    return () => clearTimeout(timer);
  }, [user, hasSeenAuthModal, setUser, setHasSeenAuthModal]);

  const handleAuthSuccess = (email: string) => {
    const authData = localStorage.getItem("mymap_auth");
    if (authData) {
      const parsedAuth = JSON.parse(authData);
      setUser(parsedAuth);
    }
    setShowModal(false);
  };

  const handleClose = () => {
    // Don't allow closing without auth for now
    // You can customize this behavior
  };

  return (
    <AuthModal
      isOpen={showModal && !user}
      onClose={handleClose}
      onSuccess={handleAuthSuccess}
    />
  );
}

