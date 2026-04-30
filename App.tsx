
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { startChat } from './services/geminiService';
import { Message, Sender } from './types';
import { Navigation } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { ChatInterface } from './components/ChatInterface';
import { PodcastGrid } from './components/PodcastGrid';
import { MotherHub } from './components/MotherHub';
import { BabyHub } from './components/BabyHub';
import { ToolsHub } from './components/ToolsHub';
import { ShopPage } from './components/ShopPage';
import { useAuth } from './AuthContext';
import { createChatSession, saveMessage, subscribeToMessages } from './services/firebaseService';

export type AppTab = 'home' | 'chat' | 'podcast' | 'shop' | 'pregnancy' | 'maternal-health' | 'expert-advice' | 'baby-tracker' | 'development' | 'feeding-sleep' | 'baby-names' | 'safety' | 'nutrition' | 'white-noise';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatSession = useRef<Chat | null>(null);
  const { user } = useAuth();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (activeTab === 'chat' && !chatSession.current) {
      chatSession.current = startChat();
      if (!user) {
        handleSend('', undefined, true); 
      }
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (user && activeTab === 'chat' && !sessionId) {
      const initSession = async () => {
        const id = await createChatSession(user.uid, "New Conversation");
        if (id) {
            setSessionId(id);
            // No need to call handleSend here if sessionId will trigger welcome or if we want to wait
            // Actually, let's call it ONLY once with the ID
            handleSend('', undefined, true, id);
        }
      };
      initSession();
    }
  }, [user, activeTab]); // Removed sessionId dependency to prevent loop

  useEffect(() => {
    if (sessionId) {
      unsubscribeRef.current?.();
      unsubscribeRef.current = subscribeToMessages(sessionId, (msgs) => {
        setMessages(msgs);
      });
    }
    return () => unsubscribeRef.current?.();
  }, [sessionId]);

  const clearChat = async () => {
    if (user) {
      const id = await createChatSession(user.uid, "New Conversation");
      if (id) {
        setSessionId(id);
        chatSession.current = startChat();
        handleSend('', undefined, true, id);
      }
    } else {
      setMessages([]);
      chatSession.current = startChat();
      handleSend('', undefined, true);
    }
  };

  const handleSend = async (text: string, imageData?: string, isInitial = false, targetSessionId?: string) => {
    if (!chatSession.current) return;

    const currentSessionId = targetSessionId || sessionId;

    if (!isInitial) {
      const userMessage: Message = { 
        id: Date.now().toString(), 
        text: text || (imageData ? "Analyzing image..." : ""), 
        sender: Sender.User,
        timestamp: Date.now()
      };
      
      if (!currentSessionId) {
        setMessages(prev => [...prev, userMessage]);
      } else {
        await saveMessage(currentSessionId, userMessage.text, Sender.User, imageData);
      }
    }
    
    setIsTyping(true);
    const aiMessageTimestamp = Date.now() + 1;
    const aiMessageId = aiMessageTimestamp.toString();
    
    try {
      let messagePayload: any = text || (isInitial ? "Hello" : "");

      if (imageData) {
        const [mimeType, base64Data] = imageData.split(';base64,');
        messagePayload = {
          parts: [
            { text: text || "Analyze this image for any potential maternal or pediatric symptoms or health concerns." },
            { inlineData: { data: base64Data, mimeType: mimeType.split(':')[1] } }
          ]
        };
      }

      const stream = await chatSession.current.sendMessageStream({ message: messagePayload });
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        
        if (!currentSessionId) {
          setMessages(prev => {
            const otherMessages = prev.filter(m => !m.id.startsWith(aiMessageId));
            const newMessages: Message[] = [...otherMessages];
            const parts = fullResponse.split(/(\[RED_FLAG\].*?(?=\[RED_FLAG\]|$))/gs).filter(Boolean);

            parts.forEach((part, index) => {
               const trimmedPart = part.trim();
               if(trimmedPart.startsWith('[RED_FLAG]')) {
                   newMessages.push({
                       id: `${aiMessageId}-warning-${index}`,
                       text: trimmedPart.replace('[RED_FLAG]', '').trim(),
                       sender: Sender.Warning,
                       timestamp: aiMessageTimestamp + index
                   });
               } else if (trimmedPart) {
                   newMessages.push({
                       id: `${aiMessageId}-ai-${index}`,
                       text: trimmedPart,
                       sender: Sender.AI,
                       timestamp: aiMessageTimestamp + index
                   });
               }
            });
            return newMessages;
          });
        }
      }

      if (currentSessionId && fullResponse) {
          const parts = fullResponse.split(/(\[RED_FLAG\].*?(?=\[RED_FLAG\]|$))/gs).filter(Boolean);
          for (const part of parts) {
              const trimmedPart = part.trim();
              if (trimmedPart.startsWith('[RED_FLAG]')) {
                  await saveMessage(currentSessionId, trimmedPart.replace('[RED_FLAG]', '').trim(), Sender.Warning);
              } else if (trimmedPart) {
                  await saveMessage(currentSessionId, trimmedPart, Sender.AI);
              }
          }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (!currentSessionId) {
        setMessages(prev => [...prev, { id: aiMessageId, text: 'Sorry, I encountered an error communicating with the assistant.', sender: Sender.Warning, timestamp: Date.now() }]);
      } else {
        await saveMessage(currentSessionId, 'Sorry, I encountered an error communicating with the assistant.', Sender.Warning);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleReact = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...(msg.reactions || {}) };
        reactions[reaction] = (reactions[reaction] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard onStart={() => setActiveTab('chat')} onNavigate={setActiveTab} />;
      case 'chat':
        return <ChatInterface messages={messages} onSend={handleSend} isTyping={isTyping} onClear={clearChat} onReact={handleReact} />;
      case 'podcast':
        return <PodcastGrid />;
      case 'pregnancy':
      case 'maternal-health':
      case 'expert-advice':
        return <MotherHub activeSubTab={activeTab} />;
      case 'baby-tracker':
      case 'development':
      case 'nutrition':
      case 'feeding-sleep':
        return <BabyHub activeSubTab={activeTab} />;
      case 'baby-names':
      case 'white-noise':
      case 'safety':
        return <ToolsHub activeSubTab={activeTab} />;
      case 'shop':
        return <ShopPage />;
      default:
        return <HomeDashboard onStart={() => setActiveTab('chat')} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;