import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Robust avatar: falls back to initials when the photo is missing or fails.
 * `user` may be a user object, or pass `name`/`photo` directly.
 */
export default function UserAvatar({ user, name, photo, className, fallbackClassName }) {
  const displayName = name || user?.name || user?.username || "";
  const src = photo ?? user?.photo;

  return (
    <Avatar className={cn("size-10", className)}>
      {src ? <AvatarImage src={src} alt={displayName} /> : null}
      <AvatarFallback className={cn("bg-primary/10 text-primary font-semibold", fallbackClassName)}>
        {getInitials(displayName) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
