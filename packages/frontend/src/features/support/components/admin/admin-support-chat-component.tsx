import { SupportSessionsQueryResponse } from "@/src/features/support/types/Support";
import { SupportMessagingContext } from "@/src/providers/support-messaging-provider";
import { useContext } from "react";

export const AdminSupportChatComponent = ({
  chat,
}: {
  chat: SupportSessionsQueryResponse;
}) => {
  const { updateSessionId } = useContext(SupportMessagingContext);

  if (!chat.last_message_preview?.preview) return null;

  return (
    <div>
      <section
        className="p-2 cursor-pointer border-b"
        onClick={() => updateSessionId(chat.customer_id)}
        key={chat.id}
      >
        <p className="text-sm font-semibold text-primary/90">
          {chat.last_message_preview?.sender_name}
        </p>
        <p className="text-xs text-primary/70">
          {chat.last_message_preview?.preview}
        </p>
      </section>
    </div>
  );
};
