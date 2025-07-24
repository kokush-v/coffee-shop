import { api } from "@/src/config/api";
import { User } from "@/src/features/user/types/user";
import { cookies } from "next/headers";

export const getSSRProfileData = async () => {
  const token = await cookies().then(
    (cookies) => cookies.get("access-token")?.value
  );

  if (!token) return null;

  const { data } = await api.get<User>("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
