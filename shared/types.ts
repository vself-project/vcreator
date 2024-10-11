import { User } from "@telegram-apps/sdk-react";
import { Timestamp } from "firebase/firestore";

export type ClanData = {
  chiefId: string;
  members: string[];
  points: number;
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type UserData = {
  points: number;
  mana: number;
  lastTap: Timestamp;
  lastLogin: Timestamp;
  createdAt: Timestamp;
  referralCode?: string;
  inviteCode?: string;
  clanId?: string;
  clanName?: string;
  clanImage?: string;
} & User;

export type PostData = {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: Timestamp;
  author: User;
};

export type SurveyOption = {
  type: "image" | "text";
  content: string;
};

export type SurveyData = {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    options: SurveyOption[];
  }[];
};

export type NftRewardConfig = {
  prize_meta?: string;
  prize_title: string;
  prize_image: string;
  prize_description: string;
};

export type CampaignReward = {
  points?: number;
  nft?: NftRewardConfig | null;
}

export type GameConfig = {
  type: string;
  reward: CampaignReward;
  owner: string;
  create_date: Timestamp;
  game?: Object
}

export type CampaignData = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  start_date: Timestamp;
  end_date: Timestamp | null;
  draft: boolean;
  type: "game" | "quiz" | "survey" | undefined;
};
