import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, X, Bot, User, Sparkles, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpHint, setShowHelpHint] = useState(false);
  const [isAttentionMode, setIsAttentionMode] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Diagnoweb AI assistant. I can help you with general health information, understanding medical reports, and navigating the platform. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Attention-grabbing effect
  useEffect(() => {
    if (!isOpen) {
      const attentionInterval = setInterval(() => {
        setIsAttentionMode(true);
        setTimeout(() => setIsAttentionMode(false), 3000);
      }, 15000); // Every 15 seconds

      const hintInterval = setInterval(() => {
        setShowHelpHint(true);
        setTimeout(() => setShowHelpHint(false), 5000);
      }, 30000); // Every 30 seconds

      const previewInterval = setInterval(() => {
        setShowQuickPreview(true);
        setTimeout(() => setShowQuickPreview(false), 8000);
      }, 45000); // Every 45 seconds

      return () => {
        clearInterval(attentionInterval);
        clearInterval(hintInterval);
        clearInterval(previewInterval);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI assistant for Diagnoweb, a medical report management platform. You help users with:
- Understanding how to upload medical reports
- Managing their 4-digit PIN for security
- Finding hospitals and clinics
- Navigating the dashboard
- Searching through reports
- Using the Analysis & Insights feature for health trends
- Understanding AI-generated health insights and recommendations
- General platform guidance

You should be helpful and informative, but always remind users that you cannot provide medical advice and they should consult healthcare professionals for medical concerns. Keep responses concise and helpful.`
            },
            {
              role: 'user',
              content: inputValue
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiText = data.choices[0]?.message?.content || "I'm sorry, I couldn't process that request. Please try again.";

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to local responses if API fails
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
      
      toast.error("AI service temporarily unavailable. Using fallback responses.");
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('report') || input.includes('upload')) {
      return "To upload a medical report, go to the Upload page from the sidebar. You can upload images or PDFs of your medical documents. Make sure you have your 4-digit PIN ready as it's required to access your reports later.";
    } else if (input.includes('pin') || input.includes('password')) {
      return "Your 4-digit PIN is used to secure access to your medical reports. You can set or change your PIN in the Settings page under Security settings. Never share your PIN with anyone.";
    } else if (input.includes('appointment') || input.includes('doctor')) {
      return "You can view your upcoming appointments on the Dashboard. To schedule new appointments, please contact your healthcare provider directly or use their appointment booking system.";
    } else if (input.includes('hospital') || input.includes('clinic')) {
      return "You can find participating hospitals and clinics on the Hospitals page. This shows you all healthcare facilities that are integrated with Diagnoweb for seamless report sharing.";
    } else if (input.includes('search') || input.includes('find')) {
      return "Use the Search page to find specific medical reports, filter by date, hospital, or report type. You can also search for doctors or specific medical conditions in your reports.";
    } else if (input.includes('analysis') || input.includes('insight') || input.includes('trends') || input.includes('health score')) {
      return "Visit the Analysis & Insights page to get AI-powered analysis of your medical reports! You'll see health trends, personalized recommendations, risk assessments, and an overall health score. The AI can identify patterns in your reports and suggest improvements for your health.";
    } else if (input.includes('help') || input.includes('how')) {
              return "I'm here to help! You can ask me about:\n• Uploading medical reports\n• Managing your PIN and security\n• Finding hospitals and doctors\n• Understanding your dashboard\n• Searching through your reports\n• Getting AI-powered health analysis and insights\n\nWhat specific area would you like help with?";
    } else {
      return "I understand you're asking about health-related topics. While I can help you navigate Diagnoweb and understand how to use the platform, please remember that I cannot provide medical advice. For medical concerns, always consult with qualified healthcare professionals. Is there something specific about using Diagnoweb I can help you with?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        {/* Help hint bubble */}
        {showHelpHint && (
          <div className="absolute bottom-20 right-0 mb-2 px-4 py-3 bg-white rounded-xl shadow-xl border-2 border-diagnoweb-primary/20 max-w-xs animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <HelpCircle className="h-4 w-4 text-diagnoweb-primary" />
              <span>Need help? Ask me anything!</span>
            </div>
            <div className="absolute bottom-[-8px] right-4 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white"></div>
          </div>
        )}

        {/* Quick preview bubble */}
        {showQuickPreview && (
          <div className="absolute bottom-20 right-0 mb-2 px-4 py-3 bg-gradient-to-br from-diagnoweb-primary to-diagnoweb-secondary text-white rounded-xl shadow-xl max-w-sm animate-fade-in">
            <div className="text-sm font-medium mb-2">👋 I can help you with:</div>
            <div className="text-xs space-y-1 opacity-90">
              <div>• Upload medical reports</div>
              <div>• Get AI health analysis & insights</div>
              <div>• Manage your 4-digit PIN</div>
              <div>• Search through reports</div>
            </div>
            <div className="absolute bottom-[-8px] right-4 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-diagnoweb-secondary"></div>
          </div>
        )}
        
        {/* Floating chat button with enhanced visibility */}
        <div className="relative">
          {/* Enhanced pulse animation backgrounds */}
          <div className={`absolute inset-0 bg-diagnoweb-primary/30 rounded-full ${isAttentionMode ? 'animate-ping' : 'animate-pulse'}`}></div>
          <div className={`absolute inset-0 bg-diagnoweb-primary/20 rounded-full ${isAttentionMode ? 'animate-bounce' : 'animate-pulse'}`} style={{ animationDelay: '0.5s' }}></div>
          
          {/* Main button */}
          <Button
                         onClick={() => {
               setIsOpen(true);
               setShowHelpHint(false);
               setShowQuickPreview(false);
               setIsAttentionMode(false);
             }}
            className={`relative h-16 w-16 rounded-full bg-gradient-to-br from-diagnoweb-primary to-diagnoweb-secondary hover:from-diagnoweb-secondary hover:to-diagnoweb-primary shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white/50 ${
              isAttentionMode ? 'chatbot-attention scale-110' : ''
            }`}
            size="icon"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </Button>
          
          {/* Enhanced notification badge */}
          <div className={`absolute -top-1 -right-1 h-6 w-6 bg-diagnoweb-accent rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            isAttentionMode ? 'animate-bounce scale-125' : 'animate-pulse'
          }`}>
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          
          {/* Interactive tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none group-hover:pointer-events-auto">
            <div className="flex items-center gap-1">
              <Bot className="h-3 w-3" />
              <span>Chat with AI Assistant</span>
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
          
          {/* Online status indicator */}
          <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-sm">
            <div className="h-full w-full bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <Card className="w-80 sm:w-96 max-w-[calc(100vw-2rem)] h-[500px] sm:h-[600px] max-h-[calc(100vh-4rem)] shadow-2xl flex flex-col bg-white/95 backdrop-blur-sm border-2 border-diagnoweb-primary/20 animate-fade-in">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-diagnoweb-primary to-diagnoweb-secondary text-white rounded-t-lg relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <Avatar className="h-8 w-8 border-2 border-white/50">
                <AvatarFallback className="bg-white/20 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-diagnoweb-accent rounded-full border-2 border-white"></div>
            </div>
            <div>
              <span className="font-semibold text-lg">AI Assistant</span>
              <p className="text-xs text-white/80">Always here to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white hover:bg-white/20 relative z-10 transition-all duration-200 hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages with enhanced styling */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white to-diagnoweb-light/30" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-10 w-10 border-2 border-diagnoweb-primary/20 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-diagnoweb-primary to-diagnoweb-secondary text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-md transition-all duration-200 hover:shadow-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-diagnoweb-primary to-diagnoweb-secondary text-white rounded-br-md'
                      : 'bg-white border border-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <Avatar className="h-10 w-10 border-2 border-diagnoweb-primary/20 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <Avatar className="h-10 w-10 border-2 border-diagnoweb-primary/20 shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-diagnoweb-primary to-diagnoweb-secondary text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-md shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-diagnoweb-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-diagnoweb-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-diagnoweb-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

                 {/* Quick Action Buttons */}
         {messages.length === 1 && (
           <div className="px-4 py-2 border-t bg-gray-50/50">
             <div className="flex flex-wrap gap-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => {
                   setInputValue("How do I upload a medical report?");
                   setTimeout(() => sendMessage(), 100);
                 }}
                 className="text-xs bg-white hover:bg-diagnoweb-primary/10 border-diagnoweb-primary/20"
               >
                 📄 Upload Reports
               </Button>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => {
                   setInputValue("How do I manage my PIN?");
                   setTimeout(() => sendMessage(), 100);
                 }}
                 className="text-xs bg-white hover:bg-diagnoweb-primary/10 border-diagnoweb-primary/20"
               >
                 🔐 PIN Help
               </Button>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => {
                   setInputValue("Show me my health analysis and insights");
                   setTimeout(() => sendMessage(), 100);
                 }}
                 className="text-xs bg-white hover:bg-diagnoweb-primary/10 border-diagnoweb-primary/20"
               >
                 📊 Health Analysis
               </Button>
             </div>
           </div>
         )}

         {/* Enhanced Input Section */}
         <div className="p-4 border-t bg-white/90 backdrop-blur-sm rounded-b-lg">
           <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Diagnoweb..."
                disabled={isLoading}
                className="pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-diagnoweb-primary transition-all duration-200 resize-none"
              />
              {inputValue && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-diagnoweb-accent rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-diagnoweb-primary to-diagnoweb-secondary hover:from-diagnoweb-secondary hover:to-diagnoweb-primary transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">
              ✨ Powered by AI • For informational purposes only
            </p>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-diagnoweb-accent rounded-full"></div>
              <div className="w-1 h-1 bg-diagnoweb-primary rounded-full"></div>
              <div className="w-1 h-1 bg-diagnoweb-secondary rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};