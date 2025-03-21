import { NextResponse } from 'next/server';

const API_BASE_URL = "https://polished-kingfish-intensely.ngrok-free.app";
const SANITY_CHECK_ENDPOINT = `${API_BASE_URL}/sanity_check`;

export async function GET() {
  try {
    console.log("Server-side sanity check to:", SANITY_CHECK_ENDPOINT);
    
    const response = await fetch(SANITY_CHECK_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Server API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Server-side sanity check error:", error.message);
    
    let errorType = "UNKNOWN_ERROR";
    if (error.name === "AbortError") {
      errorType = "TIMEOUT_ERROR";
    } else if (error.message?.includes("fetch failed")) {
      errorType = "NETWORK_ERROR";
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