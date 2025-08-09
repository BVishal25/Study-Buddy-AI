import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAITutor } from "@/hooks/use-ai-tutor";

const DEMO_USER_ID = "demo-user-123";

interface Message {

  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AITutorChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const {
    messages,
    sendMessage,
    isLoading,
    createSession,
    currentSessionId
  } = useAITutor(DEMO_USER_ID);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const messageText = message;
    setMessage("");

    // Create session if doesn't exist
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = await createSession();
    }

    if (sessionId) {
      await sendMessage(sessionId, messageText, {
        currentTopic: 'neural-networks',
        learningPath: 'ai-fundamentals',
        difficulty: 'intermediate'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isExpanded) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">AI Tutor</CardTitle>
            <div className="flex items-center space-x-2">
              <select id="provider-select" className="border rounded px-2 py-1 mr-2" defaultValue={process.env.DEFAULT_LLM_PROVIDER || "openai"} onChange={(e)=>setProvider(e.target.value)}>
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="mistral">Mistral</option>
                <option value="claude">Claude</option>
              </select>
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <Badge variant="secondary" className="text-xs">Online</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-primary text-sm"></i>
              </div>
              <div className="bg-muted rounded-lg p-3 flex-1">
                <p className="text-sm text-muted-foreground">
                  Hi! I'm here to help you with any AI concepts you're learning. What would you like to know?
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask me anything about AI..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin text-xs"></i>
              ) : (
                <i className="fas fa-paper-plane text-xs"></i>
              )}
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="w-full mt-3"
          >
            <i className="fas fa-expand mr-2"></i>
            Expand Chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
              <select id="provider-select" className="border rounded px-2 py-1 mr-2" defaultValue={process.env.DEFAULT_LLM_PROVIDER || "openai"} onChange={(e)=>setProvider(e.target.value)}>
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="mistral">Mistral</option>
                <option value="claude">Claude</option>
              </select>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <div>
              <CardTitle className="text-lg">AI Tutor</CardTitle>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
            <i className="fas fa-compress"></i>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full p-0">
        <ScrollArea className="flex-1 p-4 custom-scrollbar">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-robot text-primary text-sm"></i>
                </div>
                <div className="bg-muted rounded-lg p-3 flex-1">
                  <p className="text-sm text-muted-foreground">
                    Hello! I'm your AI tutor. I can help explain concepts, answer questions, and provide guidance on your AI learning journey. What would you like to explore today?
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start space-x-3 chat-message ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-primary/20 text-primary'
                }`}>
                  <i className={`fas ${msg.role === 'user' ? 'fa-user' : 'fa-robot'} text-sm`}></i>
                </div>
                <div className={`rounded-lg p-3 flex-1 max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-robot text-primary text-sm"></i>
                </div>
                <div className="bg-muted rounded-lg p-3 flex-1">
                  <div className="flex items-center space-x-2">
              <select id="provider-select" className="border rounded px-2 py-1 mr-2" defaultValue={process.env.DEFAULT_LLM_PROVIDER || "openai"} onChange={(e)=>setProvider(e.target.value)}>
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="mistral">Mistral</option>
                <option value="claude">Claude</option>
              </select>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="px-4"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
