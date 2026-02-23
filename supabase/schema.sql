-- ============================================
-- PeptideReview Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Peptides table (admin-managed)
CREATE TABLE peptides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rating_sum INT DEFAULT 0,
  rating_count INT DEFAULT 0,
  effectiveness_sum INT DEFAULT 0,
  effectiveness_count INT DEFAULT 0,
  side_effects_sum INT DEFAULT 0,
  side_effects_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_peptides_slug ON peptides(slug);

ALTER TABLE peptides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Peptides are viewable by everyone"
  ON peptides FOR SELECT USING (true);

CREATE POLICY "Only admins can insert peptides"
  ON peptides FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Only admins can update peptides"
  ON peptides FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Only admins can delete peptides"
  ON peptides FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 3. Ratings table (one per user per peptide, multi-dimensional)
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peptide_id UUID NOT NULL REFERENCES peptides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stars INT CHECK (stars >= 1 AND stars <= 5),
  effectiveness INT CHECK (effectiveness >= 1 AND effectiveness <= 5),
  side_effects INT CHECK (side_effects >= 1 AND side_effects <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(peptide_id, user_id)
);

CREATE INDEX idx_ratings_peptide ON ratings(peptide_id);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own ratings"
  ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON ratings FOR DELETE USING (auth.uid() = user_id);

-- 4. Threads table
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peptide_id UUID NOT NULL REFERENCES peptides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_threads_peptide ON threads(peptide_id);

ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Threads are viewable by everyone"
  ON threads FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create threads"
  ON threads FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
  ON threads FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads"
  ON threads FOR DELETE USING (auth.uid() = user_id);

