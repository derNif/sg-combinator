-- Add email field to profiles table and sync it with auth.users
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT NULL;

-- Update the function to store email on new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    avatar_url,
    email
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing profiles with email from auth.users
UPDATE profiles
SET email = u.email
FROM auth.users u
WHERE profiles.id = u.id
AND profiles.email IS NULL; 