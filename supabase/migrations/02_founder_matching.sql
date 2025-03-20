-- Founder Matching schema for SG Combinator

-- Skills table (for founder skills)
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- e.g., 'technical', 'business', 'design'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert common skills
INSERT INTO skills (name, category) VALUES
('Software Development', 'technical'),
('UI/UX Design', 'design'),
('Product Management', 'business'),
('Marketing', 'business'),
('Sales', 'business'),
('Data Science', 'technical'),
('AI/Machine Learning', 'technical'),
('Business Development', 'business'),
('Finance', 'business'),
('Operations', 'business')
ON CONFLICT (name) DO NOTHING;

-- Founder profiles (extends user profiles)
CREATE TABLE IF NOT EXISTS founder_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  looking_for TEXT, -- What the founder is looking for in a co-founder
  idea_stage TEXT, -- e.g., 'ideation', 'prototype', 'mvp', 'growth'
  idea_description TEXT,
  industry TEXT,
  commitment_level TEXT, -- e.g., 'full-time', 'part-time'
  work_preference TEXT, -- e.g., 'remote', 'in-person', 'hybrid'
  equity_split TEXT, -- Thoughts on equity split
  previous_startup_experience BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true
);

-- Founder skills (many-to-many)
CREATE TABLE IF NOT EXISTS founder_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  founder_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level TEXT, -- e.g., 'beginner', 'intermediate', 'expert'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(founder_id, skill_id)
);

-- Founder connections (matches)
CREATE TABLE IF NOT EXISTS founder_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES founder_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(requester_id, recipient_id)
);

-- Founder connection messages
CREATE TABLE IF NOT EXISTS founder_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  connection_id UUID REFERENCES founder_connections(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- Set up RLS (Row Level Security)
ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_messages ENABLE ROW LEVEL SECURITY;

-- Policies for founder_profiles
CREATE POLICY "Founder profiles are viewable by everyone"
  ON founder_profiles
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Users can update their own founder profile"
  ON founder_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own founder profile"
  ON founder_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policies for founder_skills
CREATE POLICY "Founder skills are viewable by everyone"
  ON founder_skills
  FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own founder skills"
  ON founder_skills
  FOR ALL
  USING (auth.uid() = founder_id);

-- Policies for founder_connections
CREATE POLICY "Users can view their own connections"
  ON founder_connections
  FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create connection requests"
  ON founder_connections
  FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections they are part of"
  ON founder_connections
  FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Policies for founder_messages
CREATE POLICY "Users can view messages in their connections"
  ON founder_messages
  FOR SELECT
  USING (auth.uid() IN (
    SELECT requester_id FROM founder_connections WHERE id = connection_id
    UNION
    SELECT recipient_id FROM founder_connections WHERE id = connection_id
  ));

CREATE POLICY "Users can send messages in their connections"
  ON founder_messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT requester_id FROM founder_connections WHERE id = connection_id
      UNION
      SELECT recipient_id FROM founder_connections WHERE id = connection_id
    )
  );

-- Triggers for updated_at timestamp
CREATE TRIGGER update_founder_profiles_updated_at
  BEFORE UPDATE ON founder_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_founder_connections_updated_at
  BEFORE UPDATE ON founder_connections
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 