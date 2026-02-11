CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS profiles (
id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
username TEXT UNIQUE,
avatar_url TEXT,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS execution_logs (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID REFERENCES auth.users ON DELETE SET NULL,
language TEXT NOT NULL,
code_snippet TEXT NOT NULL,
output TEXT,
status TEXT, 
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS virtual_files (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
owner_id UUID REFERENCES auth.users ON DELETE CASCADE,
name TEXT NOT NULL,
content TEXT,
path TEXT DEFAULT '/',
is_directory BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own logs" ON execution_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON execution_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own files" ON virtual_files FOR ALL USING (auth.uid() = owner_id);
