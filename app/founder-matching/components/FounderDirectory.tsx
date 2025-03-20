"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IconSearch, IconCheck, IconMail } from "@tabler/icons-react";

// Hardcoded founder data
const founders = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Technical Co-Founder",
    skills: ["Full-Stack", "AI/ML", "Cloud Architecture"],
    industry: "FinTech",
    location: "San Francisco, CA",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Former Google engineer with 8 years of experience building scalable financial applications. Passionate about using AI to solve complex financial problems.",
    experience: "Google (5 years), Stripe (3 years)",
    education: "MS Computer Science, Stanford",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Product-Focused Co-Founder",
    skills: ["Product Management", "UX/UI Design", "Growth Strategies"],
    industry: "HealthTech",
    location: "Boston, MA",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Product leader who built and scaled health apps with 1M+ users. Looking to revolutionize patient care through technology.",
    experience: "Oscar Health (4 years), Athenahealth (3 years)",
    education: "MBA, Harvard Business School",
  },
  {
    id: 3,
    name: "Miguel Rodriguez",
    role: "Business Co-Founder",
    skills: ["Business Development", "Sales", "Fundraising"],
    industry: "E-commerce",
    location: "Miami, FL",
    imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    bio: "Serial entrepreneur with 2 successful exits. Expert in scaling B2C companies and building high-performance sales teams.",
    experience: "Founder at RetailTech (acquired), VP Sales at Shopify",
    education: "BBA, University of Miami",
  },
  {
    id: 4,
    name: "Emily Zhang",
    role: "Technical Co-Founder",
    skills: ["Backend Development", "Distributed Systems", "Blockchain"],
    industry: "Crypto / Web3",
    location: "New York, NY",
    imageUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    bio: "Blockchain developer with deep expertise in smart contracts and DeFi protocols. Built systems processing $500M+ in transactions.",
    experience: "Ethereum Foundation, Coinbase",
    education: "PhD in Computer Science, MIT",
  },
  {
    id: 5,
    name: "David Wilson",
    role: "Marketing Co-Founder",
    skills: ["Digital Marketing", "Brand Strategy", "Content Creation"],
    industry: "Media & Entertainment",
    location: "Los Angeles, CA",
    imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "CMO who led growth for multiple entertainment startups. Specializes in viral marketing campaigns and audience building.",
    experience: "Netflix (3 years), Spotify (2 years)",
    education: "BA in Marketing, USC",
  },
  {
    id: 6,
    name: "Priya Patel",
    role: "Technical Co-Founder",
    skills: ["Mobile Development", "DevOps", "System Architecture"],
    industry: "EdTech",
    location: "Austin, TX",
    imageUrl: "https://randomuser.me/api/portraits/women/26.jpg",
    bio: "Engineering leader who built educational platforms serving 5M+ students globally. Passionate about making education accessible.",
    experience: "Chegg, Coursera, Khan Academy",
    education: "MS in Computer Engineering, UT Austin",
  },
  {
    id: 7,
    name: "James Lee",
    role: "Operations Co-Founder",
    skills: ["Operations", "Supply Chain", "Logistics"],
    industry: "Logistics / Supply Chain",
    location: "Chicago, IL",
    imageUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    bio: "Operations expert with experience optimizing global supply chains. Built logistics networks for Fortune 500 companies.",
    experience: "Amazon (6 years), UPS (3 years)",
    education: "MBA, Northwestern Kellogg",
  },
  {
    id: 8,
    name: "Olivia Brown",
    role: "Product-Focused Co-Founder",
    skills: ["Product Strategy", "Customer Research", "Data Analysis"],
    industry: "SaaS",
    location: "Seattle, WA",
    imageUrl: "https://randomuser.me/api/portraits/women/17.jpg",
    bio: "Product lead who helped scale a SaaS startup from seed to Series C. Expert in B2B product development and enterprise solutions.",
    experience: "Salesforce, Zendesk, HubSpot",
    education: "MS in Information Systems, University of Washington",
  },
  {
    id: 9,
    name: "Daniel Kim",
    role: "Finance Co-Founder",
    skills: ["Financial Modeling", "Investment Strategy", "Fundraising"],
    industry: "FinTech",
    location: "New York, NY",
    imageUrl: "https://randomuser.me/api/portraits/men/37.jpg",
    bio: "Former investment banker with expertise in early-stage fundraising. Raised over $150M for startups across various sectors.",
    experience: "Goldman Sachs, Y Combinator",
    education: "MBA, Wharton",
  },
  {
    id: 10,
    name: "Zoe Thompson",
    role: "Design Co-Founder",
    skills: ["UX/UI Design", "Brand Design", "Product Design"],
    industry: "Consumer Products",
    location: "Portland, OR",
    imageUrl: "https://randomuser.me/api/portraits/women/50.jpg",
    bio: "Award-winning designer who created user experiences for global brands. Believes in human-centered design as a competitive advantage.",
    experience: "Airbnb, Nike, Figma",
    education: "BFA in Design, RISD",
  },
];

export default function FounderDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactedFounders, setContactedFounders] = useState<number[]>([]);

  // Filter founders based on search query
  const filteredFounders = founders.filter((founder) => {
    const query = searchQuery.toLowerCase();
    return (
      founder.name.toLowerCase().includes(query) ||
      founder.role.toLowerCase().includes(query) ||
      founder.industry.toLowerCase().includes(query) ||
      founder.location.toLowerCase().includes(query) ||
      founder.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  // Handle contact button click
  const handleContact = (id: number) => {
    setContactedFounders((prev) => [...prev, id]);
  };

  return (
    <div>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 mb-8">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name, role, skills, industry, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full border-gray-200 focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFounders.map((founder) => (
          <Dialog key={founder.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/2] relative bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={founder.imageUrl}
                        alt={founder.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1">{founder.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{founder.role} • {founder.location}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {founder.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2">
                      Industry: <span className="font-medium">{founder.industry}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{founder.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-[100px_1fr] gap-6 mt-4">
                <div>
                  <img
                    src={founder.imageUrl}
                    alt={founder.name}
                    className="w-full rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{founder.role}</h3>
                  <p className="text-gray-500 text-sm mb-2">{founder.location}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {founder.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">BIO</h4>
                  <p className="text-gray-700">{founder.bio}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">EXPERIENCE</h4>
                    <p className="text-gray-700">{founder.experience}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">EDUCATION</h4>
                    <p className="text-gray-700">{founder.education}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t flex justify-end">
                  {contactedFounders.includes(founder.id) ? (
                    <Button variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                      <IconCheck className="mr-2" size={16} />
                      Contacted
                    </Button>
                  ) : (
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleContact(founder.id)}
                    >
                      <IconMail className="mr-2" size={16} />
                      Contact
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      
      {filteredFounders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
          <IconSearch size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No founders match your search criteria</p>
          <p className="text-gray-400 text-sm">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
} 