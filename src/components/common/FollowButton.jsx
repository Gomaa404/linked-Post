import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserMinus, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

import { toggleFollow } from "@/Api";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * PUT /users/:userId/follow — toggle follow / unfollow.
 */
export default function FollowButton({ userId, isFollowing = false, className }) {
  const queryClient = useQueryClient();
  const [following, setFollowing] = useState(isFollowing);

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleFollow(userId),
    onSuccess: (res) => {
      const next = res?.data?.following ?? !following;
      setFollowing(next);
      toast.success(next ? "Following" : "Unfollowed");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update follow")),
  });

  return (
    <Button
      size="sm"
      variant={following ? "outline" : "default"}
      className={cn("gap-1.5", className)}
      disabled={isPending}
      onClick={() => mutate()}
    >
      {following ? <UserMinus className="size-4" /> : <UserPlus className="size-4" />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
