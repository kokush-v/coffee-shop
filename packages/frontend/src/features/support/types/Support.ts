import { User } from "@/src/features/user/types/user";

export type SupportMessage = {
  id: number;
  message: string;
  timestamp: string;
  sender: User;
  sender_name: string;
  is_staff_message: boolean;
};

interface SupportSessionBase {
  id: number;
  customer_id: string;
  created_at: string;
  is_active: boolean;
  message_count: number;
  last_activity: string;
}

export interface SupportCreateSessionResponse extends SupportSessionBase {
  messages: unknown[];
  last_message: null | string;
}

export interface SupportSessionsQueryResponse extends SupportSessionBase {
  last_message_preview: {
    preview: string;
    sender_name: string;
    is_staff: boolean;
    timestamp: string;
  } | null;
  unread_count: number;
}
