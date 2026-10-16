import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Compass, Loader2, Search } from "lucide-react";

import { getSuggestions } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UserListItem from "@/components/common/UserListItem";
import EmptyState from "@/components/common/EmptyState";
import { getErrorMessage } from "@/lib/format";

/**
 * GET /users/suggestions — follow suggestions with pagination.
 */
export default function Explore() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["suggestions"],
    queryFn: ({ pageParam = 1 }) => getSuggestions({ page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.meta?.pagination;
      if (!pagination) return undefined;
      return pagination.currentPage < pagination.numberOfPages
        ? pagination.currentPage + 1
        : undefined;
    },
  });

  const allSuggestions =
    data?.pages.flatMap((page) => page?.data?.suggestions || []) || [];
  const suggestions = query
    ? allSuggestions.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query)
      )
    : allSuggestions;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="size-5" />
          {query ? `Results for “${searchParams.get("q")}”` : "Explore people"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))
        ) : isError ? (
          <p className="text-destructive py-6 text-center text-sm">
            {getErrorMessage(error, "Failed to load suggestions")}
          </p>
        ) : suggestions.length ? (
          <>
            {suggestions.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                meta={`${user.followersCount ?? 0} followers`}
              />
            ))}
            {hasNextPage && !query ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : null}
                Load more
              </Button>
            ) : null}
          </>
        ) : (
          <EmptyState
            icon={query ? Search : Compass}
            title={query ? "No matches" : "No suggestions"}
            description={
              query
                ? "No people matched your search in the loaded results."
                : "You're already following everyone we could find."
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
