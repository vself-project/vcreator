"use client";

import React, { useEffect } from "react";
import { useUnit } from "effector-react";
import { $currentScreen, navigateTo, Screen } from "./model";
import MainScreen from "./screens/MainScreen";
// import MemberScreen from "./screens/MemberScreen";
// import CampaignsScreen from "./screens/CampaignsScreen";
// import SelectorScreen from "./screens/SelectorScreen";
import CraftScreen from "./screens/CraftScreen";
// import PaymentScreen from "./screens/PaymentScreen";
import { $userId } from "@/shared/model";
import { LOCAL_STORAGE_CURRENT_SCREEN_KEY_PREFIX } from "./constants";
// import BrandScreen from "./screens/BrandScreen";
// import GameSetupScreen from "./screens/GameSetupScreen";

const AppRouter: React.FC = () => {
  const userId = useUnit($userId);
  const currentScreen = useUnit($currentScreen);

  useEffect(() => {
    const p = window.localStorage.getItem(
      `${LOCAL_STORAGE_CURRENT_SCREEN_KEY_PREFIX}_${userId}`
    );
    // @ts-ignore
    navigateTo(p);
  }, []);

  const renderScreen = (screen: Screen) => {
    switch (screen) {
      // case "main":
      //   return <MainScreen />;
      // case "member":
      //   return <MemberScreen />;
      // case "campaigns":
      //   return <CampaignsScreen />;
      // case "selector":
      //   return <SelectorScreen />;
      case "craft":
        return <CraftScreen />;
      // case "payment":
      //   return <PaymentScreen />;
      // case "brand":
      //   return <BrandScreen />;
      // case "game-setup":
      //   return <GameSetupScreen />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <section className='app-router container grid max-w-md mx-auto items-center p-4'>
      {renderScreen(currentScreen)}
    </section>
  );
};

export default AppRouter;
