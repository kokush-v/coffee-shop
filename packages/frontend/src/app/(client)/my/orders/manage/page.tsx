import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Admin } from "@/src/features/admin/ui/admin";

import { api } from "@/src/config/api";

import { PaginatedResponse } from "@/src/types/paginated-api-response";
import { Order } from "@/src/features/orders/types/orders";

export default async function Page() {
  const cookie = await cookies();

  const token = cookie.get("access-token");

  if (!token) {
    return redirect("/");
  }

  const { data } = await api.get<PaginatedResponse<Order[]>>(
    "/orders/?status=pending&staff_orders=true",
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  return <Admin initialData={data} />;
}
