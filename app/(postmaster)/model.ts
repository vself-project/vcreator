import { $userId } from "@/shared/model";
import { UserData } from "@/shared/types";
import { createEvent, createStore } from "effector";
import { LOCAL_STORAGE_CURRENT_SCREEN_KEY_PREFIX } from "./constants";

export type Screen =
  | "main"
  | "member"
  | "brand"
  | "craft"
  | "selector"
  | "quiz-wizard"
  | "payment"
  | "personal"
  | "game-wizard"
  | "game-setup"
  | "campaigns";

export const $currentScreen = createStore<Screen>("main");
export const navigateTo = createEvent<Screen>();

$currentScreen.on(navigateTo, (_screen, payload) => {
  const p = window.localStorage.setItem(
    `${LOCAL_STORAGE_CURRENT_SCREEN_KEY_PREFIX}_${$userId.getState()}`,
    payload
  );
  return payload;
});

export const $userData = createStore<UserData | null>(null);
export const setUserData = createEvent<UserData | null>();

$userData.on(setUserData, (_userData, payload) => {
  return payload;
});
