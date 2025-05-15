"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";

import { X, Send } from "lucide-react";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card";

import { SupportMessage } from "@/src/features/support/components/support-message";

import { SupportMessage as SupportMessageType } from "@/src/features/support/types/SupportMessage";

const initialMessages: SupportMessageType[] = [
  {
    id: 1,
    senderId: 0,
    content: "Привіт, чим можу допомогти?",
    timestamp: new Date(),
  },
];

interface SupportChatProps {
  onClose: () => void;
}

export function SupportChat({ onClose }: SupportChatProps) {
  const [messages, setMessages] = useState<SupportMessageType[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage: SupportMessageType = {
      id: Date.now(),
      content: inputValue,
      senderId: 1,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const supportMessage: SupportMessageType = {
        id: Date.now() + 1,
        senderId: 0,
        content: "Дякуємо за повідомлення. Ми зв'яжемося з вами найближчим часом.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, supportMessage]);
    }, 1000);
  };

  return (
    <Card className="border-0 shadow-none h-[500px] flex flex-col">
      <CardHeader className="border-b p-0 pb-1 flex flex-row items-center justify-between">
        <h3 className="font-semibold text-sm">Чат підтримки</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto py-3 px-0">
        <div className="space-y-3">
          {messages.map((message) => (
            <SupportMessage message={message} key={message.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-0 pt-2">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2 items-end">
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
          <Button type="submit" size="sm" className="h-8 px-2">
            <Send className="h-3 w-3 mr-1" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
