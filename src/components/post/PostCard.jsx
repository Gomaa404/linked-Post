import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Globe,
  Heart,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { deletePost, updatePost } from "@/Api";
import { tokenContext } from "@/context/tokenContext.jsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/common/UserAvatar";
import PostComments from "@/components/post/PostComments";
import PostLikesDialog from "@/components/post/PostLikesDialog";
import ShareDialog from "@/components/post/ShareDialog";
import { getErrorMessage, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { usePostActions } from "@/hooks/usePostActions";

function SharedPostPreview({ post }) {
  if (!post) return null;
  return (
    <Link
      to={`/postDetails/${post._id}`}
      className="hover:bg-accent/50 mt-3 block rounded-xl border p-3 transition-colors"
    >
      <div className="flex items-center gap-2">
        <UserAvatar user={post.user} className="size-8" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{post.user?.name}</p>
          <p className="text-muted-foreground text-xs">{timeAgo(post.createdAt)}</p>
        </div>
      </div>
      {post.body ? <p className="mt-2 text-sm">{post.body}</p> : null}
      {post.image ? (
        <img
          src={post.image}
          alt="shared"
          className="mt-2 max-h-72 w-full rounded-lg object-cover"
        />
      ) : null}
    </Link>
  );
}

export default function PostCard({ post, initialCommentsOpen = false }) {
  const { userData } = useContext(tokenContext);
  const queryClient = useQueryClient();
  const { like, bookmark } = usePostActions();

  const [showComments, setShowComments] = useState(initialCommentsOpen);
  const [likesOpen, setLikesOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(post?.body || "");
  const [draftImageFile, setDraftImageFile] = useState(null);
  const [draftImagePreview, setDraftImagePreview] = useState(post?.image || "");
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef(null);

  const isOwner = !!userData?._id && userData?._id === post?.user?._id;
  const liked = like.isLiked(post);
  const likesCount = like.count(post);
  const bookmarked = bookmark.isBookmarked(post);

  function startEditing() {
    setDraftBody(post?.body || "");
    setDraftImageFile(null);
    setDraftImagePreview(post?.image || "");
    setRemoveImage(false);
    setIsEditing(true);
  }

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePost(post._id),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to delete post")),
  });

  const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (formData) => updatePost(post._id, formData),
    onSuccess: () => {
      toast.success("Post updated");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to update post")),
  });

  function saveChanges() {
    const formData = new FormData();
    formData.append("body", draftBody.trim());
    if (draftImageFile && !removeImage) formData.append("image", draftImageFile);
    if (removeImage) formData.append("removeImage", "true");
    handleUpdate(formData);
  }

  function onPickImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setDraftImageFile(file);
    setDraftImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  const privacy = post?.privacy === "private" ? (
    <Users className="size-3" />
  ) : (
    <Globe className="size-3" />
  );

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="flex-row items-center gap-3 space-y-0 px-4 pt-4">
        <Link to={`/profile/${post?.user?._id}`}>
          <UserAvatar user={post?.user} className="size-11" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/profile/${post?.user?._id}`}
            className="block truncate font-semibold hover:underline"
          >
            {post?.user?.name}
          </Link>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="truncate">
              {post?.user?.username ? `@${post.user.username}` : ""}
            </span>
            <span>·</span>
            <span>{timeAgo(post?.createdAt)}</span>
            <span className="flex items-center gap-1 capitalize">
              · {privacy} {post?.privacy || "public"}
            </span>
          </div>
        </div>

        {post?.isShare ? <Badge variant="secondary">Shared</Badge> : null}

        {isOwner ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Post actions">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={startEditing}>
                <Pencil /> Edit post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete()}
                disabled={isDeleting}
              >
                <Trash2 /> Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </CardHeader>

      <CardContent className="px-4 pt-3">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={3}
              placeholder="Edit your post..."
            />
            {(draftImagePreview || post?.image) && !removeImage ? (
              <div className="relative">
                <img
                  src={draftImagePreview}
                  alt="preview"
                  className="max-h-72 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 size-7"
                  onClick={() => {
                    setRemoveImage(true);
                    setDraftImageFile(null);
                    setDraftImagePreview("");
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
              >
                <ImagePlus className="size-4" /> Change image
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickImage}
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={saveChanges}
                  disabled={isUpdating || (!draftBody.trim() && !draftImageFile && !post?.image)}
                >
                  {isUpdating ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {post?.body ? (
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {post.body}
              </p>
            ) : null}
            {post?.image ? (
              <img
                src={post.image}
                alt="post"
                className="mt-3 max-h-[32rem] w-full rounded-xl object-cover"
              />
            ) : null}
            {post?.sharedPost ? <SharedPostPreview post={post.sharedPost} /> : null}
          </>
        )}
      </CardContent>

      <CardFooter className="mt-3 flex-col items-stretch gap-0 border-t px-2 py-1">
        <div className="text-muted-foreground flex items-center justify-between px-2 py-1.5 text-xs">
          <button className="hover:underline" onClick={() => setLikesOpen(true)}>
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </button>
          <div className="flex gap-3">
            <button className="hover:underline" onClick={() => setShowComments((v) => !v)}>
              {post?.commentsCount ?? 0} comments
            </button>
            <span>{post?.sharesCount ?? 0} shares</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 py-1">
          <Button
            variant="ghost"
            className={cn("gap-2", liked && "text-rose-500 hover:text-rose-500")}
            onClick={() => like.toggle(post)}
            disabled={like.isPending}
          >
            <Heart className={cn("size-4", liked && "fill-current")} />
            Like
          </Button>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageCircle className="size-4" />
            Comment
          </Button>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="size-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            className={cn("gap-2", bookmarked && "text-primary")}
            onClick={() => bookmark.toggle(post)}
            disabled={bookmark.isPending}
          >
            <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
            Save
          </Button>
        </div>
      </CardFooter>

      {showComments ? (
        <div className="border-t px-4 py-3">
          <PostComments postId={post._id} canModerate={isOwner} />
        </div>
      ) : null}

      <PostLikesDialog
        postId={post._id}
        open={likesOpen}
        onOpenChange={setLikesOpen}
      />
      <ShareDialog
        post={post}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </Card>
  );
}
