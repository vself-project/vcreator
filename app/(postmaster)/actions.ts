// 'use server'

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { app } from "@/shared/firebase";
import { UserData } from "@/shared/types";

export async function getUserData(userId: string): Promise<UserData | null> {
  const db = getFirestore(app);
  const userRef = doc(db, "users", userId);

  console.log("getUserData", userId);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserData;
      console.log(userData);
      return {
        ...userData,
      };
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function tapMana(userId: string): Promise<void> {
  const db = getFirestore(app);
  const userRef = doc(db, "users", userId);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserData;
      const mana = userData?.mana || 0; // current mana
      const lastTap = userData?.lastTap;

      let newMana = mana;
      const newLastTap = Date.now();
      const manaLimit = 24; // mana limit per cycle
      const timeLimit = 24 * 60 * 60 * 1000; // 24h cycle

      if (!lastTap) {
        // First time claim
        newMana += manaLimit;
      } else {
        // Update linearily
        const delta =
          (manaLimit *
            Math.min(
              timeLimit,
              Timestamp.now().toMillis() - lastTap.toMillis()
            )) /
          timeLimit;
        newMana += delta;
      }
      await updateDoc(userRef, {
        mana: newMana,
        lastTap: newLastTap,
      });
    } else {
      console.log("No such user!");
    }
  } catch (error) {
    console.error("Error while updating user data:", error);
  }

  try {
    updateDoc(userRef, {});
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}
