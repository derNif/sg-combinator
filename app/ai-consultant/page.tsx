"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, MessageSquare, Trash2 } from "lucide-react";
import { IconArrowUp, IconRobot, IconUser } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

// Internal API routes
const INTERNAL_SANITY_CHECK = "/api/ai-consultant/sanity-check";
const INTERNAL_CHAT_ENDPOINT = "/api/ai-consultant/chat";

// Types for chat
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

// Utility for API sanity check
async function sanityCheck() {
    try {
        console.log("SANITY-00: Checking API via internal route:", INTERNAL_SANITY_CHECK);
        const response = await fetch(INTERNAL_SANITY_CHECK, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`SANITY-01: HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("SANITY-SUCCESS: Response:", result);
        
        return result.success 
            ? { success: true, data: result.data }
            : { success: false, error: result.error };
    } catch (error: any) {
        // Handle specific error types
        let errorCode = "SANITY-02";
        
        if (error.name === "AbortError") {
            errorCode = "SANITY-TIMEOUT";
            console.error(`${errorCode}: Request timed out`);
        } else if (error.message?.includes("Failed to fetch")) {
            errorCode = "SANITY-NETWORK";
            console.error(`${errorCode}: Network error - Could not reach internal API`);
        } else {
            console.error(`${errorCode}: Error fetching data:`, error);
        }
        
        return { success: false, error: errorCode };
    }
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

export default function AIConsultantPage() {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [prompt, setPrompt] = useState("");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation>({
      id: generateId(),
      title: "New Conversation",
      messages: [{
        id: 'welcome',
        role: 'assistant',
        content: "Hi there! I'm your AI Consultant. I can help answer questions about your business challenges. What would you like to know?",
        timestamp: Date.now()
      }],
      timestamp: Date.now()
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorId, setErrorId] = useState("");
    const [apiStatus, setApiStatus] = useState<{success: boolean, message: string}>({
        success: false,
        message: "Checking API connection..."
    });

    // Load conversations from localStorage on initial render
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('ai-consultant-conversations');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setConversations(parsed);
          } catch (e) {
            console.error("Failed to parse conversations from localStorage", e);
          }
        }
      }
    }, []);

    // Save conversations to localStorage when they change
    useEffect(() => {
      if (conversations.length > 0 && typeof window !== 'undefined') {
        localStorage.setItem('ai-consultant-conversations', JSON.stringify(conversations));
      }
    }, [conversations]);

    // Scroll to bottom whenever messages change
    useEffect(() => {
      if (messagesEndRef.current && currentConversation.messages.length > 0) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [currentConversation.messages.length]);

    // Call sanity check on component mount
    useEffect(() => {
        const checkApiStatus = async () => {
            const result = await sanityCheck();
            if (result.success) {
                setApiStatus({
                    success: true,
                    message: "API connected successfully"
                });
            } else {
                setApiStatus({
                    success: false,
                    message: "Unable to connect to AI service. Some features may be limited."
                });
            }
        };
        
        checkApiStatus();
    }, []);

    // Create a new conversation
    const startNewConversation = () => {
      // Save current conversation if it has messages
      if (currentConversation.messages.length > 1) { // More than just the welcome message
        const convoExists = conversations.find(c => c.id === currentConversation.id);
        
        if (!convoExists) {
          setConversations(prev => [currentConversation, ...prev]);
        } else {
          setConversations(prev => prev.map(c => 
            c.id === currentConversation.id ? currentConversation : c
          ));
        }
      }
      
      // Create new conversation
      setCurrentConversation({
        id: generateId(),
        title: "New Conversation",
        messages: [{
          id: 'welcome',
          role: 'assistant',
          content: "How can I help with your project today?",
          timestamp: Date.now()
        }],
        timestamp: Date.now()
      });
      setPrompt("");
    };
    
    // Load a conversation
    const loadConversation = (conversation: Conversation) => {
      // Save current conversation if needed
      if (currentConversation.messages.length > 1) {
        const convoExists = conversations.find(c => c.id === currentConversation.id);
        
        if (!convoExists) {
          setConversations(prev => [currentConversation, ...prev]);
        } else {
          setConversations(prev => prev.map(c => 
            c.id === currentConversation.id ? currentConversation : c
          ));
        }
      }

      setCurrentConversation(conversation);
    };
    
    // Delete a conversation
    const deleteConversation = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setConversations(prev => prev.filter(c => c.id !== id));
      
      // If we're deleting the current conversation, start a new one
      if (currentConversation.id === id) {
        startNewConversation();
      }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError("");
        setErrorId("");

        // Add user message to conversation
        const userMessage: ChatMessage = {
          id: generateId(),
          role: 'user',
          content: prompt,
          timestamp: Date.now()
        };
        
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage],
          timestamp: Date.now()
        };
        
        // Update title if this is the first user message
        if (currentConversation.messages.length === 1) { // Just the welcome message
          updatedConversation.title = prompt.slice(0, 30) + (prompt.length > 30 ? "..." : "");
        }
        
        setCurrentConversation(updatedConversation);
        setPrompt("");

        try {
            console.log("CHAT-01: Making API request to internal endpoint:", INTERNAL_CHAT_ENDPOINT);
            
            const response = await fetch(INTERNAL_CHAT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error(`CHAT-02: HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(`CHAT-03: API Error: ${result.error} - ${result.message}`);
            }
            
            // Add assistant response to conversation
            const assistantMessage: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: result.response,
              timestamp: Date.now()
            };
            
            const finalConversation = {
              ...updatedConversation,
              messages: [...updatedConversation.messages, assistantMessage],
              timestamp: Date.now()
            };
            
            setCurrentConversation(finalConversation);
            
            // Save to conversations list
            setConversations(prev => {
              const existing = prev.findIndex(c => c.id === finalConversation.id);
              if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = finalConversation;
                return updated;
              }
              return [finalConversation, ...prev];
            });
            
        } catch (error: any) {
            console.error("CHAT-04: Error:", error);
            
            // Set specific error ID based on error
            let errorMessage = "I'm sorry, I encountered an error processing your request. Please try again.";
            let id = "UNKNOWN";
            
            if (error.name === "AbortError") {
                id = "TIMEOUT-ERROR";
                errorMessage = "The request took too long and timed out. Please try again.";
            } else if (error.message) {
                if (error.message.includes("CHAT-02")) {
                    id = "API-STATUS-ERROR";
                } else if (error.message.includes("CHAT-03")) {
                    id = "API-RESPONSE-FORMAT";
                } else if (error.message.includes("Failed to fetch")) {
                    id = "NETWORK-ERROR";
                    errorMessage = "Network error: Could not reach the AI service. Please try again later.";
                } else {
                    id = "GENERAL-ERROR";
                }
            }
            
            setErrorId(id);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 flex justify-between items-center">
                    <div>
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold">AI Consultant</h1>
                        </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={startNewConversation}
                      className="flex items-center"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      New Chat
                    </Button>
                </div>

                {!apiStatus.success && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
                        <p className="font-medium">API Connection Status</p>
                        <p className="text-sm">{apiStatus.message}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                    <div className="lg:col-span-5">
                        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 flex flex-col h-[550px]">
                            <CardContent className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-4">
                                    {currentConversation.messages.map((message) => (
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
                                                    <p className="text-xs mt-1 opacity-70">
                                                        {new Date(message.timestamp).toLocaleTimeString([], { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}
                                                    </p>
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
                                    {error && (
                                        <div className="flex justify-start">
                                            <div className="bg-red-50 text-red-500 rounded-lg px-4 py-2 max-w-[80%] border border-red-200">
                                                <p className="text-sm">{error}</p>
                                                {errorId && <p className="text-xs mt-1 font-mono">Error ID: {errorId}</p>}
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </CardContent>
                            
                            <CardFooter className="border-t p-4">
                                <form onSubmit={handleSubmit} className="w-full flex gap-2">
                                    <Input
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Ask me anything about your business challenges..."
                                        disabled={isLoading}
                                        className="flex-1 rounded-full border-gray-200 focus-visible:ring-emerald-500"
                                    />
                                    <Button 
                                        type="submit" 
                                        className="bg-emerald-600 hover:bg-emerald-700 rounded-full w-10 h-10 p-0 flex items-center justify-center"
                                        disabled={isLoading || !prompt.trim()}
                                    >
                                        <IconArrowUp size={16} />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="h-[550px]">
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm font-medium">Chat History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[470px] pr-4">
                                    {conversations.length === 0 ? (
                                        <div className="text-center p-4 text-muted-foreground">
                                            <p>No previous conversations</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-2">
                                            {conversations.map((conversation) => (
                                                <li
                                                    key={conversation.id}
                                                    className="p-2 border rounded-md hover:bg-muted/30 cursor-pointer flex justify-between items-center"
                                                    onClick={() => loadConversation(conversation)}
                                                >
                                                    <div className="truncate flex-grow">
                                                        <p className="font-medium truncate">{conversation.title}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(conversation.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => deleteConversation(conversation.id, e)}
                                                        className="h-7 w-7"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">
                    <p>This AI Consultant may occasionally provide inaccurate information. Verify important details.</p>
                </div>
            </div>
        </div>
    );
} 