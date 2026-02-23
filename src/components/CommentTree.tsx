import type { Comment } from "@/lib/types";
import CommentItem from "./CommentItem";

function buildTree(flatComments: Comment[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  flatComments.forEach((c) => {
    map.set(c.id, { ...c, children: [] });
  });

  flatComments.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

interface CommentTreeProps {
  comments: Comment[];
  threadId: string;
  userVotes: Record<string, 1 | -1>;
  isLoggedIn: boolean;
}

export default function CommentTree({
  comments,
  threadId,
  userVotes,
  isLoggedIn,
}: CommentTreeProps) {
  const tree = buildTree(comments);

  if (tree.length === 0) {
    return (
      <p className="text-muted text-center py-6">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {tree.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          threadId={threadId}
          userVotes={userVotes}
          isLoggedIn={isLoggedIn}
          depth={0}
        />
      ))}
    </div>
  );
}
