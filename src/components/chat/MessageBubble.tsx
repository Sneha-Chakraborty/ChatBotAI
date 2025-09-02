import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div className={cn(
      "flex gap-3 message-enter message-enter-active",
      isUser && "flex-row-reverse"
    )}>
      <Avatar className={cn(
        "w-8 h-8 flex-shrink-0",
        isUser && "bg-chat-user",
        message.type === 'bot' && "bg-chat-bot",
        isSystem && "bg-chat-system"
      )}>
        <AvatarFallback className="text-primary-foreground">
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isUser && "items-end"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser && "bg-gradient-primary text-primary-foreground rounded-br-sm",
          message.type === 'bot' && "bg-card border border-border rounded-bl-sm",
          isSystem && "bg-muted text-muted-foreground italic"
        )}>
          {message.content}
        </div>
        
        <span className={cn(
          "text-xs text-muted-foreground px-2",
          isUser && "text-right"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};