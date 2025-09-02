import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
}

export const VoiceRecorder = ({ onTranscript }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      synthesisRef.current = speechSynthesis;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('');
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or use text input.",
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (synthesisRef.current) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      synthesisRef.current.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Voice input is not supported in your browser.</p>
        <p className="text-sm mt-2">Please use text input instead.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Voice Visualization */}
      <div className={cn(
        "relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300",
        isRecording 
          ? "bg-gradient-voice shadow-voice animate-voice-pulse" 
          : "bg-muted border-2 border-dashed border-border"
      )}>
        {isRecording ? (
          <div className="flex gap-1">
            <div className="w-1 h-8 bg-white rounded-full typing-dot" />
            <div className="w-1 h-8 bg-white rounded-full typing-dot" />
            <div className="w-1 h-8 bg-white rounded-full typing-dot" />
          </div>
        ) : (
          <Mic className="w-8 h-8 text-muted-foreground" />
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          size="lg"
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          className={cn(
            "rounded-full px-6",
            !isRecording && "bg-accent hover:bg-accent/90 text-accent-foreground"
          )}
        >
          {isRecording ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={() => speakText("Hello! I'm ready to help you.")}
          className="rounded-full px-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
        >
          <Volume2 className="w-5 h-5 mr-2" />
          Test Voice
        </Button>
      </div>

      {/* Transcript Preview */}
      {transcript && (
        <div className="w-full max-w-md p-4 bg-muted rounded-lg border">
          <p className="text-sm text-muted-foreground mb-1">Transcript:</p>
          <p className="text-foreground">{transcript}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>Click "Start Recording" to begin voice input.</p>
        <p>Speak clearly and the AI will respond with both text and voice.</p>
      </div>
    </div>
  );
};