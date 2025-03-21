import { NextResponse } from 'next/server';

const API_BASE_URL = "https://polished-kingfish-intensely.ngrok-free.app";
const INVOKE_CHAT_ENDPOINT = `${API_BASE_URL}/invoke_chat`;

export async function POST(request: Request) {
  try {
    // Get the prompt from the request
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "MISSING_PROMPT", message: "Prompt is required" },
        { status: 400 }
      );
    }
    
    console.log("Server-side chat request for prompt:", prompt);
    
    const response = await fetch(INVOKE_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt }),
      // Timeout after 15 seconds
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`Server API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.response) {
      throw new Error("Invalid response format from API");
    }
    
    return NextResponse.json({ success: true, response: data.response });
  } catch (error: any) {
    console.error("Server-side chat error:", error.message);
    
    let errorType = "UNKNOWN_ERROR";
    if (error.name === "AbortError") {
      errorType = "TIMEOUT_ERROR";
    } else if (error.message?.includes("fetch failed")) {
      errorType = "NETWORK_ERROR";
    } else if (error.message?.includes("Invalid response format")) {
      errorType = "FORMAT_ERROR";
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorType,
        message: error.message
      },
      { status: 500 }
    );
  }
} 