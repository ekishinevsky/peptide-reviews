export interface Peptide {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rating_sum: number;
  rating_count: number;
  effectiveness_sum: number;
  effectiveness_count: number;
  side_effects_sum: number;
  side_effects_count: number;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
}

export interface Thread {
  id: string;
  peptide_id: string;
  user_id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  created_at: string;
  profiles?: { username: string };
}

export interface Comment {
  id: string;
  thread_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  image_url: string | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
  profiles?: { username: string };
  children?: Comment[];
}

export interface Vote {
  id: string;
  user_id: string;
  target_type: "thread" | "comment";
  target_id: string;
  value: 1 | -1;
  created_at: string;
}

export interface Rating {
  id: string;
  peptide_id: string;
  user_id: string;
  stars: number | null;
  effectiveness: number | null;
  side_effects: number | null;
  created_at: string;
}

export interface PeptideWithThreadCount extends Peptide {
  thread_count: number;
}

export interface ThreadWithPeptide extends Thread {
  peptides?: { name: string; slug: string };
}

export interface SearchResults {
  peptides: Peptide[];
  threads: ThreadWithPeptide[];
}
