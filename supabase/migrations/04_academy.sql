-- Academy schema for SG Combinator

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  level TEXT, -- 'beginner', 'intermediate', 'advanced'
  duration TEXT, -- Estimated time to complete
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false
);

-- Course modules (chapters/sections)
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL, -- For ordering modules
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Course lessons
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration INT, -- in minutes
  order_index INT NOT NULL, -- For ordering lessons
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- User course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  progress FLOAT DEFAULT 0, -- Percentage (0-100)
  last_lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id, user_id)
);

-- User lesson completions
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(lesson_id, user_id)
);

-- Forum categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert default forum categories
INSERT INTO forum_categories (name, description, slug, order_index) VALUES
('General Discussion', 'General startup and community discussions', 'general', 1),
('Founder Questions', 'Questions about founding and growing startups', 'founder-questions', 2),
('Technical Topics', 'Technical discussions about development and product', 'technical', 3),
('Fundraising', 'Discussions about fundraising and investor relations', 'fundraising', 4),
('Marketing & Growth', 'Topics related to marketing and growing your startup', 'marketing-growth', 5)
ON CONFLICT (slug) DO NOTHING;

-- Forum topics
CREATE TABLE IF NOT EXISTS forum_topics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0
);

-- Forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_solution BOOLEAN DEFAULT false -- Mark as solution/accepted answer
);

-- Chatbot conversations
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Chatbot messages
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Set up RLS (Row Level Security)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Policies for courses
CREATE POLICY "Published courses are viewable by everyone"
  ON courses
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Course creators can view all their courses"
  ON courses
  FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Course creators can manage their courses"
  ON courses
  FOR ALL
  USING (auth.uid() = creator_id);

-- Policies for course_modules and course_lessons
CREATE POLICY "Published course content is viewable by everyone"
  ON course_modules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Course creators can manage their course modules"
  ON course_modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id 
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Published lesson content is viewable by everyone"
  ON course_lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM course_modules 
      WHERE id = module_id 
      AND EXISTS (
        SELECT 1 FROM courses 
        WHERE id = course_modules.course_id 
        AND is_published = true
      )
    )
  );

CREATE POLICY "Course creators can manage their lessons"
  ON course_lessons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM course_modules 
      WHERE id = module_id 
      AND EXISTS (
        SELECT 1 FROM courses 
        WHERE id = course_modules.course_id 
        AND creator_id = auth.uid()
      )
    )
  );

-- Policies for course_enrollments
CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in published courses"
  ON course_enrollments
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id 
      AND is_published = true
    )
  );

CREATE POLICY "Users can update their own enrollment progress"
  ON course_enrollments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for lesson_completions
CREATE POLICY "Users can view their lesson completions"
  ON lesson_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark lessons as completed"
  ON lesson_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for forum categories, topics, and replies
CREATE POLICY "Forum categories are viewable by everyone"
  ON forum_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Forum topics are viewable by everyone"
  ON forum_topics
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create forum topics"
  ON forum_topics
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own forum topics"
  ON forum_topics
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Forum replies are viewable by everyone"
  ON forum_replies
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create forum replies"
  ON forum_replies
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own forum replies"
  ON forum_replies
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Policies for chatbot
CREATE POLICY "Users can view their own chatbot conversations"
  ON chatbot_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chatbot conversations"
  ON chatbot_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbot conversations"
  ON chatbot_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their own conversations"
  ON chatbot_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chatbot_conversations 
      WHERE id = conversation_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add messages to their own conversations"
  ON chatbot_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chatbot_conversations 
      WHERE id = conversation_id 
      AND user_id = auth.uid()
    )
  );

-- Triggers for updated_at timestamp
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON course_lessons
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON course_enrollments
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_forum_topics_updated_at
  BEFORE UPDATE ON forum_topics
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_chatbot_conversations_updated_at
  BEFORE UPDATE ON chatbot_conversations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 