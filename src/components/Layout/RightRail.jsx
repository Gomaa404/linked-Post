import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

import { getSuggestions } from "@/Api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UserListItem from "@/components/common/UserListItem";

export default function RightRail() {
  const { data, isLoading } = useQuery({
    queryKey: ["suggestions", "rail"],
    queryFn: () => getSuggestions({ page: 1, limit: 5 }),
  });

  const suggestions = data?.data?.suggestions || [];

  return (
    <div className="space-y-3">
      <Card className="py-4">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="text-primary size-4" /> People you may know
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-11 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            : suggestions.map((user) => (
                <UserListItem key={user._id} user={user} />
              ))}

          <Link
            to="/explore"
            className="text-primary block pt-1 text-xs font-medium hover:underline"
          >
            See all suggestions
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
