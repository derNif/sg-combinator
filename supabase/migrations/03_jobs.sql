-- Jobs schema for SG Combinator

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  industry TEXT,
  size TEXT, -- e.g., '1-10', '11-50', '51-200', '201-500', '501+'
  founded_year INT,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_verified BOOLEAN DEFAULT false
);

-- Job listings table
CREATE TABLE IF NOT EXISTS job_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT, -- e.g., 'full-time', 'part-time', 'contract', 'internship'
  remote_option TEXT, -- e.g., 'remote', 'in-person', 'hybrid'
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  salary_min INT, -- Optional salary range
  salary_max INT,
  salary_currency TEXT DEFAULT 'CHF',
  application_url TEXT,
  contact_email TEXT,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Job skills (many-to-many with the skills table)
CREATE TABLE IF NOT EXISTS job_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(job_id, skill_id)
);

-- Job applications
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'submitted', -- 'submitted', 'reviewing', 'interviewed', 'rejected', 'accepted'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(job_id, applicant_id)
);

-- Saved jobs (for user bookmarks)
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(job_id, user_id)
);

-- Set up RLS (Row Level Security)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Policies for companies
CREATE POLICY "Companies are viewable by everyone"
  ON companies
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create companies"
  ON companies
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Company creators can update their companies"
  ON companies
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Policies for job_listings
CREATE POLICY "Active job listings are viewable by everyone"
  ON job_listings
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Job creators can view all their job listings"
  ON job_listings
  FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can create job listings"
  ON job_listings
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Job creators can update their job listings"
  ON job_listings
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Policies for job_skills
CREATE POLICY "Job skills are viewable by everyone"
  ON job_skills
  FOR SELECT
  USING (true);

CREATE POLICY "Job creators can manage job skills"
  ON job_skills
  FOR ALL
  USING (auth.uid() IN (
    SELECT creator_id FROM job_listings 
    WHERE id = job_id
  ));

-- Policies for job_applications
CREATE POLICY "Users can view their own applications"
  ON job_applications
  FOR SELECT
  USING (auth.uid() = applicant_id);

CREATE POLICY "Job creators can view applications to their jobs"
  ON job_applications
  FOR SELECT
  USING (auth.uid() IN (
    SELECT creator_id FROM job_listings 
    WHERE id = job_id
  ));

CREATE POLICY "Users can submit job applications"
  ON job_applications
  FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update their own applications"
  ON job_applications
  FOR UPDATE
  USING (auth.uid() = applicant_id);

-- Policies for saved_jobs
CREATE POLICY "Users can view their saved jobs"
  ON saved_jobs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save/unsave jobs"
  ON saved_jobs
  FOR ALL
  USING (auth.uid() = user_id);

-- Triggers for updated_at timestamp
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON job_listings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 