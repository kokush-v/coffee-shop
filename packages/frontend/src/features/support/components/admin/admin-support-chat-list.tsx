import { useContext, useMemo } from "react";

import { useProfileData } from "@/src/features/user/api/use-profile-data";
import { useSupportSessionsQuery } from "@/src/features/support/api/admin/query-support-sessions";

import { SupportMessagingContext } from "@/src/providers/support-messaging-provider";

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { AdminSupportChatComponent } from "@/src/features/support/components/admin/admin-support-chat-component";

import { Button } from "@/src/components/ui/button";
import { X } from "lucide-react";
import { ActivityIndicator } from "@/src/components/ui/activity-indicator";

export const AdminSupportChatList = ({ onClose }: { onClose: () => void }) => {
  const { data } = useProfileData();

  const { sessionId } = useContext(SupportMessagingContext);

  const hasChatSession = !data || !data.is_staff || sessionId;

  const { data: _chats, isPending } = useSupportSessionsQuery();

  const chats = useMemo(
    () => _chats?.pages.flatMap((page) => page.results) || [],
    [_chats]
  );

  if (hasChatSession) return null;

  return (
    <Card className="border-0 shadow-none h-full flex flex-col">
      <CardHeader className="border-b p-0 pl-2 pb-1 flex flex-row items-center justify-between">
        <div className="flex gap-2 items-center">
          <h3 className="font-semibold text-sm">Останні чати</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      {!isPending ? (
        <CardContent className="flex-1 overflow-y-auto px-0">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <AdminSupportChatComponent chat={chat} key={chat.id} />
            ))
          ) : (
            <p className="flex flex-1 items-center justify-center h-full text-xs font-semibold text-primary/60">
              Запити до чату підтримки відсутні
            </p>
          )}
        </CardContent>
      ) : (
        <CardContent className="px-0 flex-1 flex items-center justify-center">
          <ActivityIndicator />
        </CardContent>
      )}
    </Card>
  );
};
