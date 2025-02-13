import { api } from "@/src/config/api";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Profile } from "@/src/features/user/ui/profile";

export default async function ProfilePage() {
  const cookie = await cookies();

  const token = cookie.get("access-token");

  if (!token?.value) {
    return redirect("/");
  }

  const req = await api.get("/user", {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!req.data.id) {
    return redirect("/");
  }

  return <Profile />;
}
