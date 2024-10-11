import { NextRequest, NextResponse } from "next/server";
import { serverConfig } from "@/shared/config";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { InitData } from "@telegram-apps/sdk-react";
import { validateInitDataRaw } from "@/shared/utils";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  console.log("initializing firebase admin sdk", serverConfig.serviceAccount);
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serverConfig.serviceAccount.projectId,
      clientEmail: serverConfig.serviceAccount.clientEmail,
      privateKey: serverConfig.serviceAccount.privateKey,
    }),
  });
}

export async function POST(request: NextRequest) {
  const { initData } = await request.json();

  if (!initData) {
    return NextResponse.json({ error: "Missing initData" }, { status: 400 });
  }

  try {
    // Validate Telegram initData here
    const isValid = validateTelegramInitData(initData);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Telegram data" },
        { status: 401 }
      );
    }

    // Create a custom token
    const auth = getAuth();
    const uid = `telegram:${initData.user.id}`;
    const customToken = await auth.createCustomToken(uid);

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error("Error validating Telegram user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function validateTelegramInitData(
  initData: InitData & { raw: string }
): Promise<boolean> {
  // Implement the actual validation logic here
  // This should include verifying the hash, checking the timestamp, etc.
  // Return true if valid, false otherwise
  console.log(initData);

  // Get Firestore instance
  const db = admin.firestore();

  // Get the bot token from environment variables or your config
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN is not set");
    return false;
  }

  console.log(
    "validateInitDataRaw",
    validateInitDataRaw(initData.raw, botToken)
  );

  // Create the secret key
  //   const secretKey = HmacSHA256(botToken, "WebAppData");

  // Calculate the hash
  //   const calculatedHash = HmacSHA256(dataCheckString, secretKey).toString();

  //   console.log('calculated hash', calculatedHash);
  console.log("initData hash", initData.hash);

  // Verify the hash
  //   if (calculatedHash !== initData.hash) {
  //     console.error('Hash verification failed');
  //     return false;
  //   }

  // Check if the user exists in Firestore
  const userId = initData.user?.id;
  if (!userId) {
    console.error("User ID not found in initData");
    return false;
  }

  console.log("user id", userId);

  const usersCollection = db.collection("users");
  let userDoc = null;
  try {
    userDoc = await usersCollection.doc(userId.toString()).get();
  } catch (error) {
    console.error("Error getting user document:", error);
  }

  // create user document if it doesn't exist
  if (!userDoc || !userDoc.exists) {
    console.error("User not found in Firestore. Creating user document.");
    try {
      await usersCollection.doc(userId.toString()).set({
        ...initData.user,
        points: 0,
        createdAt: new Date(),
        lastLogin: new Date(),
        referralCode: initData.startParam || "",
      });
      console.log(`User document created for ID: ${userId}`);
      return true; // Return true as we've successfully created the user
    } catch (error) {
      console.error("Error creating user document:", error);
      return false;
    }
  } else {
    // update last login time
    try {
      await usersCollection.doc(userId.toString()).update({
        lastLogin: new Date(),
      });
      console.log(`Updated last login time for user ID: ${userId}`);
    } catch (error) {
      console.error("Error updating last login time:", error);
      // Note: We're not returning false here as this is not a critical error
      // The validation can still proceed even if updating the last login fails
    }
  }

  // If we've made it this far, the data is valid
  return true;
}