-- 5. Comments table (nested via parent_id)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_thread ON comments(thread_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE USING (auth.uid() = user_id);

-- 6. Votes table (polymorphic: threads and comments)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('thread', 'comment')),
  target_id UUID NOT NULL,
  value INT NOT NULL CHECK (value IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_votes_target ON votes(target_type, target_id);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own votes"
  ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Database Functions
-- ============================================

-- Upsert rating and update peptide aggregates atomically (multi-dimensional)
CREATE OR REPLACE FUNCTION upsert_rating(
  p_peptide_id UUID,
  p_user_id UUID,
  p_stars INT DEFAULT NULL,
  p_effectiveness INT DEFAULT NULL,
  p_side_effects INT DEFAULT NULL
) RETURNS void AS $$
DECLARE
  existing RECORD;
BEGIN
  SELECT stars, effectiveness, side_effects INTO existing
    FROM ratings WHERE peptide_id = p_peptide_id AND user_id = p_user_id;

  IF FOUND THEN
    IF p_stars IS NOT NULL THEN
      UPDATE ratings SET stars = p_stars WHERE peptide_id = p_peptide_id AND user_id = p_user_id;
      IF existing.stars IS NOT NULL THEN
        UPDATE peptides SET rating_sum = rating_sum - existing.stars + p_stars WHERE id = p_peptide_id;
      ELSE
        UPDATE peptides SET rating_sum = rating_sum + p_stars, rating_count = rating_count + 1 WHERE id = p_peptide_id;
      END IF;
    END IF;
    IF p_effectiveness IS NOT NULL THEN
      UPDATE ratings SET effectiveness = p_effectiveness WHERE peptide_id = p_peptide_id AND user_id = p_user_id;
      IF existing.effectiveness IS NOT NULL THEN
        UPDATE peptides SET effectiveness_sum = effectiveness_sum - existing.effectiveness + p_effectiveness WHERE id = p_peptide_id;
      ELSE
        UPDATE peptides SET effectiveness_sum = effectiveness_sum + p_effectiveness, effectiveness_count = effectiveness_count + 1 WHERE id = p_peptide_id;
      END IF;
    END IF;
    IF p_side_effects IS NOT NULL THEN
      UPDATE ratings SET side_effects = p_side_effects WHERE peptide_id = p_peptide_id AND user_id = p_user_id;
      IF existing.side_effects IS NOT NULL THEN
        UPDATE peptides SET side_effects_sum = side_effects_sum - existing.side_effects + p_side_effects WHERE id = p_peptide_id;
      ELSE
        UPDATE peptides SET side_effects_sum = side_effects_sum + p_side_effects, side_effects_count = side_effects_count + 1 WHERE id = p_peptide_id;
      END IF;
    END IF;
  ELSE
    INSERT INTO ratings (peptide_id, user_id, stars, effectiveness, side_effects)
      VALUES (p_peptide_id, p_user_id, p_stars, p_effectiveness, p_side_effects);
    IF p_stars IS NOT NULL THEN
      UPDATE peptides SET rating_sum = rating_sum + p_stars, rating_count = rating_count + 1 WHERE id = p_peptide_id;
    END IF;
    IF p_effectiveness IS NOT NULL THEN
      UPDATE peptides SET effectiveness_sum = effectiveness_sum + p_effectiveness, effectiveness_count = effectiveness_count + 1 WHERE id = p_peptide_id;
    END IF;
    IF p_side_effects IS NOT NULL THEN
      UPDATE peptides SET side_effects_sum = side_effects_sum + p_side_effects, side_effects_count = side_effects_count + 1 WHERE id = p_peptide_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Upsert vote and update target counters atomically
CREATE OR REPLACE FUNCTION upsert_vote(
  p_user_id UUID,
  p_target_type TEXT,
  p_target_id UUID,
  p_value INT
) RETURNS void AS $$
DECLARE
  old_value INT;
BEGIN
  SELECT value INTO old_value FROM votes
    WHERE user_id = p_user_id AND target_type = p_target_type AND target_id = p_target_id;

  IF old_value IS NOT NULL THEN
    IF old_value = p_value THEN
      -- Same vote again = remove vote (toggle off)
      DELETE FROM votes
        WHERE user_id = p_user_id AND target_type = p_target_type AND target_id = p_target_id;
      IF p_target_type = 'thread' THEN
        IF p_value = 1 THEN
          UPDATE threads SET upvotes = upvotes - 1 WHERE id = p_target_id;
        ELSE
          UPDATE threads SET downvotes = downvotes - 1 WHERE id = p_target_id;
        END IF;
      ELSE
        IF p_value = 1 THEN
          UPDATE comments SET upvotes = upvotes - 1 WHERE id = p_target_id;
        ELSE
          UPDATE comments SET downvotes = downvotes - 1 WHERE id = p_target_id;
        END IF;
      END IF;
    ELSE
      -- Switching vote direction
      UPDATE votes SET value = p_value
        WHERE user_id = p_user_id AND target_type = p_target_type AND target_id = p_target_id;
      IF p_target_type = 'thread' THEN
        IF p_value = 1 THEN
          UPDATE threads SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = p_target_id;
        ELSE
          UPDATE threads SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = p_target_id;
        END IF;
      ELSE
        IF p_value = 1 THEN
          UPDATE comments SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = p_target_id;
        ELSE
          UPDATE comments SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = p_target_id;
        END IF;
      END IF;
    END IF;
  ELSE
    -- New vote
    INSERT INTO votes (user_id, target_type, target_id, value)
      VALUES (p_user_id, p_target_type, p_target_id, p_value);
    IF p_target_type = 'thread' THEN
      IF p_value = 1 THEN
        UPDATE threads SET upvotes = upvotes + 1 WHERE id = p_target_id;
      ELSE
        UPDATE threads SET downvotes = downvotes + 1 WHERE id = p_target_id;
      END IF;
    ELSE
      IF p_value = 1 THEN
        UPDATE comments SET upvotes = upvotes + 1 WHERE id = p_target_id;
      ELSE
        UPDATE comments SET downvotes = downvotes + 1 WHERE id = p_target_id;
      END IF;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment comment count on a thread
CREATE OR REPLACE FUNCTION increment_comment_count(p_thread_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE threads SET comment_count = comment_count + 1 WHERE id = p_thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Seed Data: Initial Peptides
-- ============================================

INSERT INTO peptides (name, slug, description) VALUES
  ('BPC-157', 'bpc-157', 'Body Protection Compound. Known for gut healing and tissue repair properties.'),
  ('TB-500', 'tb-500', 'Thymosin Beta-4. Promotes wound healing, muscle repair, and reduces inflammation.'),
  ('CJC-1295', 'cjc-1295', 'Growth hormone releasing hormone analog. Stimulates GH secretion.'),
  ('Ipamorelin', 'ipamorelin', 'Selective growth hormone secretagogue. Minimal side effects compared to other GH peptides.'),
  ('PT-141', 'pt-141', 'Bremelanotide. Used for sexual dysfunction, works on the nervous system.'),
  ('Selank', 'selank', 'Synthetic analog of tuftsin. Known for anxiolytic and nootropic effects.'),
  ('Semax', 'semax', 'Synthetic peptide derived from ACTH. Nootropic and neuroprotective properties.'),
  ('GHK-Cu', 'ghk-cu', 'Copper peptide. Promotes skin remodeling, wound healing, and anti-aging effects.'),
  ('Thymosin Alpha-1', 'thymosin-alpha-1', 'Immune-modulating peptide. Enhances T-cell function and immune response.'),
  ('Epithalon', 'epithalon', 'Telomerase activator peptide. Studied for anti-aging and longevity effects.');
