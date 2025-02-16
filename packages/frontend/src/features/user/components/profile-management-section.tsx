import { ProfileButton } from "@/src/features/user/components/profile-button";
import { Typography } from "@/src/components/ui/typography";

import { useProfileData } from "@/src/features/user/api/use-profile-data";
import Link from "next/link";
// import AdminService from "@/src/features/admin/api/admin-service";

// import { useEffect } from "react";

export const ProfileManagementSection = () => {
  const { data } = useProfileData();

  // useEffect(() => {
  //   AdminService.connect();
  // }, []);

  if (!data) return null;

  if (!data.is_staff) return null;

  return (
    <section className="pt-2">
      <Typography variant="h2" className="text-zinc-700 mb-2">
        Адміністрування
      </Typography>
      <Link href="/my/orders/manage">
        <ProfileButton>Замовлення</ProfileButton>
      </Link>
    </section>
  );
};
