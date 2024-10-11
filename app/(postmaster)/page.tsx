"use client";

import { $user, $userId } from "../../shared/model";
import { type User } from "firebase/auth";
import { useUnit } from "effector-react";
import { Link } from "@/components/Link/Link";
import { UserData } from "@/shared/types";
import { getUserData } from "./actions";
import { useEffect, useState } from "react";
import { Button, Text, Icon, Label } from "@gravity-ui/uikit";
import { Star } from "@gravity-ui/icons";
import { $userData, setUserData } from "./model";
import AppRouter from "./AppRouter";
import MainMenu from "./MainMenu";
import HomeButton from "./HomeButton";
import Footer from "@/components/Footer";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export default function Home() {
  const userId = useUnit($userId);
  const userData = useUnit($userData);
  const wallet = useTonWallet();
  const [tonConnectUI, setOptions] = useTonConnectUI();

  useEffect(() => {
    if (userId) getUserData(userId).then((data) => setUserData(data));
  }, [userId]);

  if (!userData) {
    return (
      <div className='grid h-screen items-center justify-center relative'>
        Loading...
      </div>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <nav className='flex gap-4 flex-row items-center justify-between w-full p-4'>
        <HomeButton />
        <Label theme='info' size='m' className='h-7 rounded-xl items-center'>
          <div className='flex flex-row items-center gap-2'>
            <Text variant='body-2'>Points: {userData?.mana || 0}</Text>
            <Icon data={Star} size={16}></Icon>
          </div>
        </Label>
        {/* {!wallet ? 
        <Button onClick={() => tonConnectUI.openModal()}>
          Connect Wallet
        </Button> : <Button onClick={() => tonConnectUI.disconnect()}>
          Disconnect
        </Button>} */}
        <MainMenu />
      </nav>
      <AppRouter />
      <Footer />
    </main>
  );
}
