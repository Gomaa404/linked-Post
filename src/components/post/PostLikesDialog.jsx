import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";

import { getPostLikes } from "@/Api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserListItem from "@/components/common/UserListItem";
import EmptyState from "@/components/common/EmptyState";

/**
 * GET /posts/:postId/likes — paginated list of users who liked a post.
 */
export default function PostLikesDialog({ postId, open, onOpenChange }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["postLikes", postId, page],
    queryFn: () => getPostLikes(postId, { page, limit: 20 }),
    enabled: open && !!postId,
  });

  const likes = data?.data?.likes || [];
  const pagination = data?.meta?.pagination;
  const hasNext = pagination ? page < pagination.numberOfPages : false;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setPage(1);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="size-4 fill-current text-rose-500" /> Likes
          </DialogTitle>
          <DialogDescription>
            People who liked this post.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-11 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : likes.length ? (
            likes.map((user) => (
              <UserListItem key={user._id} user={user} showFollow={false} />
            ))
          ) : (
            <EmptyState
              icon={Heart}
              title="No likes yet"
              description="Be the first to like this post."
            />
          )}

          {hasNext ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setPage((p) => p + 1)}
            >
              Load more
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
