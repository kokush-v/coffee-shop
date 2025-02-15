"use client";

import { useProfileData } from "@/src/features/user/api/use-profile-data";

import { ProfileButton } from "@/src/features/user/components/profile-button";
import { ProfileManagementSection } from "@/src/features/user/components/profile-management-section";

import { ChevronRight } from "lucide-react";
import { Typography } from "@/src/components/ui/typography";

import Link from "next/link";

export const Profile = () => {
  const { data } = useProfileData();

  if (!data) return null;

  return (
    <main className="space-y-2">
      <Typography variant="h2" className="text-zinc-700">
        Привіт, {data.username}
      </Typography>
      <Link href="/my/orders">
        <ProfileButton>
          <span>Мої замовлення</span>
          <span className="flex items-center gap-1 text-sm text-zinc-600">
            0 <ChevronRight />
          </span>
        </ProfileButton>
      </Link>
      <ProfileManagementSection />
    </main>
  );
};
