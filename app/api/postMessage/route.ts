import { Bot } from "grammy";
import { NextRequest, NextResponse } from "next/server";
import { InlineKeyboard, Keyboard } from "grammy";
import { Message } from "grammy/types";
import { serverConfig } from "@/shared/config";
import * as admin from "firebase-admin";

const token = process.env.TELEGRAM_BOT_TOKEN;
console.log("Bot token:", token);

if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

const bot = new Bot(token);

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
  const { postData } = await request.json();

  if (!postData) {
    return NextResponse.json({ error: "Missing postData" }, { status: 400 });
  }

  try {
    // Validate postData
    const isValid = true;

    if (!isValid) {
      return NextResponse.json({ error: "Invalid post data" }, { status: 401 });
    }

    //

    // compose keyboard
    let buttonsRow = [];

    if (postData.appUrl) {
      buttonsRow.push(InlineKeyboard.url(postData.appTitle, postData.appUrl));
    }

    if (postData.community) {
      buttonsRow.push(
        InlineKeyboard.url(
          "Join Community",
          `https://t.me/${postData.community}`
        )
      );
    }

    const keyboard = InlineKeyboard.from([buttonsRow]);
    const chatId = postData.userId; // ilerik
    const message = postData.message;
    const imageUrl =
      postData.imageUrl ||
      postData.imageFileId ||
      "https://tma.vself.app/assets/img/meme.png";

    // Get Firestore instance
    const db = admin.firestore();

    return await bot.api
      .sendPhoto(chatId, imageUrl, {
        caption: message,
        message_thread_id: undefined,
        parse_mode: "HTML",
        reply_markup: keyboard,
      })
      .then((msg: Message) => {
        return NextResponse.json({
          status: "success",
          link: `https://t.me/${chatId}/${msg.message_id}`,
          message: msg,
        });
      })
      .catch((_reason: any) => {
        console.log(_reason);
        return NextResponse.json({
          status: "error",
          error: _reason,
        });
      });
  } catch (error) {
    console.error("Error posting message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
