import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default async function JobsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/jobs");
  }

  const jobListings = [
    { company: "TechNova AI", position: "Software Engineer", domain: "Artificial Intelligence", experience: "2+ years", description: "Join our AI research team and help build innovative AI solutions." },
    { company: "GreenWave Solutions", position: "Product Manager", domain: "Sustainability Tech", experience: "3+ years", description: "Lead product strategy and development for sustainable technology solutions." },
    { company: "FinTech Rise", position: "Data Analyst", domain: "Financial Technology", experience: "1+ years", description: "Analyze financial data to drive business decisions and improve user experience." },
    { company: "HealthTech Innovate", position: "Backend Developer", domain: "Healthcare Technology", experience: "3+ years", description: "Develop scalable backend systems for healthcare applications." },
    { company: "EduFuture Labs", position: "UX/UI Designer", domain: "EdTech", experience: "2+ years", description: "Design user-centric experiences for innovative educational platforms." },
    { company: "CryptoXchange", position: "Blockchain Developer", domain: "Cryptocurrency", experience: "2+ years", description: "Build decentralized applications and smart contracts for blockchain solutions." },
    { company: "AutoAI Systems", position: "Machine Learning Engineer", domain: "Autonomous Vehicles", experience: "3+ years", description: "Enhance AI models for self-driving car technology." },
    { company: "RetailBoost", position: "Marketing Specialist", domain: "E-commerce", experience: "2+ years", description: "Develop marketing campaigns to increase customer engagement." },
    { company: "CyberSecure Ltd.", position: "Cybersecurity Analyst", domain: "Cybersecurity", experience: "4+ years", description: "Monitor and enhance security measures to protect company assets." },
    { company: "AgriTech Innovations", position: "Data Scientist", domain: "Agriculture Technology", experience: "3+ years", description: "Leverage data analytics to optimize farming processes and sustainability." },
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Listings</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
              Create Job Offer <Plus size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Job Listing</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <input type="text" placeholder="Company Name" className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="Position" className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="Domain" className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="Years of Experience Required" className="w-full p-2 border rounded-md" />
              <textarea placeholder="Job Description" className="w-full p-2 border rounded-md" rows={4}></textarea>
              <Button type="submit" className="w-full">Submit Job Listing</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <p className="text-lg mb-8">Find talent or opportunities at companies in St. Gallen.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Available Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Browse current job openings</p>
            <div className="space-y-4">
              {jobListings.map((job, index) => (
                <div key={index} className="p-4 border rounded-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{job.position} at {job.company}</h3>
                    <p className="text-sm text-muted-foreground">{job.domain} - {job.experience} experience</p>
                    <p className="text-sm">{job.description}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Apply</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply for {job.position}</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4">
                        <input type="text" placeholder="Your Name" className="w-full p-2 border rounded-md" />
                        <input type="email" placeholder="Your Email" className="w-full p-2 border rounded-md" />
                        <textarea placeholder="Cover Letter" className="w-full p-2 border rounded-md" rows={4}></textarea>
                      </form>
                      <div className="flex justify-end mt-4">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                          Add PDF <Plus size={16} />
                        </Button>
                      </div>
                      <Button type="submit" className="w-full mt-4">Submit Application</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}