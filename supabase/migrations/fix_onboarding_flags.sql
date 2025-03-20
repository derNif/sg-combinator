-- Ensure onboarding_completed is a boolean column
ALTER TABLE profiles 
ALTER COLUMN onboarding_completed SET DATA TYPE boolean
USING CASE 
    WHEN onboarding_completed IS NULL THEN false
    WHEN onboarding_completed::text = 'f' THEN false
    WHEN onboarding_completed::text = 't' THEN true
    WHEN onboarding_completed::text = 'false' THEN false
    WHEN onboarding_completed::text = 'true' THEN true
    ELSE false
END;

-- Set default value for onboarding_completed
ALTER TABLE profiles 
ALTER COLUMN onboarding_completed SET DEFAULT false;

-- Create index to make onboarding flag queries faster
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed 
ON profiles(onboarding_completed);

-- Ensure all profiles where onboarding_completed_at is not null have onboarding_completed = true
UPDATE profiles 
SET onboarding_completed = true
WHERE onboarding_completed = false 
AND onboarding_completed_at IS NOT NULL;

-- Ensure all profiles with data in user_preferences have onboarding_completed = true
UPDATE profiles p
SET onboarding_completed = true
FROM user_preferences up
WHERE p.id = up.user_id
AND p.onboarding_completed = false;

-- Make sure the complete_onboarding function works properly
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