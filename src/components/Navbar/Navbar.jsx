import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Bookmark,
  Compass,
  Home as HomeIcon,
  KeyRound,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User as UserIcon,
} from "lucide-react";

import { tokenContext } from "@/context/tokenContext.jsx";
import { darkModeContext } from "@/context/darkModeContext.jsx";
import { getUnreadCount } from "@/Api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import UserAvatar from "@/components/common/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

export default function Navbar() {
  const { token, setToken, userData, setUserData } = useContext(tokenContext);
  const { darkMode, toggleDarkMode } = useContext(darkModeContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: unreadData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    enabled: !!token,
    refetchInterval: 60000,
  });
  const unread = unreadData?.data?.unreadCount || 0;

  function logOut() {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
    navigate("/login");
  }

  function onSearch(event) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/explore?q=${encodeURIComponent(query)}` : "/explore");
  }

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg text-lg font-black">
            n
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-bold lowercase">nouxer</span>
          </span>
        </Link>

        <form onSubmit={onSearch} className="relative hidden max-w-xs flex-1 md:block">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people"
            aria-label="Search people"
            className="border-input bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-full border pl-9 pr-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </form>

        <nav className="ml-auto flex items-center gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("gap-2", isActive && "bg-accent text-accent-foreground")}
                >
                  <Icon className="size-4" />
                  <span className="hidden lg:inline">{label}</span>
                </Button>
              )}
            </NavLink>
          ))}

          <NavLink to="/notifications">
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="icon"
                className={cn("relative", isActive && "bg-accent")}
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unread > 0 ? (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                    {unread > 99 ? "99+" : unread}
                  </Badge>
                ) : null}
              </Button>
            )}
          </NavLink>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="size-4 text-amber-500" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full ring-offset-background focus-visible:ring-ring ml-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label="Account menu"
                >
                  <UserAvatar user={userData} className="size-9" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="truncate">{userData?.name || "Account"}</span>
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {userData?.username ? `@${userData.username}` : userData?.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/profile/${userData?._id}`)}>
                  <UserIcon /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/explore")}>
                  <Compass /> Explore people
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/profile/${userData?._id}?settings=1`)}
                >
                  <Settings /> Account settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                  <span className="flex items-center gap-2">
                    <KeyRound className="size-4" /> Dark mode
                  </span>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logOut}>
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
