"use client";

import { X, Send, ArrowLeft } from "lucide-react";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";

import { SupportMessage } from "@/src/features/support/components/support-message";
import { useSupportChat } from "@/src/features/support/hooks/use-support-chat";

interface SupportChatProps {
  onClose: () => void;
}

export function SupportChat({ onClose }: SupportChatProps) {
  const {
    messagesEndRef,
    inputValue,
    setInputValue,
    user,
    messages,
    sendMessage,
    sessionId,
    leaveChatSession,
  } = useSupportChat();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    sendMessage(inputValue);

    setInputValue("");
  };

  if (user?.is_staff && !sessionId) return;

  return (
    <Card className="border-0 shadow-none h-full flex flex-col">
      <CardHeader className="border-b p-0 pb-1 flex flex-row items-center justify-between">
        <div className="flex gap-2 items-center">
          {user?.is_staff && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => leaveChatSession()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h3 className="font-semibold text-sm">Чат підтримки</h3>
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
      <CardContent className="flex-1 overflow-y-auto py-3 px-0">
        <div className="space-y-3">
          {messages?.map((message) => (
            <SupportMessage message={message} key={message.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-0 pt-2">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full gap-2 items-end"
        >
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Введіть повідомлення..."
            className="flex-1 h-8 text-sm resize-none py-2"
          />
          <Button
            disabled={inputValue.trim().length == 0}
            type="submit"
            size="sm"
            className="h-8 px-2"
          >
            <Send className="h-3 w-3 mr-1" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
