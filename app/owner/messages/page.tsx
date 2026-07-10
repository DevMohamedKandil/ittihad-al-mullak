"use client";

import { useState } from "react";
import { OwnerHeader } from "@/components/owner/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Send,
  ChevronLeft,
  Users,
  Building2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  type: "admin" | "group" | "individual";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  senderId: string;
  timestamp: string;
  isMe: boolean;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "لجنة الإدارة",
    type: "admin",
    lastMessage: "تم استلام طلب الصيانة الخاص بكم",
    lastMessageTime: "منذ ساعة",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "مجموعة الملاك",
    type: "group",
    lastMessage: "محمد: هل تم حل مشكلة المصعد؟",
    lastMessageTime: "منذ ٣ ساعات",
    unreadCount: 5,
  },
  {
    id: "3",
    name: "محمد أحمد (شقة ١٠١)",
    type: "individual",
    lastMessage: "شكراً على المساعدة",
    lastMessageTime: "أمس",
    unreadCount: 0,
  },
  {
    id: "4",
    name: "سارة محمود (شقة ١٠٢)",
    type: "individual",
    lastMessage: "تم التواصل مع السباك",
    lastMessageTime: "منذ يومين",
    unreadCount: 0,
  },
];

const sampleMessages: Message[] = [
  {
    id: "1",
    content: "السلام عليكم، أريد الاستفسار عن موعد صيانة المصعد",
    sender: "أنت",
    senderId: "me",
    timestamp: "١٠:٣٠ ص",
    isMe: true,
  },
  {
    id: "2",
    content: "وعليكم السلام، سيتم صيانة المصعد يوم الخميس القادم من ١٠ صباحاً حتى ٤ عصراً",
    sender: "الإدارة",
    senderId: "admin",
    timestamp: "١٠:٤٥ ص",
    isMe: false,
  },
  {
    id: "3",
    content: "هل سيتم إيقاف المصعد بالكامل؟",
    sender: "أنت",
    senderId: "me",
    timestamp: "١٠:٥٠ ص",
    isMe: true,
  },
  {
    id: "4",
    content: "نعم، سيتم إيقافه أثناء الصيانة. ننصح بترتيب أموركم قبل هذا الوقت",
    sender: "الإدارة",
    senderId: "admin",
    timestamp: "١١:٠٠ ص",
    isMe: false,
  },
  {
    id: "5",
    content: "تم استلام طلب الصيانة الخاص بكم وسيتم الرد في أقرب وقت",
    sender: "الإدارة",
    senderId: "admin",
    timestamp: "٢:٣٠ م",
    isMe: false,
  },
];

function ConversationItem({
  conversation,
  onClick,
}: {
  conversation: Conversation;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-accent transition-colors text-right"
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarFallback
          className={cn(
            conversation.type === "admin" && "bg-primary text-primary-foreground",
            conversation.type === "group" && "bg-success text-success-foreground",
            conversation.type === "individual" && "bg-muted"
          )}
        >
          {conversation.type === "admin" && <Building2 className="h-5 w-5" />}
          {conversation.type === "group" && <Users className="h-5 w-5" />}
          {conversation.type === "individual" && conversation.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium truncate">{conversation.name}</h3>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {conversation.lastMessageTime}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {conversation.lastMessage}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {conversation.unreadCount > 0 && (
          <Badge className="h-6 w-6 p-0 justify-center">
            {conversation.unreadCount}
          </Badge>
        )}
        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
      </div>
    </button>
  );
}

function ChatView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(sampleMessages);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "أنت",
      senderId: "me",
      timestamp: "الآن",
      isMe: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarFallback
            className={cn(
              conversation.type === "admin" && "bg-primary text-primary-foreground",
              conversation.type === "group" && "bg-success text-success-foreground"
            )}
          >
            {conversation.type === "admin" && <Building2 className="h-5 w-5" />}
            {conversation.type === "group" && <Users className="h-5 w-5" />}
            {conversation.type === "individual" && conversation.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{conversation.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.type === "admin" && "الرد خلال ساعات العمل"}
            {conversation.type === "group" && "٤٨ عضو"}
            {conversation.type === "individual" && "آخر ظهور: منذ ساعة"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.isMe ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  msg.isMe
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1",
                    msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [search, setSearch] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.includes(search)
  );

  if (selectedConversation) {
    return (
      <div>
        <ChatView
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <OwnerHeader title="المحادثات" />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في المحادثات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedConversation(conversations[0])}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">تواصل مع الإدارة</p>
                <p className="text-xs text-muted-foreground">رسالة مباشرة</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedConversation(conversations[1])}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/10">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-medium">مجموعة الملاك</p>
                <p className="text-xs text-muted-foreground">٤٨ عضو</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  onClick={() => setSelectedConversation(conversation)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
