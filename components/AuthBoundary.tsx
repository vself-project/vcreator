"use client";

import React, { useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithCustomToken,
} from "firebase/auth";
import { app } from "../shared/firebase";
import { getAnalytics, setUserProperties } from "firebase/analytics";
import { User } from "firebase/auth";
import { $user, userLoginEvent } from "../shared/model";
import { useUnit } from "effector-react";
import { useInitData, useLaunchParams } from "@telegram-apps/sdk-react";
import { Spinner } from "@telegram-apps/telegram-ui";

export const AuthBoundary = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegram, setIsTelegram] = useState(false);

  const user: User | null = useUnit($user);
  const initDataRaw = useLaunchParams().initDataRaw;
  const initData = useInitData();
  const auth = getAuth(app);
  const analytics = getAnalytics(app);

  useEffect(() => {
    setIsTelegram(!!initDataRaw && !!initData);
  }, [initDataRaw, initData]);

  useEffect(() => {
    if (isTelegram && initDataRaw && initData) {
      const validateTelegramUser = async () => {
        try {
          console.log("data :", initData, initDataRaw);

          const response = await fetch("/api/validateTelegramUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...initData,
              raw: initDataRaw,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to validate Telegram user");
          }

          const { token } = await response.json();
          const user = await signInWithCustomToken(auth, token);

          if (initData.user) {
            // setUserProperties(analytics, { telegram_premium: initData.user.isPremium });
          }
        } catch (error) {
          console.error("Error validating Telegram user:", error);
        } finally {
          setIsLoading(false);
        }
      };

      validateTelegramUser();
    } else if (!isTelegram) {
      setIsLoading(false);
    }
  }, [isTelegram, initDataRaw, auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      userLoginEvent({ user });
    });
    return () => unsubscribe();
  }, [auth]);

  if (!user && !isLoading) return;

  return user ? children : <div className='root__loading'>Loading</div>;
};
