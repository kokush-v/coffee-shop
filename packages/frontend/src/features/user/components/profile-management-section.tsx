import { Typography } from "@/src/components/ui/typography";
import { useProfileData } from "@/src/features/user/api/use-profile-data";
import { ProfileButton } from "@/src/features/user/components/profile-button";

export const ProfileManagementSection = () => {
  const { data } = useProfileData();

  if (!data) return null;

  // if (!data.isStaff) return null

  return (
    <section className="space-y-2 pt-2">
      <Typography variant="h2" className="text-zinc-700">
        Адміністрування
      </Typography>
      <ProfileButton>Замовлення</ProfileButton>
    </section>
  );
};
