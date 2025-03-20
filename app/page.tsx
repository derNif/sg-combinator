import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconUsers, 
  IconSchool, 
  IconBriefcase, 
  IconRobot,
  IconArrowRight
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-emerald-50 rounded-full mb-6">
          <div className="flex items-center text-emerald-700 text-sm font-medium px-3 py-1">
            <Image src="/logo.svg" alt="SG Combinator Logo" width={12} height={12} className="mr-2" />
            <span>Accelerating Innovation in St. Gallen</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
          Welcome to SG Combinator
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connecting founders, mentors, and resources to build successful startups in St. Gallen.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8 bg-emerald-500 hover:bg-emerald-600">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>

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
          className="inline-flex items-center font-medium text-emerald-600 hover:text-emerald-500"
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
