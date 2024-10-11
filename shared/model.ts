import { createStore, createEvent, sample } from "effector";
import { User } from "firebase/auth";

export const userLoginEvent = createEvent<{ user: User | null }>();
export const userLogoutEvent = createEvent();

export const $user = createStore<User | null>(null);
export const $userId = createStore<string | null>(null);
export const setUserId = createEvent<string | null>();

$userId.on(setUserId, (_userId, payload) => {
  return payload;
});

// Handle user login
$user.on(userLoginEvent, (_, { user }) => {
  return user;
});

// Handle user logout
$user.reset(userLogoutEvent);

sample({
  clock: userLoginEvent,
  fn: ({ user }) => user?.uid.substring("telegram:".length) || null,
  target: setUserId,
});
