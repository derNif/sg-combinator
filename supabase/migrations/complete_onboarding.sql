-- Complete Onboarding Migration for SG Combinator
-- This file contains all onboarding-related migrations in one place

--------------------------------------------------------------------------
-- Basic profile onboarding fields
--------------------------------------------------------------------------

-- Add onboarding flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Updated migration approach
ALTER TABLE profiles DROP COLUMN IF EXISTS onboarding_step;
ALTER TABLE profiles DROP COLUMN IF EXISTS onboarding_path;
ALTER TABLE profiles DROP COLUMN IF EXISTS has_completed_onboarding;

--------------------------------------------------------------------------
-- User preferences and goals
--------------------------------------------------------------------------

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  primary_goal TEXT,
  objectives TEXT[]
);

--------------------------------------------------------------------------
-- Startups information
--------------------------------------------------------------------------

-- Create startups table
CREATE TABLE IF NOT EXISTS startups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  stage TEXT,
  description TEXT
);

--------------------------------------------------------------------------
-- Skills and experience
--------------------------------------------------------------------------

-- Create user skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  skill TEXT NOT NULL
);

-- Create user experience table
CREATE TABLE IF NOT EXISTS user_experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  description TEXT
);

--------------------------------------------------------------------------
-- Row Level Security (RLS)
--------------------------------------------------------------------------

-- Set up RLS (Row Level Security)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_experience ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for startups
CREATE POLICY "Users can view their own startups"
  ON startups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own startups"
  ON startups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own startups"
  ON startups FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for user_skills
CREATE POLICY "Users can view their own skills"
  ON user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills"
  ON user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills"
  ON user_skills FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for user_experience
CREATE POLICY "Users can view their own experience"
  ON user_experience FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experience"
  ON user_experience FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experience"
  ON user_experience FOR UPDATE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------
-- Utility Functions and Triggers
--------------------------------------------------------------------------

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_startups_updated_at
  BEFORE UPDATE ON startups
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_experience_updated_at
  BEFORE UPDATE ON user_experience
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to complete onboarding
CREATE OR REPLACE FUNCTION complete_onboarding(user_uuid UUID) 
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET 
    onboarding_completed = true,
    onboarding_completed_at = now()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop outdated tables and functions
DROP TABLE IF EXISTS onboarding_data CASCADE;
DROP TABLE IF EXISTS onboarding_progress CASCADE;
DROP FUNCTION IF EXISTS update_onboarding_step(UUID, INT);
DROP FUNCTION IF EXISTS update_onboarding_step(UUID, TEXT);
DROP FUNCTION IF EXISTS set_onboarding_path(UUID, TEXT); 