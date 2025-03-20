"use client"

import { useRef, useEffect, useState } from "react";
import { useChat } from "ai/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nanoid } from 'nanoid';
import { IconArrowUp, IconRobot, IconUser } from "@tabler/icons-react";

// Define the questions to be asked
const SYSTEM_PROMPT = `You are a founder matching assistant. Your job is to ask the user 3 specific questions to understand what kind of co-founder they're looking for. The questions should be:
1. What industry or sector is your startup in?
2. What specific skills or expertise are you looking for in a co-founder?
3. What's your preferred work style and values for a co-founder?

Ask these questions one at a time, waiting for a response before moving to the next question. After the user answers the third question, let them know they can now discover their matches.`;

type FounderMatchingChatbotProps = {
  onComplete: () => void;
};

export default function FounderMatchingChatbot({ onComplete }: FounderMatchingChatbotProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = useRef(nanoid()).current;
  const [questionCount, setQuestionCount] = useState(0);
  const [showDiscoverButton, setShowDiscoverButton] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',  // Using the existing chat API endpoint
    id: chatId,
    initialMessages: [{
      id: 'welcome',
      role: 'assistant',
      content: "Hi there! I'll help you find the perfect co-founder. I'll ask you 3 quick questions to understand what you're looking for. What industry or sector is your startup in?",
    }],
    body: {
      systemPrompt: SYSTEM_PROMPT
    }
  });

  // Monitor assistant messages to track question count
  useEffect(() => {
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    
    // Count questions that have been asked (excluding the welcome message)
    if (assistantMessages.length > 1) {
      // Check if all 3 questions have been asked
      if (assistantMessages.length >= 4 && !showDiscoverButton) {
        setShowDiscoverButton(true);
      }
    }
  }, [messages, showDiscoverButton]);

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

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Founder Matching Assistant</h2>
        <p className="text-gray-600">Answer a few questions to find your ideal co-founder</p>
      </div>
      
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 flex flex-col h-[400px]">
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
          {showDiscoverButton ? (
            <Button 
              onClick={onComplete}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-4"
            >
              Discover Your Matches
            </Button>
          ) : (
            <form onSubmit={handleFormSubmit} className="w-full flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your answer..."
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
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 