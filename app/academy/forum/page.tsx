import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  IconChevronLeft, 
  IconHeart,
  IconMessageDots,
  IconPlus
} from "@tabler/icons-react";

// Sample forum discussions (would come from Supabase in real implementation)
const sampleDiscussions = [
  {
    id: "1",
    title: "How did you find your co-founder?",
    content: "I'm currently looking for a technical co-founder for my SaaS idea. I've tried networking events and online platforms, but haven't found the right match yet. What strategies worked for you when finding your co-founder?",
    author: {
      id: "user1",
      name: "Michael K.",
      avatar: "/avatars/michael.jpg"
    },
    createdAt: "2023-07-15T08:30:00Z",
    category: "co-founders",
    replies: 12,
    likes: 8,
    isSticky: false
  },
  {
    id: "2",
    title: "Feedback on my landing page design",
    content: "I just finished designing the landing page for my new B2B SaaS product. I'd love to get some feedback from the community before I launch. Here's the link: [example.com]. Looking for insights on messaging clarity and overall conversion potential.",
    author: {
      id: "user2",
      name: "Sarah L.",
      avatar: "/avatars/sarah.jpg"
    },
    createdAt: "2023-07-15T10:45:00Z",
    category: "design",
    replies: 8,
    likes: 5,
    isSticky: false
  },
  {
    id: "3",
    title: "Tips for B2B SaaS pricing?",
    content: "We're about to launch our B2B SaaS product and are finalizing our pricing strategy. We're considering a tiered approach with freemium. What has worked well for others in the B2B space? Any pitfalls to avoid?",
    author: {
      id: "user3",
      name: "David R.",
      avatar: "/avatars/david.jpg"
    },
    createdAt: "2023-07-14T15:20:00Z",
    category: "pricing",
    replies: 15,
    likes: 10,
    isSticky: false
  },
  {
    id: "4",
    title: "Community Guidelines",
    content: "Welcome to the Academy Forum! This is a place for founders to connect, share insights, and help each other. Please follow these guidelines: 1) Be respectful and constructive 2) No promotional content without context 3) Use the search function before posting a new topic 4) Tag your posts with relevant categories.",
    author: {
      id: "admin1",
      name: "SG Combinator Team",
      avatar: "/avatars/admin.jpg"
    },
    createdAt: "2023-06-01T09:00:00Z",
    category: "announcements",
    replies: 2,
    likes: 25,
    isSticky: true
  },
  {
    id: "5",
    title: "How to approach enterprise clients?",
    content: "We've had success with SMB clients but are now trying to move upmarket to enterprise. The sales cycle seems completely different. Does anyone have experience with this transition and can share advice on enterprise sales strategies?",
    author: {
      id: "user4",
      name: "Jennifer T.",
      avatar: "/avatars/jennifer.jpg"
    },
    createdAt: "2023-07-13T11:10:00Z",
    category: "sales",
    replies: 7,
    likes: 6,
    isSticky: false
  },
  {
    id: "6",
    title: "Best tools for remote team collaboration?",
    content: "Our team is distributed across three time zones. We're using Slack and Zoom, but I'm looking for better async collaboration tools, especially for product development. What's working well for other remote-first startups?",
    author: {
      id: "user5",
      name: "Alex W.",
      avatar: "/avatars/alex.jpg"
    },
    createdAt: "2023-07-12T14:30:00Z",
    category: "tools",
    replies: 19,
    likes: 12,
    isSticky: false
  }
];

// Sample categories
const forumCategories = [
  { id: "all", name: "All Topics" },
  { id: "announcements", name: "Announcements" },
  { id: "co-founders", name: "Co-Founders" },
  { id: "fundraising", name: "Fundraising" },
  { id: "product", name: "Product" },
  { id: "design", name: "Design" },
  { id: "sales", name: "Sales" },
  { id: "marketing", name: "Marketing" },
  { id: "pricing", name: "Pricing" },
  { id: "tools", name: "Tools" }
];

export default async function ForumPage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/academy/forum");
  }

  // Sort discussions to show sticky posts first
  const sortedDiscussions = [...sampleDiscussions].sort((a, b) => {
    if (a.isSticky !== b.isSticky) return a.isSticky ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              href="/academy" 
              className="flex items-center text-gray-500 hover:text-emerald-600 transition-colors mr-4"
            >
              <IconChevronLeft size={20} className="mr-1" />
              <span>Back</span>
            </Link>
            <h1 className="text-3xl font-bold">Forum</h1>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <IconPlus size={18} className="mr-2" />
            New Discussion
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 sticky top-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <nav>
                  <ul className="space-y-1">
                    {forumCategories.map(category => (
                      <li key={category.id}>
                        <Link 
                          href={`/academy/forum?category=${category.id}`}
                          className={`block px-3 py-2 rounded-md text-sm hover:bg-gray-50 ${
                            category.id === 'all' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full">
                  <Input 
                    placeholder="Search discussions..." 
                    className="w-full"
                  />
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <Tabs defaultValue="latest" className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>
                <div className="text-sm text-gray-500">
                  {sortedDiscussions.length} discussions
                </div>
              </div>
              
              <TabsContent value="latest" className="space-y-4 mt-0">
                {sortedDiscussions.map(discussion => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
              </TabsContent>
              
              <TabsContent value="popular" className="space-y-4 mt-0">
                {[...sampleDiscussions]
                  .sort((a, b) => b.likes - a.likes)
                  .map(discussion => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                  ))
                }
              </TabsContent>
              
              <TabsContent value="unanswered" className="space-y-4 mt-0">
                {sampleDiscussions
                  .filter(d => d.replies === 0)
                  .map(discussion => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                  ))
                }
                {sampleDiscussions.filter(d => d.replies === 0).length === 0 && (
                  <Card className="bg-gray-50 border-0">
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500">No unanswered discussions at the moment!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="mr-2">Previous</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscussionCard({ discussion }: { discussion: typeof sampleDiscussions[0] }) {
  const formattedDate = new Date(discussion.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <Card className={`hover:border-gray-300 transition-all ${
      discussion.isSticky ? 'bg-emerald-50/40 border-emerald-100' : 'bg-white/80 backdrop-blur-sm border-gray-100'
    }`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <Link href={`/academy/forum/${discussion.id}`} className="group">
                <h3 className="font-medium text-base mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {discussion.isSticky && <span className="text-emerald-600 mr-2">[Sticky]</span>}
                  {discussion.title}
                </h3>
              </Link>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formattedDate}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{discussion.content}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-3">
                  {discussion.author.name}
                </span>
                <span className="flex items-center mr-3">
                  <IconMessageDots size={15} className="mr-1" />
                  {discussion.replies}
                </span>
                <span className="flex items-center">
                  <IconHeart size={15} className="mr-1" />
                  {discussion.likes}
                </span>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                {discussion.category}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 