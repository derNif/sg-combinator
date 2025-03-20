import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  IconBook, 
  IconMessage, 
  IconRobot,
  IconArrowRight,
  IconTrophy,
  IconUsers,
  IconAward,
  IconBulb,
  IconUser,
  IconClock
} from "@tabler/icons-react";

export default async function AcademyPage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/academy");
  }

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative mb-16 pb-6">
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-cyan-50 opacity-70"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-20 -ml-10 -mb-20"></div>
          </div>
          
          <div className="relative z-10 px-6 py-12 md:py-16 md:px-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Academy</h1>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl font-medium">
              Access curated resources, workshops, and mentorship to develop essential startup skills. 
              Learn from experienced founders and connect with the community.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AcademyFeatureCard
                title="Courses"
                description="Learn from experienced founders"
                icon={<IconBook size={28} />}
                href="/academy/courses"
              />
              
              <AcademyFeatureCard
                title="Forum"
                description="Connect with the community"
                icon={<IconMessage size={28} />}
                href="/academy/forum"
              />
              
              <AcademyFeatureCard
                title="AI Professor"
                description="Get expert startup advice instantly"
                icon={<IconRobot size={28} />}
                href="/academy/chatbot"
              />
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatCard number="22+" label="Expert Courses" icon={<IconBook />} />
          <StatCard number="8k+" label="Community Members" icon={<IconUsers />} />
          <StatCard number="150+" label="Founders Graduated" icon={<IconAward />} />
          <StatCard number="24/7" label="AI Support" icon={<IconRobot />} />
        </div>
        
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
              <p className="text-gray-500">Curated knowledge from top experts and founders</p>
            </div>
            <Link href="/academy/courses" className="text-emerald-600 hover:text-emerald-500 font-medium flex items-center">
              View all courses
              <IconArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard
              title="YC's 22 Advices for Startups"
              description="Essential advice from Y Combinator for building successful startups"
              author="Y Combinator"
              duration="4 hours"
              level="Beginner"
              href="/academy/courses/yc-advice"
              featured
            />
            
            <CourseCard
              title="Fundraising Fundamentals"
              description="Learn how to raise money for your startup from seed to Series A"
              author="Sam Altman"
              duration="3 hours"
              level="Intermediate"
              href="/academy/courses"
            />
            
            <CourseCard
              title="Product-Market Fit"
              description="Strategies for finding and validating product-market fit"
              author="Marc Andreessen"
              duration="5 hours"
              level="Intermediate"
              href="/academy/courses"
            />
          </div>
        </div>
        
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Forum Discussions</h2>
              <p className="text-gray-500">Join the conversation with fellow founders</p>
            </div>
            <Link href="/academy/forum" className="text-emerald-600 hover:text-emerald-500 font-medium flex items-center">
              View all discussions
              <IconArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-6">
            <ForumDiscussionPreview
              title="How did you find your co-founder?"
              author="Michael K."
              replies={12}
              time="2 hours ago"
              href="/academy/forum"
            />
            
            <ForumDiscussionPreview
              title="Feedback on my landing page design"
              author="Sarah L."
              replies={8}
              time="5 hours ago"
              href="/academy/forum"
            />
            
            <ForumDiscussionPreview
              title="Tips for B2B SaaS pricing?"
              author="David R."
              replies={15}
              time="1 day ago"
              href="/academy/forum"
            />
          </div>
        </div>
        
        <div className="mt-16 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-2xl opacity-30 -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-2xl opacity-20 -ml-10 -mb-10"></div>
          </div>
          
          <div className="relative z-10 p-10 md:p-14 text-center md:text-left md:flex items-center justify-between">
            <div className="md:max-w-md mb-8 md:mb-0">
              <div className="inline-block p-3 rounded-2xl bg-white/20 mb-4">
                <IconBulb size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">Become a Course Creator</h2>
              <p className="text-emerald-50 mb-6">
                Are you an experienced founder or expert in your field? Share your knowledge with the community 
                and help the next generation of entrepreneurs.
              </p>
              <Button className="bg-white text-emerald-700 hover:bg-gray-100 px-6 py-5 rounded-full font-medium">
                Apply to Become a Creator
              </Button>
            </div>
            
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                <div className="text-white text-lg font-medium mb-2 flex items-center">
                  <IconTrophy size={20} className="mr-2" />
                  Creator Benefits
                </div>
                <ul className="space-y-3">
                  {['Reach thousands of founders', 'Build your personal brand', 'Get paid for your expertise'].map((benefit, i) => (
                    <li key={i} className="flex items-center text-emerald-50">
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, label, icon }: { number: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-gray-900">{number}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function AcademyFeatureCard({ 
  title, 
  description, 
  icon, 
  href 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 overflow-hidden group">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:scale-110">
              {icon}
            </div>
            <CardTitle className="text-xl mb-3">{title}</CardTitle>
            <p className="text-gray-600">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CourseCard({ 
  title, 
  description,
  author,
  duration,
  level,
  href,
  featured = false
}: { 
  title: string;
  description: string;
  author: string;
  duration: string;
  level: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className={`h-full overflow-hidden border hover:shadow-md transition-all group ${
        featured ? 'border-emerald-200 bg-white/90' : 'border-gray-100 bg-white/80'
      }`}>
        <div className={`h-3 ${featured ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
        <CardContent className="p-6">
          <h3 className={`font-bold text-lg mb-2 group-hover:text-emerald-600 transition-colors ${
            featured ? 'text-emerald-700' : ''
          }`}>
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <div className="flex items-center mr-4">
              <IconUser size={14} className="mr-1" />
              <span>{author}</span>
            </div>
            <div className="flex items-center">
              <IconClock size={14} className="mr-1" />
              <span>{duration}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              level === 'Beginner' 
                ? 'bg-green-100 text-green-800' 
                : level === 'Intermediate'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
            }`}>
              {level}
            </span>
            <span className="text-emerald-600 flex items-center group-hover:text-emerald-500 text-sm font-medium">
              View Course
              <IconArrowRight size={16} className="ml-1 transform transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ForumDiscussionPreview({ 
  title, 
  author, 
  replies, 
  time,
  href 
}: { 
  title: string; 
  author: string; 
  replies: number;
  time: string;
  href: string;
}) {
  return (
    <Link href={href} className="block mb-6 last:mb-0">
      <Card className="bg-white/80 backdrop-blur-sm hover:bg-gray-50 transition-all cursor-pointer border border-gray-100 hover:border-emerald-100 hover:shadow-sm">
        <CardContent className="py-5 px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-base mb-1 text-gray-900 group-hover:text-emerald-700">{title}</h3>
              <p className="text-gray-500 text-sm">Posted by {author} • {time}</p>
            </div>
            <div className="bg-emerald-50 px-3 py-1 rounded-full text-sm text-emerald-700 font-medium">
              {replies} replies
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 