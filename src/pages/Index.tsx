import { ChatInterface } from '@/components/chat/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen p-4 bg-gradient-secondary">
      <div className="container mx-auto h-screen max-h-screen py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            AI Conversational Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of conversational AI with voice and text capabilities, 
            powered by advanced NLU and real-time communication.
          </p>
        </div>
        
        <div className="h-[calc(100vh-200px)]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;
