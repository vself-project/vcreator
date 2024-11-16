import { Button, DropdownMenu, Icon } from "@gravity-ui/uikit";
import React from "react";
import { $userData, navigateTo } from "./model";
import { useUnit } from "effector-react";
import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "@/shared/firebase";
import { BarsUnaligned } from "@gravity-ui/icons";
import { SHARING_MESSAGE } from "./constants";

const MainMenu: React.FC = () => {
  const userData = useUnit($userData);
  const analytics = getAnalytics(app);

  if (!userData) return;

  const username = userData?.username;
  const userId = userData?.id;

  const shareLink = () => {
    logEvent(analytics, "share", {
      method: "Telegram",
      content_type: "miniapp",
    });
    const url = encodeURI(`https://t.me/vself_bot/staging?startapp=${userId}`);
    const text = encodeURI(SHARING_MESSAGE); //
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
    navigator.clipboard.writeText(
      `https://t.me/vself_bot/staging?startapp=${userId}`
    );
  };

  return (
    <div className='' key='vself_menu'>
      <DropdownMenu
        items={[
          [
            {
              text: `Hello, ${username}!`,
              action: () => {
                navigateTo("main");
              },
            },

            {
              text: "New Post",
              action: () => {
                navigateTo("craft");
              },
            },
          ],
        ]}
        renderSwitcher={(props) => {
          return (
            <Button {...props}>
              <Icon data={BarsUnaligned}></Icon>
            </Button>
          );
        }}
      />
    </div>
  );
};

export default MainMenu;
