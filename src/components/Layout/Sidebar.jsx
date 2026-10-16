import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Bookmark,
  Compass,
  Home,
  Settings,
  User as UserIcon,
} from "lucide-react";

import { getUnreadCount } from "@/Api";
import { tokenContext } from "@/context/tokenContext.jsx";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/common/UserAvatar";
import AccountSettingsDialog from "@/components/Profile/AccountSettingsDialog";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { userData } = useContext(tokenContext);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: unreadData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    enabled: !!userData,
    refetchInterval: 60000,
  });
  const unread = unreadData?.data?.unreadCount || 0;

  const profileId = userData?._id;

  const items = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/explore", label: "Explore people", icon: Compass },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { to: "/notifications", label: "Notifications", icon: Bell, badge: unread },
    ...(profileId
      ? [{ to: `/profile/${profileId}`, label: "My profile", icon: UserIcon }]
      : []),
  ];

  return (
    <div className="space-y-3">
      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="from-primary/30 via-primary/20 h-16 bg-gradient-to-r to-transparent" />
        <div className="-mt-8 px-4 pb-4">
          <Link to={profileId ? `/profile/${profileId}` : "/"}>
            <UserAvatar
              user={userData}
              className="size-16 border-4 border-card"
              fallbackClassName="text-lg"
            />
          </Link>
          <Link
            to={profileId ? `/profile/${profileId}` : "/"}
            className="mt-3 block truncate font-semibold hover:underline"
          >
            {userData?.name || "nouxer member"}
          </Link>
          <p className="text-muted-foreground truncate text-xs">
            {userData?.username ? `@${userData.username}` : userData?.email}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="bg-muted/60 rounded-lg py-2">
              <p className="text-sm font-semibold">{userData?.followersCount ?? 0}</p>
              <p className="text-muted-foreground text-[11px]">Followers</p>
            </div>
            <div className="bg-muted/60 rounded-lg py-2">
              <p className="text-sm font-semibold">{userData?.followingCount ?? 0}</p>
              <p className="text-muted-foreground text-[11px]">Following</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-card rounded-xl border p-2 shadow-sm">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end}>
            {({ isActive }) => (
              <span
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge > 0 ? (
                  <Badge className="h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                    {badge > 99 ? "99+" : badge}
                  </Badge>
                ) : null}
              </span>
            )}
          </NavLink>
        ))}

        <Separator className="my-2" />

        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          <Settings className="size-4 shrink-0" />
          Account settings
        </button>
      </nav>

      <p className="text-muted-foreground px-2 text-[11px] leading-relaxed">
        © nouxer
      </p>

      <AccountSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
