# SG Combinator Database Schema

This directory contains SQL migration files for setting up the SG Combinator database schema in Supabase.

## Overview

The database schema includes tables, functions, triggers, and RLS (Row Level Security) policies for the following features:

1. **Core Schema** - User profiles and utility functions
2. **Founder Matching** - Connect founders based on skills and interests
3. **Job Listings** - Post and apply for startup jobs
4. **Academy** - Courses, forum, and chatbot for learning
5. **AI Consultant** - AI-powered startup advice

## Migration Files

The migration files should be executed in the following order:

1. `01_core_schema.sql` - Core schema with profiles table and utility functions
2. `02_founder_matching.sql` - Founder matching feature
3. `03_jobs.sql` - Job listings feature
4. `04_academy.sql` - Academy feature with courses, forum, and chatbot
5. `05_ai_consultant.sql` - AI consultant feature

## Prerequisites

Before running these migrations, make sure:

1. You have set up a Supabase project
2. Supabase Auth is properly configured
3. You have access to the Supabase Dashboard SQL Editor or CLI

## Running Migrations

### Via Supabase Dashboard

1. Go to the Supabase Dashboard > SQL Editor
2. Click "New Query"
3. Open each SQL file in order and execute them

### Via Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
# Initialize Supabase locally (if not already done)
supabase init

# Apply migrations
supabase db push
```

## Database Schema Structure

### Core Schema

- `profiles` - Extends the auth.users table with additional profile information (full_name, avatar_url, bio, link, age, gender)

### Founder Matching Schema

- `skills` - Skills for founders and jobs
- `founder_profiles` - Information about founders looking for co-founders
- `founder_skills` - Many-to-many relationship for founder skills
- `founder_connections` - Matches between founders
- `founder_messages` - Messages between connected founders

### Jobs Schema

- `companies` - Company profiles
- `job_listings` - Job postings
- `job_skills` - Skills required for jobs
- `job_applications` - User applications for jobs
- `saved_jobs` - Jobs bookmarked by users

### Academy Schema

- `courses` - Course details
- `course_modules` - Course chapters/sections
- `course_lessons` - Lessons within modules
- `course_enrollments` - User enrollments in courses
- `lesson_completions` - Tracks completed lessons
- `forum_categories` - Categories for forum discussions
- `forum_topics` - Forum discussion topics
- `forum_replies` - Replies to forum topics
- `chatbot_conversations` - AI chatbot conversations
- `chatbot_messages` - Messages in chatbot conversations

### AI Consultant Schema

- `ai_consultant_conversations` - Conversation metadata (user_id, title, category)
- `ai_consultant_messages` - Message history (role, content, timestamp) for API integration
- `ai_consultant_feedback` - User feedback on AI responses
- `ai_consultant_templates` - Predefined prompts for AI consultant

## Row Level Security (RLS)

All tables have RLS policies to ensure users can only access data they should be allowed to. For example:

- Users can only view/edit their own profile
- Users can only access their own conversations
- Published courses are viewable by everyone
- Only course creators can edit their courses

## Helper Functions

The schema includes several helper functions:

- `update_updated_at_column()` - Updates timestamps automatically
- `get_conversation_history()` - Returns formatted chat history for AI API integration

## Troubleshooting

If you encounter errors during migration:

1. Ensure migrations are executed in the correct order
2. Check for syntax errors in SQL statements
3. Verify that referenced tables exist before creating foreign key constraints
4. Check that all extensions are properly installed
5. Ensure you have the necessary permissions to create tables and policies 