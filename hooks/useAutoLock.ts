// hooks/useAutoLock.ts
import React, { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

export const useAutoLock = (timeoutMs: number = 30000) => {
  const { setUnlocked, isUnlocked } = useAuthStore();
  const timeoutRef = useRef<React.NodeJS.Timeout | null>(null);
  const pausedRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (isUnlocked && !pausedRef.current) {
      timeoutRef.current = setTimeout(() => {
        // console.log("Auto-lock triggered");
        setUnlocked(false);
      }, timeoutMs);
    }
  }, [timeoutMs, isUnlocked, setUnlocked, clearTimer]);

  const resetTimer = useCallback(() => {
    if (isUnlocked && !pausedRef.current) startTimer();
  }, [isUnlocked, startTimer]);

  const pauseTimer = useCallback(() => {
    pausedRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const resumeTimer = useCallback(() => {
    pausedRef.current = false;
    startTimer();
  }, [startTimer]);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (
        previousAppState === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        if (isUnlocked) {
          // console.log("App backgrounded - locking immediately");
          clearTimer();
          setUnlocked(false);
        }
      } else if (
        previousAppState.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (isUnlocked && !pausedRef.current) startTimer();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    if (isUnlocked) startTimer();

    return () => {
      subscription?.remove();
      clearTimer();
    };
  }, [isUnlocked, setUnlocked, startTimer, clearTimer]);

  useEffect(() => {
    if (isUnlocked) startTimer();
    else clearTimer();
  }, [isUnlocked, startTimer, clearTimer]);

  return { resetTimer, clearTimer, pauseTimer, resumeTimer };
};