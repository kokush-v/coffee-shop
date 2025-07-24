import { SupportMessage as SupportMessageType } from "@/src/features/support/types/Support";
import { useProfileData } from "@/src/features/user/api/use-profile-data";
import { cn } from "@/src/lib/utils";

export const SupportMessage = ({
  message,
}: {
  message: SupportMessageType;
}) => {
  const { data } = useProfileData();

  const isMessagePending = new Date(message.timestamp).getFullYear() === 1970;

  return (
    <div
      key={message.id}
      className={cn(
        "flex",
        message.sender.id === data?.id ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] min-w-[200px] rounded-lg p-2 text-sm",
          message.sender.id === data?.id
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="whitespace-pre-wrap">{message.message}</p>
        {isMessagePending ? (
          <p className="text-xs opacity-50 italic">Надсилаємо...</p>
        ) : (
          <p className="text-xs opacity-70 mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
};
