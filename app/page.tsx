import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconUsers, 
  IconSchool, 
  IconBriefcase, 
  IconRobot,
  IconArrowRight,
  IconLeaf
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserProfile from "@/components/UserProfile";
import MessageBox from "@/components/MessageBox";

// Hot Topics Data
const hotTopics = [
  { title: "AI in Startups", description: "How AI is transforming businesses", link: "/ai-startups" },
  { title: "Fundraising 101", description: "Best ways to raise capital", link: "/fundraising" },
  { title: "Co-Founder Matching", description: "Find your startup partner", link: "/founder-matching" },
  { title: "Web3 & Crypto", description: "Future of decentralized apps", link: "/web3" },
];

export default function Home() {
  // Example user
  const user = {
    profilePicUrl: "/pp.jpeg",
    name: "Jane Doe",
    bio: "Startup founder, mentor, and lifelong learner.",
    reputation: 12345,
    goldCount: 10,
    silverCount: 20,
    bronzeCount: 30,
  };

  // Example tasks for next badges
  const nextBadgeTasks = [
    "Complete 5 more mentor sessions",
    "Post 3 more startup ideas",
    "Participate in a startup event",
  ];

  return (
    
    <div className="py-6">

      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-emerald-50 rounded-full mb-6">
          <div className="flex items-center text-emerald-700 text-sm font-medium px-3 py-1">
            <IconLeaf size={16} className="mr-2" />
            <span>Accelerating Innovation in St. Gallen</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
          SG Combinator
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connecting founders, mentors, and resources to build successful startups in St. Gallen.
        </p>
      </div>
      
      {/* Hot Topics Section */}
      <section className="mb-10">
        <div className="max-w-4xl mx-auto text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <p className="text-red-500" /> Hot Topics
          </h2>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="flex overflow-x-auto gap-4 px-4 py-2 scrollbar-hide">
          {hotTopics.map((topic, index) => (
            <Link href={topic.link} key={index} className="min-w-[250px]">
              <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-4">
                <CardContent className="flex flex-col items-center">
                  <p className="text-emerald-500 w-8 h-8 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold">User Profile</h2>
        <div className="flex justify-center mt-8"></div>
        <UserProfile
        profilePicUrl={user.profilePicUrl}
        name={user.name}
        bio={user.bio}
        reputation={user.reputation}
        goldCount={user.goldCount}
        silverCount={user.silverCount}
        bronzeCount={user.bronzeCount}
        nextBadgeTasks={nextBadgeTasks}
      />
      </section>


      <div id="features" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <FeatureCard 
          title="AI Consultant"
          description="Get AI-powered startup advice"
          icon={<IconRobot className="w-10 h-10 text-emerald-500" />}
          content="Leverage our AI consultant to get personalized advice on your startup challenges, from business model validation to fundraising strategies."
          href="/ai-consultant"
        />
        
        <FeatureCard 
          title="Founder Matching"
          description="Find the perfect founder for your startup"
          icon={<IconUsers className="w-10 h-10 text-emerald-500" />}
          content="Connect with potential founders based on skills, experience, and vision alignment. Our matching algorithm helps you find the right partner for your startup journey."
          href="/founder-matching"
        />

        <FeatureCard 
          title="Academy"
          description="Learn essential startup skills"
          icon={<IconSchool className="w-10 h-10 text-emerald-500" />}
          content="Access curated resources, workshops, and mentorship to develop the skills needed to build a successful startup in today's competitive landscape."
          href="/academy"
        />

        <FeatureCard 
          title="Job Listings"
          description="Find talent or opportunities in St. Gallen"
          icon={<IconBriefcase className="w-10 h-10 text-emerald-500" />}
          content="Browse through job openings at local startups or post positions for your own venture. Connect with the best talent in the region."
          href="/jobs"
        />
      </div>

      <div className="text-center pb-8 relative">
        <div className="absolute inset-0 bg-emerald-50 rounded-3xl -z-10"></div>
        <div className="max-w-2xl mx-auto pt-10 pb-12 px-4">
          <h2 className="text-2xl font-bold mb-4 text-emerald-800">Join the St. Gallen Startup Ecosystem</h2>
          <p className="text-gray-600 mb-8">
            SG Combinator is where innovation meets opportunity. Connect with the most talented founders, mentors, and investors in St. Gallen.
          </p>
          <Button asChild className="rounded-full px-8 bg-emerald-500 hover:bg-emerald-600">
            <Link href="/auth/signin">Sign In Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  icon,
  content,
  href
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
  href: string;
}) {
  return (
    <Card className="border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 mb-4">{content}</p>
        <Link 
          href={href} 
          className="mt-4 inline-flex items-center font-medium text-emerald-600 hover:text-emerald-500"
        >
          Learn more 
          <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1">
            <IconArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
