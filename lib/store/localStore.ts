"use client";

import type { Lawyer } from "@/lib/data/mock-lawyers";

export type Message = {
  id: string;
  fromUserId: string;
  fromName: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  reply?: string;
  replyDate?: string;
};

export type Session = {
  userId: string;
  role: "lawyer" | "admin";
  name: string;
  email: string;
};

const KEYS = {
  users: "AdvAqui:users",
  messages: "AdvAqui:messages",
  session: "AdvAqui:session"
} as const;

const isBrowser = typeof window !== "undefined";

const read = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

const remove = (key: string): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const store = {
  getUsers: (): Lawyer[] => read<Lawyer[]>(KEYS.users, []),
  setUsers: (u: Lawyer[]) => write(KEYS.users, u),
  getMessages: (): Message[] => read<Message[]>(KEYS.messages, []),
  setMessages: (m: Message[]) => write(KEYS.messages, m),
  getSession: (): Session | null => read<Session | null>(KEYS.session, null),
  setSession: (s: Session | null) => {
    if (s) write(KEYS.session, s);
    else remove(KEYS.session);
  }
};
