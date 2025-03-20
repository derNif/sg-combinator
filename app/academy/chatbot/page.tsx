"use client"

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { nanoid } from 'nanoid';
import { IconChevronLeft, IconArrowUp, IconRobot, IconUser, IconRefresh } from "@tabler/icons-react";

export default function ChatbotPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = useRef(nanoid()).current;

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    id: chatId,
    initialMessages: [{
      id: 'welcome',
      role: 'assistant',
      content: "Hi there! I'm your AI Professor. I can help answer questions about your startup journey, using knowledge from our Academy resources. What would you like to know?",
    }],
  });

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
  };

  const handleNewChat = () => {
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: "How can I help with your startup today?",
    }]);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <Link 
                href="/academy" 
                className="flex items-center text-gray-500 hover:text-emerald-600 transition-colors mr-4"
              >
                <IconChevronLeft size={20} className="mr-1" />
                <span>Back</span>
              </Link>
              <h1 className="text-3xl font-bold">AI Professor</h1>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleNewChat}
            className="flex items-center"
          >
            <IconRefresh size={16} className="mr-2" />
            New Chat
          </Button>
        </div>
        
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 flex flex-col h-[480px]">
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="mr-2 mt-1">
                      {message.role === "user" ? (
                        <IconUser size={16} />
                      ) : (
                        <IconRobot size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.createdAt && (
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <IconRobot size={16} />
                      <div className="h-2 w-4 bg-emerald-600 rounded-full animate-pulse"></div>
                      <div className="h-2 w-4 bg-emerald-600 rounded-full animate-pulse delay-100"></div>
                      <div className="h-2 w-4 bg-emerald-600 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-4">
            <form onSubmit={handleFormSubmit} className="w-full flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything about startups..."
                disabled={isLoading}
                className="flex-1 rounded-full border-gray-200 focus-visible:ring-emerald-500"
              />
              <Button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 rounded-full w-10 h-10 p-0 flex items-center justify-center"
                disabled={isLoading || !input.trim()}
              >
                <IconArrowUp size={16} />
              </Button>
            </form>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>This AI Professor is powered by OpenAI and has access to Academy course content.</p>
          <p>It may occasionally provide inaccurate information. Verify important details.</p>
        </div>
      </div>
    </div>
  );
} 