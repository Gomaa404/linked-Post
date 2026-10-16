import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Loader2 } from "lucide-react";

import { getBookmarks } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PostCard from "@/components/post/PostCard";
import PageLoader from "@/components/common/PageLoader";
import EmptyState from "@/components/common/EmptyState";
import { getErrorMessage } from "@/lib/format";

/**
 * GET /users/bookmarks — the authenticated user's bookmarked posts.
 */
export default function Bookmarks() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["bookmarks", page],
    queryFn: () => getBookmarks({ page, limit: 10 }),
  });

  const bookmarks = data?.data?.bookmarks || [];
  const pagination = data?.meta?.pagination;
  const hasNext = pagination ? page < pagination.numberOfPages : false;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="size-5" /> Your bookmarks
          </CardTitle>
        </CardHeader>
      </Card>

      {isLoading ? (
        <PageLoader />
      ) : isError ? (
        <Card>
          <CardContent className="text-destructive py-10 text-center text-sm">
            {getErrorMessage(error, "Failed to load bookmarks")}
          </CardContent>
        </Card>
      ) : bookmarks.length ? (
        <>
          {bookmarks.map((item) => {
            const post = item.post || item;
            return <PostCard key={post._id} post={post} />;
          })}
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!hasNext || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              {isFetching ? <Loader2 className="size-4 animate-spin" /> : null}
              Next
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Tap Save on any post to keep it here for later."
        />
      )}
    </div>
  );
}
