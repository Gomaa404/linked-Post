import { Link } from "react-router-dom";

import UserAvatar from "@/components/common/UserAvatar";
import FollowButton from "@/components/common/FollowButton";
import { cn } from "@/lib/utils";

/**
 * Compact user row used by suggestions, likes, followers, notifications.
 */
export default function UserListItem({ user, meta, showFollow = true, className }) {
  if (!user) return null;
  const id = user._id || user.id;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Link to={`/profile/${id}`} className="shrink-0">
        <UserAvatar user={user} className="size-11" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to={`/profile/${id}`}
          className="block truncate font-medium hover:underline"
        >
          {user.name}
        </Link>
        <p className="text-muted-foreground truncate text-xs">
          {user.username ? `@${user.username}` : meta}
        </p>
        {user.username && meta ? (
          <p className="text-muted-foreground truncate text-xs">{meta}</p>
        ) : null}
      </div>
      {showFollow ? (
        <FollowButton userId={id} isFollowing={user.isFollowing} />
      ) : null}
    </div>
  );
}
