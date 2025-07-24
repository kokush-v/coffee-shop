import { api } from "@/src/config/api";
import { SupportSessionsQueryResponse } from "@/src/features/support/types/Support";
import { PaginatedResponse } from "@/src/types/paginated-api-response";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useSupportSessionsQuery = () => {
  return useInfiniteQuery({
    queryKey: ["support", "admin", "list"],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<
        PaginatedResponse<SupportSessionsQueryResponse[]>
      >(`/chat/sessions?is_active=true&page_size=20&page=${pageParam}`);

      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.next) {
        return allPages.length + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
  });
};
