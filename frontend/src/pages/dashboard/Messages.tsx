import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from "react-router-dom";
// import { io, Socket } from "socket.io-client"; // Removed
import { toast } from "sonner";
import { Send, User as UserIcon, Trash2 } from "lucide-react"; // Added Trash2
import { useSocket } from "@/contexts/SocketContext";
import { cn } from "@/lib/utils";

type Message = {
  _id: string;
  content: string;
  sender_id: string; // The ID of the user who sent it
  createdAt: string;
};

type Conversation = {
  _id: string; // User ID of the other person
  userDetails: {
    name: string;
    role: string;
    email: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]); // New state
  const [input, setInput] = useState("");
  // const [socket, setSocket] = useState<Socket | null>(null); // Removed
  const { socket } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams(); // Changed to allow setting params
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Target user from URL (e.g. ?userId=123&name=GreenFoundation)
  const targetUserId = searchParams.get("userId");
  // If target user is selected, find their name from conversations list or param
  const activeConversation = conversations.find(c => c._id === targetUserId);
  const targetUserName = searchParams.get("name") || activeConversation?.userDetails.name || "Chat";
  
  // Current user info (simplified decoding for demo)
  const token = localStorage.getItem("token");
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  // 0. Fetch Conversations List on Mount
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:2000/api/messages/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConversations(data.data);
        }
      })
      .catch((err) => console.error("Failed to load conversations", err));
  }, [token]);

  useEffect(() => {
    if (!token || !socket) return;


    // 2. Listen for incoming messages
    const handleNewMessage = (msg: any) => {
      // msg structure from backend: { senderId, receiverId, content, createdAt }
      // Only add if it belongs to this conversation
      if (msg.senderId === targetUserId || msg.receiverId === targetUserId) {
         setMessages((prev) => [
          ...prev,
          {
            _id: Date.now().toString(), // Temp ID
            content: msg.content,
            sender_id: msg.senderId,
            createdAt: msg.createdAt || new Date().toISOString(),
          },
        ]);
        // toast.info("New message received"); // Handled globally by SocketContext now
      }

      // Also refresh sidebar conversations to show latest message snippet
      // Ideally we should just update the state locally, but re-fetching is safer for now
       fetch("http://localhost:2000/api/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setConversations(data.data);
          }
        });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, token, targetUserId]);

  useEffect(() => {
    // 3. Fetch Chat History
    if (targetUserId && token) {
      fetch(`http://localhost:2000/api/messages/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMessages(data.data);
          }
        })
        .catch((err) => console.error("Failed to load history", err));
    }
  }, [targetUserId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !targetUserId) return;

    try {
      const res = await fetch("http://localhost:2000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: targetUserId,
          content: input,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Optimistic update
        setMessages((prev) => [
          ...prev,
          {
            _id: Date.now().toString(),
            content: input,
            sender_id: currentUserId,
            createdAt: new Date().toISOString(),
          },
        ]);
        setInput("");
      } else {
        toast.error(data.message || "Failed to send");
      }
    } catch (err) {
      toast.error("Error sending message");
    }
  };

  const deleteConversation = async () => {
    if (!targetUserId || !confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const res = await fetch(`http://localhost:2000/api/messages/${targetUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Conversation deleted");
        setMessages([]);
        setConversations(prev => prev.filter(c => c._id !== targetUserId));
        setSearchParams({}); // Deselect
      } else {
        toast.error("Failed to delete conversation");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting conversation");
    }
  };

  if (!targetUserId && conversations.length === 0) {
    // Initial empty state (loading or just no chats)
  }

  return (
    <div className="grid h-[80vh] w-full grid-cols-1 gap-0 overflow-hidden rounded-xl border bg-background md:grid-cols-4 md:gap-4">
      {/* Sidebar - Conversations List */}
      <div className="flex flex-col border-r bg-muted/10 md:col-span-1">
        <div className="border-b p-4 font-semibold flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Inbox
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
             <div className="p-4 text-center text-sm text-muted-foreground">No conversations yet</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => setSearchParams({ userId: conv._id, name: conv.userDetails.name })}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-lg p-3 text-sm transition-colors hover:bg-accent",
                  targetUserId === conv._id && "bg-accent text-accent-foreground"
                )}
              >
                <div className="font-medium truncate">{conv.userDetails.name || "Unknown User"}</div>
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="truncate max-w-[120px]">{conv.lastMessage?.content}</span>
                    <span className="whitespace-nowrap ml-2 opacity-70">
                      {conv.lastMessage?.createdAt && new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col md:col-span-3 h-[80vh] md:h-full overflow-hidden relative">
        {!targetUserId ? (
          <div className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center text-muted-foreground bg-background/95 backdrop-blur-sm md:static md:bg-muted/10">
            <UserIcon className="h-12 w-12 mb-4 opacity-20 " />
            <p>Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b px-6 py-4 font-semibold text-lg flex items-center justify-between bg-background z-20 shadow-sm">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden mr-2 -ml-2"
                    onClick={() => setSearchParams({})}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </Button>
                  <Avatar className="h-8 w-8">
                      <AvatarFallback>{targetUserName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {targetUserName}
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={deleteConversation}>
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6 bg-muted/5">
                {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                    <div
                    key={msg._id}
                    className={`flex items-end gap-2 md:gap-3 ${
                        isMe ? "justify-end" : "justify-start"
                    }`}
                    >
                    {!isMe && (
                        <Avatar className="h-6 w-6 hidden md:block">
                        <AvatarFallback>{targetUserName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}

                    <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border text-foreground"
                        }`}
                    >
                        <p>{msg.content}</p>
                        <span className="mt-1 block text-[10px] opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        </span>
                    </div>
                    </div>
                );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t p-3 md:p-4 bg-background">
                <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="bg-muted/20"
                />
                <Button onClick={sendMessage} size="icon">
                <Send className="h-4 w-4" />
                </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
