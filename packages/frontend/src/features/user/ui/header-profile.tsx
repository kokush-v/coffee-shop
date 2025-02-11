"use client";

import { ProfileDropdownGuest } from "@/src/features/user/components/profile-dropdown-guest";
import { ProfileDropdownLoggedIn } from "@/src/features/user/components/profile-dropdown-logged-in";

import { useProfileData } from "@/src/features/user/api/use-profile-data";

export const Profile = () => {
  const { data } = useProfileData();

  if (!data) {
    return <ProfileDropdownGuest />;
  }

  return <ProfileDropdownLoggedIn />;
};
