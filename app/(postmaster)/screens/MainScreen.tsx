"use client";
import { Star } from "@gravity-ui/icons";
import { Card, Button, Text, Icon, Label } from "@gravity-ui/uikit";
import React, { useCallback } from "react";
import { $userData, navigateTo } from "../model";
import { useUnit } from "effector-react";
import { tapMana } from "../actions";
import { getAnalytics, logEvent } from "firebase/analytics";
import { SHARING_MESSAGE } from "../constants";
import { app } from "@/shared/firebase";

const MainScreen: React.FC = () => {
  const userData = useUnit($userData);
  const analytics = getAnalytics(app);

  if (!userData) return;

  const userId = userData.id;
  const username = userData.username;

  const shareLink = useCallback(() => {
    logEvent(analytics, "share", {
      method: "Telegram",
      content_type: "miniapp",
    });
    const url = encodeURI(
      `https://t.me/vself_bot/prestable?startapp=${userId}`
    );
    const text = encodeURI(SHARING_MESSAGE); //
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
    navigator.clipboard.writeText(
      `https://t.me/vself_bot/prestable?startapp=${userId}`
    );
  }, [userId]);

  const mana = userData?.mana || 0;
  const lastTap = userData?.lastTap ?? Date();

  return (
    <>
      {/* <Card className='p-4 gap-4 rounded-2xl flex flex-row items-center w-full'>
        <Button size='m' className='w-full'>
          <Text variant='body-1'>Farm Points</Text>
        </Button>
        <Button size='m' onClick={shareLink}>
          <Text variant='body-1'>Invite Friend</Text>
        </Button>
      </Card> */}
      <div className='text-left mt-2'>
        <Text as='h1' variant='header-2' className='mt-4 font-bold text-left'>
          VSELF
        </Text>
        <Text
          as='h2'
          variant='subheader-3'
          className='font-semibold text-left mb-2'
        >
          COMMUNITY TOKENISATION AND ENGAGEMENT
        </Text>

        <Text as='p' variant='body-1' className='mb-2'>
          {
            "🚀 Step into the future of marketing with vSelf - Community-as-a-service Platform for growth hacking and gamification."
          }
        </Text>
        <Text as='p' variant='body-1' className=''>
          🎯 The leading platform to boost engagement directly on Telegram.
        </Text>
      </div>

      <div className='mt-6 flex flex-col items-center'>
        <p className='font-bold'>Choose to continue as</p>
        <Button
          view='action'
          className='w-[200px] h-[200px] mt-[10px]'
          onClick={() => navigateTo("member")}
        >
          Community Member
        </Button>
        <Button
          view='action'
          className='w-[200px] mt-[10px]'
          onClick={() => navigateTo("brand")}
        >
          Brand/Community Owner
        </Button>
      </div>
    </>
  );
};

export default MainScreen;
