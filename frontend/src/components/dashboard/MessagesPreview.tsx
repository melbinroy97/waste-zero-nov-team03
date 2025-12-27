import { MessageSquare, User } from 'lucide-react';
import type { Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MessagesPreviewProps {
  messages?: Message[];
  isLoading?: boolean;
}

function MessageCard({ message }: { message: Message }) {
  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-xl border border-border transition-colors cursor-pointer',
      message.read ? 'bg-card hover:bg-muted/30' : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
    )}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={message.senderAvatar} alt={message.senderName} />
        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
          {message.senderName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'text-sm truncate',
            message.read ? 'text-foreground' : 'font-semibold text-foreground'
          )}>
            {message.senderName}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {timeAgo(message.timestamp)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {message.content}
        </p>
      </div>
      {!message.read && (
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export function MessagesPreview({ messages, isLoading }: MessagesPreviewProps) {
  const navigate = useNavigate();
  const unreadCount = messages?.filter((m) => !m.read).length || 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Recent Messages</h3>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        {messages && messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/volunteer/messages')}>
            View all
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      ) : messages && messages.length > 0 ? (
        <div className="space-y-2">
          {messages.slice(0, 3).map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No messages"
          description="Messages from NGOs and other volunteers will appear here."
        />
      )}
    </div>
  );
}
