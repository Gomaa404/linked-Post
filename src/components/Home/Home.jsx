import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FileText, ImageOff, Loader2, Newspaper, Users } from "lucide-react";

import { getAllPosts, getFeed } from "@/Api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PostCard from "@/components/post/PostCard";
import CreatePost from "@/components/post/CreatePost";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import { getErrorMessage } from "@/lib/format";

function PostsFeed({ tab, hasImage = false }) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed", tab, { hasImage }],
    queryFn: ({ pageParam = 1 }) =>
      tab === "all"
        ? getAllPosts({ page: pageParam, limit: 10, hasImage: hasImage || undefined })
        : getFeed({ only: tab, page: pageParam, limit: 10, hasImage: hasImage || undefined }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.meta?.pagination;
      if (!pagination) return undefined;
      return pagination.currentPage < pagination.numberOfPages
        ? pagination.currentPage + 1
        : undefined;
    },
  });

  const posts = data?.pages.flatMap((page) => page?.data?.posts || []) || [];

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Card>
        <CardContent className="text-destructive py-10 text-center text-sm">
          {getErrorMessage(error, "Failed to load posts")}
        </CardContent>
      </Card>
    );
  }

  if (!posts.length) {
    return (
      <EmptyState
        icon={tab === "following" ? Users : tab === "me" ? FileText : Newspaper}
        title="Nothing here yet"
        description={
          tab === "following"
            ? "Follow people from Explore to see their posts here."
            : tab === "me"
            ? "Create your first post to get started."
            : "No posts to show right now."
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {hasNextPage ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : null}
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      ) : null}
      {!hasNextPage && posts.length > 0 ? (
        <p className="text-muted-foreground py-2 text-center text-xs">
          You've reached the end
        </p>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState("all");
  const [hasImage, setHasImage] = useState(false);

  return (
    <div className="space-y-4">
      <CreatePost />

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              <Newspaper className="size-4" /> All
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-1.5">
              <Users className="size-4" /> Following
            </TabsTrigger>
            <TabsTrigger value="me" className="gap-1.5">
              <FileText className="size-4" /> My posts
            </TabsTrigger>
          </TabsList>

          <Button
            variant={hasImage ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setHasImage((v) => !v)}
          >
            <ImageOff className="size-4" />
            {hasImage ? "With image" : "All posts"}
          </Button>
        </div>

        <TabsContent value="all" className="mt-4">
          <PostsFeed tab="all" hasImage={hasImage} />
        </TabsContent>
        <TabsContent value="following" className="mt-4">
          <PostsFeed tab="following" hasImage={hasImage} />
        </TabsContent>
        <TabsContent value="me" className="mt-4">
          <PostsFeed tab="me" hasImage={hasImage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
