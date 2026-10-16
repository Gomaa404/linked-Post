import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellRing,
  CheckCheck,
  Heart,
  Loader2,
  MessageCircle,
  Repeat2,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/Api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/common/UserAvatar";
import EmptyState from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import { getErrorMessage, timeAgo } from "@/lib/format";

const TYPE_META = {
  like_post: { icon: Heart, text: "liked your post", color: "text-rose-500" },
  comment_post: { icon: MessageCircle, text: "commented on your post", color: "text-sky-500" },
  reply_comment: { icon: MessageCircle, text: "replied to your comment", color: "text-sky-500" },
  like_comment: { icon: Heart, text: "liked your comment", color: "text-rose-500" },
  share_post: { icon: Repeat2, text: "shared your post", color: "text-emerald-500" },
  follow_user: { icon: UserPlus, text: "started following you", color: "text-primary" },
  follow: { icon: UserPlus, text: "started following you", color: "text-primary" },
};

function targetLink(notification) {
  if (notification.entityType === "post" || notification.entityId) {
    return `/postDetails/${notification.entityId || notification.entity?._id}`;
  }
  return `/profile/${notification.actor?._id}`;
}

/**
 * Notifications endpoints: list, unread count, mark one / all as read.
 */
export default function Notifications() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getNotifications({ page, limit: 15 }),
  });

  const notifications = data?.data?.notifications || [];
  const pagination = data?.meta?.pagination;
  const hasNext = pagination ? page < pagination.numberOfPages : false;

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Could not update")),
  });

  const markOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" /> Notifications
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending || !notifications.length}
          >
            {markAll.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCheck className="size-4" />
            )}
            Mark all read
          </Button>
        </CardHeader>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="text-destructive py-10 text-center text-sm">
            {getErrorMessage(error, "Failed to load notifications")}
          </CardContent>
        </Card>
      ) : notifications.length ? (
        <Card className="py-0">
          <div className="divide-y">
            {notifications.map((n) => {
              const meta = TYPE_META[n.type] || {
                icon: BellRing,
                text: "interacted with you",
                color: "text-muted-foreground",
              };
              const Icon = meta.icon;
              return (
                <Link
                  key={n._id}
                  to={targetLink(n)}
                  onClick={() => !n.isRead && markOne.mutate(n._id)}
                  className={cn(
                    "hover:bg-accent/50 flex items-start gap-3 px-4 py-3 transition-colors",
                    !n.isRead && "bg-primary/5"
                  )}
                >
                  <div className="relative">
                    <UserAvatar user={n.actor} className="size-11" />
                    <span
                      className={cn(
                        "bg-background absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border",
                        meta.color
                      )}
                    >
                      <Icon className="size-3" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{n.actor?.name}</span>{" "}
                      <span className="text-muted-foreground">{meta.text}</span>
                    </p>
                    {n.entity?.body ? (
                      <p className="text-muted-foreground mt-0.5 truncate text-xs">
                        “{n.entity.body}”
                      </p>
                    ) : null}
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead ? (
                    <Badge className="mt-1 size-2 shrink-0 rounded-full p-0" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="When people like, comment or follow you, you'll see it here."
        />
      )}

      {hasNext ? (
        <Button variant="outline" className="w-full" onClick={() => setPage((p) => p + 1)}>
          Load more
        </Button>
      ) : null}
    </div>
  );
}
