-- AI Consultant schema for SG Combinator

-- AI consultant conversations
CREATE TABLE IF NOT EXISTS ai_consultant_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Conversation',
  category TEXT, -- e.g., 'business-model', 'fundraising', 'marketing', 'product'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- AI consultant messages
CREATE TABLE IF NOT EXISTS ai_consultant_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES ai_consultant_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  token_count INT -- Optional token usage tracking
);

-- AI consultant feedback
CREATE TABLE IF NOT EXISTS ai_consultant_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES ai_consultant_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful BOOLEAN,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- AI consultant templates (predefined prompts)
CREATE TABLE IF NOT EXISTS ai_consultant_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  category TEXT, -- e.g., 'business-model', 'fundraising', 'marketing', 'product'
  is_public BOOLEAN DEFAULT true,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert default templates
INSERT INTO ai_consultant_templates (title, description, prompt, category) VALUES
('Business Model Canvas', 'Generate a business model canvas for your startup idea', 'Help me create a business model canvas for the following startup idea: ', 'business-model'),
('Pitch Deck Outline', 'Create an outline for a pitch deck', 'I need a pitch deck outline for my startup that focuses on: ', 'fundraising'),
('Marketing Strategy', 'Develop a basic marketing strategy', 'Help me create a marketing strategy for my startup. My target audience is: ', 'marketing'),
('Product Roadmap', 'Generate a 6-month product roadmap', 'I need a 6-month product roadmap for my SaaS product. The key features we want to build are: ', 'product')
ON CONFLICT DO NOTHING;

-- Set up RLS (Row Level Security)
ALTER TABLE ai_consultant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_consultant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_consultant_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_consultant_templates ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Users can view their own AI consultant conversations"
  ON ai_consultant_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI consultant conversations"
  ON ai_consultant_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI consultant conversations"
  ON ai_consultant_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI consultant conversations"
  ON ai_consultant_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for messages
CREATE POLICY "Users can view messages in their own conversations"
  ON ai_consultant_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_consultant_conversations 
      WHERE id = conversation_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their own conversations"
  ON ai_consultant_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_consultant_conversations 
      WHERE id = conversation_id 
      AND user_id = auth.uid()
    )
  );

-- Policies for feedback
CREATE POLICY "Users can provide feedback on AI responses"
  ON ai_consultant_feedback
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM ai_consultant_messages 
      WHERE id = message_id
      AND EXISTS (
        SELECT 1 FROM ai_consultant_conversations
        WHERE id = ai_consultant_messages.conversation_id
        AND user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view their own feedback"
  ON ai_consultant_feedback
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policies for templates
CREATE POLICY "AI consultant templates are viewable by everyone"
  ON ai_consultant_templates
  FOR SELECT
  USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "Users can create custom AI consultant templates"
  ON ai_consultant_templates
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own AI consultant templates"
  ON ai_consultant_templates
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Helper function to get chat history for API integration
CREATE OR REPLACE FUNCTION get_conversation_history(conversation_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'role', role,
      'content', content,
      'created_at', created_at
    ) ORDER BY created_at ASC
  ) INTO result
  FROM ai_consultant_messages
  WHERE conversation_id = conversation_uuid;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamp
CREATE TRIGGER update_ai_consultant_conversations_updated_at
  BEFORE UPDATE ON ai_consultant_conversations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ai_consultant_templates_updated_at
  BEFORE UPDATE ON ai_consultant_templates
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 