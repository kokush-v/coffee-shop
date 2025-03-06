"use client";

import { useProfileData } from "@/src/features/user/api/use-profile-data";

import { ProfileButton } from "@/src/features/user/components/profile-button";
import { ProfileManagementSection } from "@/src/features/user/components/profile-management-section";

import { ChevronRight } from "lucide-react";
import { Typography } from "@/src/components/ui/typography";

import Link from "next/link";
import { useUserOrdersAPI } from "@/src/features/orders/api/use-user-orders-api";
import { ActivityIndicator } from "@/src/components/ui/activity-indicator";

export const Profile = () => {
  const { data } = useProfileData();
  const { data: orders } = useUserOrdersAPI();

  if (!data || !orders)
    return (
      <div className="flex flex-1 items-center justify-center">
        <ActivityIndicator />
      </div>
    );

  return (
    <main className="space-y-2">
      <Typography variant="h2" className="text-zinc-700 mb-2">
        Привіт, {data.username}
      </Typography>
      <Link href="/my/orders">
        <ProfileButton>
          <span>Мої замовлення</span>
          <span className="flex items-center gap-1 text-sm text-zinc-600">
            {orders.pages[0].count} <ChevronRight />
          </span>
        </ProfileButton>
      </Link>
      <ProfileManagementSection />
    </main>
  );
};
