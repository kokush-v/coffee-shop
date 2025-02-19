import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Admin } from "@/src/features/admin/ui/admin";

import { api } from "@/src/config/api";

export default async function Page() {
  const cookie = await cookies();

  const token = cookie.get("access-token");

  if (!token) {
    return redirect("/");
  }

  const data = await api
    .get("/orders/", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    .then((response) => response.data);

  return <Admin initialData={data} />;
}
