import { useContext, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Loader2,
  Mail,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import { getUserPosts, getUserProfile } from "@/Api";
import { tokenContext } from "@/context/tokenContext.jsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/common/UserAvatar";
import UserListItem from "@/components/common/UserListItem";
import FollowButton from "@/components/common/FollowButton";
import PostCard from "@/components/post/PostCard";
import CreatePost from "@/components/post/CreatePost";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import AccountSettingsDialog from "@/components/Profile/AccountSettingsDialog";
import { formatDate, getErrorMessage } from "@/lib/format";

/* ------------------------- Posts tab (paginated) ------------------------ */
function UserPosts({ userId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userPosts", userId, page],
    queryFn: () => getUserPosts(userId, { page, limit: 10 }),
    enabled: !!userId,
  });

  const posts = data?.data?.posts || [];
  const pagination = data?.meta?.pagination;
  const hasNext = pagination ? page < pagination.numberOfPages : false;

  if (isLoading) return <PageLoader count={2} />;

  if (isError) {
    return (
      <p className="text-destructive py-8 text-center text-sm">
        {getErrorMessage(error, "Failed to load posts")}
      </p>
    );
  }

  if (!posts.length) {
    return (
      <EmptyState
        icon={UserRound}
        title="No posts yet"
        description="Posts shared by this account will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {hasNext ? (
        <Button variant="outline" className="w-full" onClick={() => setPage((p) => p + 1)}>
          Load more
        </Button>
      ) : null}
    </div>
  );
}

/* ------------------------------ People lists ---------------------------- */
function PeopleList({ users, emptyLabel }) {
  if (!users?.length) {
    return (
      <EmptyState icon={Users} title={emptyLabel} description="Nothing to show here yet." />
    );
  }
  return (
    <div className="space-y-4 py-2">
      {users.map((user) => (
        <UserListItem key={user._id} user={user} />
      ))}
    </div>
  );
}

/* --------------------------------- Page -------------------------------- */
export default function Profile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { userData } = useContext(tokenContext);
  const profileId = id || userData?._id;
  const isOwnProfile = profileId === userData?._id;
  const [settingsOpen, setSettingsOpen] = useState(
    searchParams.get("settings") === "1"
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => getUserProfile(profileId),
    enabled: !!profileId,
  });

  const user = data?.data?.user;
  const isFollowing = data?.data?.isFollowing;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Skeleton className="size-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (isError || !user) {
    return (
      <Card>
        <CardContent className="text-destructive py-12 text-center text-sm">
          {getErrorMessage(error, "Unable to load this profile")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden py-0">
        <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="-mt-12 space-y-4 pb-4">
          <div className="flex items-end justify-between gap-3">
            <UserAvatar
              user={user}
              className="size-24 border-4 border-card shadow-sm"
              fallbackClassName="text-2xl"
            />
            {isOwnProfile ? (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="size-4" /> Edit account
              </Button>
            ) : (
              <FollowButton userId={user._id} isFollowing={isFollowing} />
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.username ? (
              <p className="text-muted-foreground text-sm">@{user.username}</p>
            ) : null}
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {user.email ? (
              <span className="flex items-center gap-1.5">
                <Mail className="size-4" /> {user.email}
              </span>
            ) : null}
            {user.createdAt ? (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" /> Joined {formatDate(user.createdAt)}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{user.followersCount ?? 0} followers</Badge>
            <Badge variant="secondary">{user.followingCount ?? 0} following</Badge>
            <Badge variant="secondary">{user.bookmarksCount ?? 0} bookmarks</Badge>
            {user.gender ? (
              <Badge variant="outline" className="capitalize">
                {user.gender}
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {isOwnProfile ? <CreatePost /> : null}

      <Tabs defaultValue="posts">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="posts" className="gap-1.5">
            Posts
          </TabsTrigger>
          <TabsTrigger value="followers" className="gap-1.5">
            Followers
          </TabsTrigger>
          <TabsTrigger value="following" className="gap-1.5">
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4">
          <UserPosts userId={profileId} />
        </TabsContent>
        <TabsContent value="followers" className="mt-4">
          <Card>
            <CardContent className="py-2">
              <PeopleList users={user.followers} emptyLabel="No followers yet" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="following" className="mt-4">
          <Card>
            <CardContent className="py-2">
              <PeopleList users={user.following} emptyLabel="Not following anyone yet" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isOwnProfile ? (
        <AccountSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      ) : null}
    </div>
  );
}
