import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CornerDownRight,
  Heart,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  createComment,
  createReply,
  deleteComment,
  getCommentReplies,
  getPostComments,
  toggleLikeComment,
  updateComment,
} from "@/Api";
import { tokenContext } from "@/context/tokenContext.jsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/common/UserAvatar";
import { getErrorMessage, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

function useCommentInvalidation(postId) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    queryClient.invalidateQueries({ queryKey: ["replies"] });
    queryClient.invalidateQueries({ queryKey: ["feed"] });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["post", postId] });
  };
}

/* ----------------------------- Reply list ----------------------------- */
function Replies({ postId, commentId, onCountChange }) {
  const [text, setText] = useState("");
  const invalidate = useCommentInvalidation(postId);

  const { data, isLoading } = useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getCommentReplies(postId, commentId, { page: 1, limit: 20 }),
  });
  const replies = data?.data?.replies || [];

  const { mutate: addReply, isPending } = useMutation({
    mutationFn: (payload) => createReply(postId, commentId, payload),
    onSuccess: () => {
      setText("");
      invalidate();
      onCountChange?.(1);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not reply")),
  });

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const formData = new FormData();
    formData.append("content", text.trim());
    addReply(formData);
  }

  return (
    <div className="mt-3 space-y-3 border-l-2 pl-4">
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        replies.map((reply) => (
          <div key={reply._id} className="flex items-start gap-2">
            <UserAvatar user={reply.commentCreator} className="size-7" />
            <div className="bg-muted min-w-0 flex-1 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium">{reply.commentCreator?.name}</span>
                <span className="text-muted-foreground">{timeAgo(reply.createdAt)}</span>
              </div>
              <p className="text-sm">{reply.content}</p>
            </div>
          </div>
        ))
      )}

      <form onSubmit={submit} className="flex items-center gap-2">
        <CornerDownRight className="text-muted-foreground size-4 shrink-0" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a reply..."
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 flex-1 rounded-full border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px]"
          disabled={isPending}
        />
        <Button type="submit" size="icon" variant="ghost" disabled={isPending || !text.trim()}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>
    </div>
  );
}

/* ---------------------------- Single comment --------------------------- */
function CommentItem({ postId, comment, canModerate }) {
  const { userData } = useContext(tokenContext);
  const invalidate = useCommentInvalidation(postId);

  const [showReplies, setShowReplies] = useState(false);
  const [replyCount, setReplyCount] = useState(comment.repliesCount || 0);
  const [likes, setLikes] = useState({
    liked: comment.likes?.includes(userData?._id) || false,
    count: comment.likes?.length || 0,
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content || "");

  const creatorId = comment.commentCreator?._id;
  const isOwner = creatorId === userData?._id;

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeComment(postId, comment._id),
    onSuccess: (res) =>
      setLikes({
        liked: res?.data?.liked ?? !likes.liked,
        count: res?.data?.likesCount ?? likes.count,
      }),
    onError: (error) => toast.error(getErrorMessage(error, "Could not like comment")),
  });

  const { mutate: saveEdit, isPending: isSaving } = useMutation({
    mutationFn: (formData) => updateComment(postId, comment._id, formData),
    onSuccess: () => {
      setEditing(false);
      invalidate();
      toast.success("Comment updated");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update comment")),
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteComment(postId, comment._id),
    onSuccess: () => {
      invalidate();
      toast.success("Comment deleted");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not delete comment")),
  });

  function submitEdit() {
    if (!draft.trim()) return;
    const formData = new FormData();
    formData.append("content", draft.trim());
    saveEdit(formData);
  }

  return (
    <div className="flex items-start gap-3">
      <Link to={`/profile/${creatorId}`}>
        <UserAvatar user={comment.commentCreator} className="size-9" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="bg-muted rounded-2xl px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Link
                to={`/profile/${creatorId}`}
                className="truncate text-sm font-semibold hover:underline"
              >
                {comment.commentCreator?.name}
              </Link>
              <span className="text-muted-foreground shrink-0 text-xs">
                {timeAgo(comment.createdAt)}
              </span>
            </div>

            {(isOwner || canModerate) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-6">
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwner ? (
                    <DropdownMenuItem onClick={() => setEditing(true)}>
                      <Pencil /> Edit
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => remove()}
                    disabled={isDeleting}
                  >
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {editing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                className="bg-background"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button size="sm" onClick={submitEdit} disabled={isSaving || !draft.trim()}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {comment.content ? <p className="text-sm">{comment.content}</p> : null}
              {comment.image ? (
                <img
                  src={comment.image}
                  alt="comment"
                  className="mt-2 max-h-60 rounded-lg object-cover"
                />
              ) : null}
            </>
          )}
        </div>

        <div className="text-muted-foreground mt-1 flex items-center gap-4 pl-2 text-xs">
          <button
            className={cn("inline-flex items-center gap-1 hover:text-rose-500", likes.liked && "text-rose-500")}
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
          >
            <Heart className={cn("size-3.5", likes.liked && "fill-current")} />
            {likes.count > 0 ? likes.count : "Like"}
          </button>
          <button className="hover:text-foreground" onClick={() => setShowReplies((v) => !v)}>
            Reply {replyCount > 0 ? `(${replyCount})` : ""}
          </button>
        </div>

        {showReplies ? (
          <Replies
            postId={postId}
            commentId={comment._id}
            onCountChange={(delta) => setReplyCount((c) => c + delta)}
          />
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------ Comments box ---------------------------- */
export default function PostComments({ postId, canModerate = false }) {
  const invalidate = useCommentInvalidation(postId);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [page, setPage] = useState(1);
  const fileRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["comments", postId, page],
    queryFn: () => getPostComments(postId, { page, limit: 10 }),
    enabled: !!postId,
  });

  const comments = data?.data?.comments || [];
  const pagination = data?.meta?.pagination;
  const hasMore = pagination ? page < pagination.numberOfPages : false;

  const { mutate: submit, isPending } = useMutation({
    mutationFn: (formData) => createComment(postId, formData),
    onSuccess: () => {
      setContent("");
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not add comment")),
  });

  function onSubmit(e) {
    e.preventDefault();
    if (!content.trim() && !image) return;
    const formData = new FormData();
    if (content.trim()) formData.append("content", content.trim());
    if (image) formData.append("image", image);
    submit(formData);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-2">
        <div className="flex items-end gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment... (use @ to mention)"
            rows={1}
            className="min-h-9 flex-1 resize-none rounded-2xl py-2"
            disabled={isPending}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileRef.current?.click()}
            aria-label="Attach image"
          >
            <ImagePlus className="size-4" />
          </Button>
          <Button type="submit" size="icon" disabled={isPending || (!content.trim() && !image)}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        {image ? (
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="truncate">{image.name}</span>
            <button type="button" onClick={() => setImage(null)}>
              <X className="size-3.5" />
            </button>
          </div>
        ) : null}
      </form>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : comments.length ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              postId={postId}
              comment={comment}
              canModerate={canModerate}
            />
          ))}
          {hasMore ? (
            <Button variant="outline" className="w-full" onClick={() => setPage((p) => p + 1)}>
              Load more comments
            </Button>
          ) : null}
        </div>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          No comments yet. Start the conversation.
        </p>
      )}
    </div>
  );
}
