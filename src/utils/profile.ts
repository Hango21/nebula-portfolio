import { ProfileData, DEFAULT_PROFILE } from "@/types/profile";

const PROFILE_KEY = "portfolio_profile";

export const getProfile = (): ProfileData => {
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
};

export const saveProfile = (profile: ProfileData) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};
