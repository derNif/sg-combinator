import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  IconClock, 
  IconUser, 
  IconArrowRight,
  IconChevronLeft,
  IconCertificate
} from "@tabler/icons-react";

export default async function CoursesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/academy/courses");
  }

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link 
            href="/academy" 
            className="flex items-center text-gray-500 hover:text-emerald-600 transition-colors mr-4"
          >
            <IconChevronLeft size={20} className="mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-3xl font-bold">Courses</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm p-6 col-span-1 md:col-span-2 flex flex-col justify-between border border-gray-100">
            <div>
              <h2 className="text-2xl font-bold mb-4">Learn at your own pace</h2>
              <p className="text-gray-600 mb-6">
                Browse our collection of courses created by successful founders and industry experts. 
                Each course is designed to help you build specific skills needed for your startup journey.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-full">All Courses</Button>
              <Button variant="outline" className="rounded-full">Startup Fundamentals</Button>
              <Button variant="outline" className="rounded-full">Growth</Button>
              <Button variant="outline" className="rounded-full">Fundraising</Button>
            </div>
          </Card>
          
          <Card className="bg-emerald-50 shadow-sm p-6 border-0">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <IconCertificate size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Your Progress</h3>
              <p className="text-gray-600 text-sm">Track your learning journey</p>
            </div>
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Courses Completed</span>
                <span className="text-2xl font-bold">0/3</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
              <span className="text-xs text-gray-500">Start your first course!</span>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Continue Learning
            </Button>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
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
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard
              title="Building a Sales Machine"
              description="Systematic approach to building a repeatable sales process"
              author="Mark Roberge"
              duration="6 hours"
              level="Advanced"
              href="/academy/courses"
            />
            
            <CourseCard
              title="Startup Legal Basics"
              description="Essential legal knowledge for founders and early-stage startups"
              author="Carolynn Levy"
              duration="2 hours"
              level="Beginner"
              href="/academy/courses"
            />
            
            <CourseCard
              title="User Experience Design"
              description="Creating products people love through UX design principles"
              author="Julie Zhuo"
              duration="4 hours"
              level="Intermediate"
              href="/academy/courses"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Become a Course Creator</h2>
            <p className="text-gray-600 mb-6 max-w-xl">
              Are you an experienced founder or expert in your field? Share your knowledge 
              with the community and help the next generation of entrepreneurs.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Apply to Become a Creator
            </Button>
          </div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-100/50 rounded-full"></div>
        </div>
      </div>
    </div>
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