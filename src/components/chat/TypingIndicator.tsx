import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8 flex-shrink-0 bg-chat-bot">
        <AvatarFallback className="text-primary-foreground">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-1 bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
};