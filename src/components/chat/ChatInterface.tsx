import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { VoiceRecorder } from './VoiceRecorder';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';

export interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { sendMessage, lastMessage, connectionStatus } = useWebSocket({
    url: `ws://localhost:8080/ws`,
    enabled: !!user
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === 'message') {
          setMessages(prev => [...prev, {
            id: data.id || Date.now().toString(),
            type: 'bot',
            content: data.content,
            timestamp: new Date(data.timestamp)
          }]);
          setIsTyping(false);
        } else if (data.type === 'typing') {
          setIsTyping(data.isTyping);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);

  const handleSendMessage = (content: string, type: 'text' | 'voice' = 'text') => {
    if (!content.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      metadata: { inputType: type }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response since WebSocket server isn't running
    setTimeout(() => {
      const botResponse = generateBotResponse(content);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);

    // Try to send via WebSocket if available
    if (connectionStatus === 'Open') {
      sendMessage({
        type: 'message',
        userId: user.id,
        channel: isVoiceMode ? 'voice' : 'web',
        text: content,
        metadata: { inputType: type }
      });
    }
  };

  // Simple bot response generator for demo
  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm your AI assistant. I can help you with various tasks. Try asking me about products, weather, or just have a conversation!";
    }
    
    if (input.includes('product') || input.includes('search') || input.includes('find')) {
      return "I'd be happy to help you find products! In a production environment, I would connect to product catalogs and search APIs. What specific product are you looking for?";
    }
    
    if (input.includes('weather')) {
      return "I can help with weather information! However, I'm currently running in demo mode without live API connections. In production, I would integrate with weather services like OpenWeatherMap or AccuWeather to provide real-time forecasts, current conditions, and weather alerts for your location.";
    }
    
    if (input.includes('voice') || input.includes('speak')) {
      return "Great! You can switch to voice mode using the toggle in the header. I support both speech-to-text and text-to-speech capabilities.";
    }
    
    if (input.includes('help')) {
      return "I'm an AI assistant with multiple capabilities:\n\n• Voice and text conversation\n• Product search and recommendations\n• Weather information\n• General question answering\n• Multi-language support\n\nWhat would you like to try?";
    }
    
    return "That's interesting! I'm designed to handle various types of conversations and tasks. In a production environment, I would process your request through advanced NLU systems and provide more contextual responses. How else can I assist you?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    handleSendMessage(transcript, 'voice');
  };

  const clearMessages = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-card rounded-2xl border border-border shadow-elegant overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-primary">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-background/10 rounded-xl">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-primary-foreground">AI Assistant</h1>
            <p className="text-sm text-primary-foreground/70">
              {connectionStatus === 'Open' ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={clearMessages}
            className="bg-secondary/80 hover:bg-secondary text-black border border-black"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
          
          <Button
            variant={isVoiceMode ? "default" : "secondary"}
            size="sm"
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className={isVoiceMode ? 
              "bg-accent hover:bg-accent/90 text-accent-foreground" : 
              "bg-secondary/80 hover:bg-secondary text-black border border-black"
            }
          >
            {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            {isVoiceMode ? 'Voice Mode' : 'Text Mode'}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 border-t border-border bg-muted/30">
        {isVoiceMode ? (
          <VoiceRecorder onTranscript={handleVoiceInput} />
        ) : (
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-background border-border focus:border-primary transition-colors"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};