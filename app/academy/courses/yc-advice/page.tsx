import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  IconChevronLeft, 
  IconBook, 
  IconCheck, 
  IconClock,
  IconUser,
  IconCertificate,
  IconList,
  IconBulb,
  IconRocket
} from "@tabler/icons-react";

// This represents the course structure for YC's 22 Advices
// In a real app, this would come from a database
const ycAdviceContent = [
  {
    id: 1,
    title: "Launch Now",
    explanation: "Many startups make the mistake of waiting too long to launch their product. YC advises launching as soon as you have a minimum viable product, even if it's embarrassingly simple. Early feedback from real users is far more valuable than perfecting features in isolation.",
    realWorldExample: "Dropbox launched with a simple video demonstration before the actual product was ready. This allowed them to validate demand and gather a waitlist of interested users. Airbnb started with just a simple website offering air mattresses in the founders' apartment during a design conference.",
    keyPoints: [
      "Don't wait for perfect; launch with an MVP",
      "Early user feedback is invaluable",
      "You can always improve post-launch"
    ]
  },
  {
    id: 2,
    title: "Build Something People Want",
    explanation: "The most fundamental advice in startups: make something people actually want and are willing to pay for. This sounds obvious but many startups build products based on interesting technical challenges rather than solving real user problems.",
    realWorldExample: "Stripe founders recognized the pain of integrating payments for developers and built a solution that was dramatically simpler than existing options. Instacart identified that people wanted grocery delivery but previous attempts had failed due to poor execution, not lack of demand.",
    keyPoints: [
      "Talk to potential users before and while building",
      "Solve real problems, not interesting technical challenges",
      "If users don't get excited, pivot quickly"
    ]
  },
  {
    id: 3,
    title: "Do Things That Don't Scale",
    explanation: "In the early days, do things manually that you'll eventually automate. Personally recruit your first users, provide extraordinarily good customer service, and take extreme measures to make those early users happy. This unscalable attention ensures you build the right product.",
    realWorldExample: "Airbnb founders went door-to-door in New York to help hosts take professional photos of their listings. DoorDash founders delivered food orders themselves in the early days to understand the delivery process intimately.",
    keyPoints: [
      "Manually recruit your early users",
      "Provide extraordinary customer service",
      "Learn from unscalable interactions before automating"
    ]
  },
  // Additional advices would be included here
];

// Example quiz questions
const quizQuestions = [
  {
    id: 1,
    question: "According to YC's advice, when should you launch your product?",
    options: [
      "As soon as you have a minimum viable product",
      "After extensive private beta testing",
      "When all planned features are complete",
      "After securing significant funding"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "What is the most important thing to focus on according to YC?",
    options: [
      "Building advanced technology",
      "Creating a perfect business plan",
      "Building something people want",
      "Getting media coverage"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What does 'Do Things That Don't Scale' mean?",
    options: [
      "Focus on small markets first",
      "Manually provide extraordinary service to early users",
      "Keep your team small as long as possible",
      "Don't worry about infrastructure"
    ],
    correctAnswer: 1
  }
];

export default async function YCAdvicePage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/academy/courses/yc-advice");
  }

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link 
            href="/academy/courses" 
            className="flex items-center text-gray-500 hover:text-emerald-600 transition-colors mr-4"
          >
            <IconChevronLeft size={20} className="mr-1" />
            <span>Back to Courses</span>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">YC's 22 Advices for Startups</h1>
            <p className="text-gray-600 mb-6">
              Essential advice from Y Combinator for building successful startups
            </p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <IconUser size={16} className="mr-1" />
                <span>Y Combinator</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <IconClock size={16} className="mr-1" />
                <span>4 hours</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <IconBook size={16} className="mr-1" />
                <span>22 lessons</span>
              </div>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Beginner
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100 p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-600 mb-4">
                Y Combinator's advice has helped shape thousands of successful startups. 
                This course distills their most important lessons into actionable insights 
                for founders at any stage.
              </p>
              <p className="text-gray-600 mb-4">
                Each lesson includes practical advice, explanation of why it matters, 
                and real-world examples from YC companies that applied these principles.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <InfoCard
                  icon={<IconList size={20} />}
                  title="Course Structure"
                  description="22 bite-sized lessons with practical examples"
                />
                <InfoCard
                  icon={<IconBulb size={20} />}
                  title="What You'll Learn"
                  description="Proven strategies for startup success"
                />
                <InfoCard
                  icon={<IconRocket size={20} />}
                  title="After Completion"
                  description="Apply these principles to your startup"
                />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 sticky top-8">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span>Course Progress</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-4">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Start Learning
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to Bookmarks
                  </Button>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">What's Included</h3>
                  <ul className="space-y-2">
                    <FeatureItem text="22 Startup Advice Lessons" />
                    <FeatureItem text="Real-world YC Company Examples" />
                    <FeatureItem text="Knowledge Check Quiz" />
                    <FeatureItem text="Course Completion Certificate" />
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="content" className="mb-10">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="quiz">Knowledge Quiz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-6">
            {ycAdviceContent.map((advice) => (
              <AdviceLesson key={advice.id} advice={advice} />
            ))}
            <div className="text-center pt-4">
              <Button className="mr-4">Show All 22 Lessons</Button>
              <Button variant="outline">Mark as Complete</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="quiz">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
              <CardHeader>
                <CardTitle>Test Your Knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {quizQuestions.map((quiz) => (
                    <QuizQuestion key={quiz.id} quiz={quiz} />
                  ))}
                  <div className="pt-4 flex justify-center">
                    <Button className="px-8 bg-emerald-600 hover:bg-emerald-700">
                      Submit Answers
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InfoCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start">
        <div className="text-emerald-600 mr-3">{icon}</div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center text-sm">
      <IconCheck size={16} className="text-emerald-500 mr-2" />
      <span>{text}</span>
    </li>
  );
}

function AdviceLesson({ 
  advice 
}: { 
  advice: typeof ycAdviceContent[0]; 
}) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
              {advice.id}
            </div>
            <CardTitle className="text-lg">{advice.title}</CardTitle>
          </div>
          <Button size="sm" variant="ghost">
            Mark Complete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Why It Matters</h3>
          <p className="text-gray-600 text-sm">{advice.explanation}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Real-World Example</h3>
          <p className="text-gray-600 text-sm">{advice.realWorldExample}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Key Points</h3>
          <ul className="space-y-1">
            {advice.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <IconCheck size={16} className="text-emerald-500 mr-2 mt-0.5" />
                <span className="text-gray-600">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function QuizQuestion({ 
  quiz 
}: { 
  quiz: typeof quizQuestions[0]; 
}) {
  return (
    <div>
      <h3 className="font-medium mb-3">{quiz.question}</h3>
      <div className="space-y-2">
        {quiz.options.map((option, idx) => (
          <div key={idx} className="flex items-center">
            <input 
              type="radio" 
              id={`q${quiz.id}-a${idx}`} 
              name={`question-${quiz.id}`} 
              className="mr-3"
            />
            <label 
              htmlFor={`q${quiz.id}-a${idx}`} 
              className="text-gray-700 text-sm"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
} 