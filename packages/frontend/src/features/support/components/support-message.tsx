import { SupportMessage as SupportMessageType } from "@/src/features/support/types/SupportMessage";
import { cn } from "@/src/lib/utils";

export const SupportMessage = ({ message }: { message: SupportMessageType }) => {
  return (
    <div
      key={message.id}
      className={cn("flex", message.senderId === 1 ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] min-w-[200px] rounded-lg p-2 text-sm",
          message.senderId === 1 ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};
