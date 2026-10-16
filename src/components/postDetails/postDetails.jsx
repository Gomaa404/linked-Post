import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { getSinglePost } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PostCard from "@/components/post/PostCard";
import PageLoader from "@/components/common/PageLoader";
import EmptyState from "@/components/common/EmptyState";
import { getErrorMessage } from "@/lib/format";

export default function PostDetails() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getSinglePost(id),
    enabled: !!id,
  });

  const post = data?.data?.post;

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="gap-2">
        <Link to="/">
          <ArrowLeft className="size-4" /> Back to feed
        </Link>
      </Button>

      {isLoading ? (
        <PageLoader count={1} />
      ) : isError || !post ? (
        <Card>
          <CardContent className="py-6">
            <EmptyState
              title="Post not found"
              description={getErrorMessage(error, "This post may have been removed.")}
            />
          </CardContent>
        </Card>
      ) : (
        <PostCard post={post} initialCommentsOpen />
      )}
    </div>
  );
}
