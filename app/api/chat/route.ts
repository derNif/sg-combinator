import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Course content for RAG
const courseContext = [
    "YC Advice #1: Launch Now - Don't wait for perfection. Launch quickly and learn from real user feedback. Early iterations are key.",
    "YC Advice #2: Build Something People Want - Focus on solving a real problem for a specific group. People will pay for solutions to their pain points.",
    "YC Advice #3: Do Things That Don't Scale - In the beginning, do everything manually to provide great experiences and learn from your users.",
    "YC Advice #4: Focus on the 90/10 Solution - Address the 10% of problems that have the biggest impact, and solve them relentlessly.",
    "YC Advice #5: Find Raving Fans - Before scaling, focus on building a small group of passionate users who genuinely love your product.",
    "YC Advice #6: Don't Panic - Every startup hits tough times. Treat failures as learning opportunities rather than setbacks.",
    "YC Advice #7: Write Code, Talk to Users - Spend your time building and talking to customers. These are the most valuable activities early on.",
    "YC Advice #8: Be Lean - Avoid wasting money on office spaces, perks, or expensive ads. Focus your spending on getting product-market fit.",
    "YC Advice #9: Growth Follows Great Products - A great product will naturally lead to growth. Make sure your product is solid before focusing on scaling.",
    "YC Advice #10: Don't Scale Prematurely - Don't scale too soon. First, make sure you have a good product and an efficient process in place.",
    "YC Advice #11: Big Numbers Don't Equal Success - High valuations don't guarantee success. Focus on building a sustainable, profitable business.",
    "YC Advice #12: Avoid Time Sinks - Don't waste time on long negotiations or partnerships that don't align with your core mission.",
    "YC Advice #13: Corporate Queries = Wasted Time - Corporate interest often leads nowhere. Politely decline and focus on your core product.",
    "YC Advice #14: Skip Most Conferences - Unless a conference directly helps you acquire customers, it's better spent building or engaging with users.",
    "YC Advice #15: Stay Nimble - Stay small and flexible in the early stages to quickly pivot based on customer feedback.",
    "YC Advice #16: Solve One Problem Brilliantly - Don't try to do everything. Focus on solving one problem exceptionally well.",
    "YC Advice #17: Build Strong Founder Relationships - Founder conflicts are a top reason startups fail. Communicate openly and regularly with co-founders.",
    "YC Advice #18: Fire Problem Customers - Don't hesitate to cut ties with customers who take up too much energy and don't add value.",
    "YC Advice #19: Ignore Competitors - Focus on solving your problems and serving your customers. Execution is more important than what your competitors are doing.",
    "YC Advice #20: Focus, Not Money - Most startups fail due to a lack of focus, not money. Stay disciplined and stick to your goals.",
    "YC Advice #21: Be Nice - Reputation matters. Treat your team, customers, and partners with respect and kindness.",
    "YC Advice #22: Sleep and Self-Care - Avoid burnout. Prioritize sleep, exercise, and mental health to stay sharp and effective.",
    ];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    
    // Skip processing if it's not from the user
    if (latestMessage.role !== 'user') {
      return Response.json({ error: 'Invalid message format' }, { status: 400 });
    }
    
    // Simple RAG - Find relevant context from course content
    const relevantContext = courseContext.filter(context => 
      context.toLowerCase().includes(latestMessage.content.toLowerCase())
    );
    
    // If no direct matches, add more general context
    const finalContext = relevantContext.length > 0 
      ? relevantContext 
      : courseContext.slice(0, 3); // Use first 3 pieces of context as default
    
    // Prepare system prompt with context
    const systemPrompt = `You are an AI startup assistant with expertise in Y Combinator's advice for founders. 
      Be concise, practical, and helpful. 
      
      Use the following context from our Academy courses to inform your responses:
      ${finalContext.join('\n\n')}
      
      If the user asks something outside of your knowledge about startups or SME, politely focus the conversation 
      back to startup advice and YC principles. Always be encouraging and constructive.
      
      Keep responses under 3 paragraphs when possible.`;

    // Use streamText from ai v4.x
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: messages.filter((m: { role: string }) => m.role !== 'system'),
      temperature: 0.7,
      maxTokens: 500,
    });
    
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return Response.json({ error: 'Error processing your request' }, { status: 500 });
  }
} 