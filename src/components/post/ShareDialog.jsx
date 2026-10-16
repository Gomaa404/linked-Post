import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import { sharePost } from "@/Api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/common/UserAvatar";
import { getErrorMessage } from "@/lib/format";

/**
 * POST /posts/:postId/share — create a share post linked to the original.
 */
export default function ShareDialog({ post, open, onOpenChange }) {
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => sharePost(post._id, body.trim()),
    onSuccess: () => {
      toast.success("Post shared to your feed");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onOpenChange(false);
      setBody("");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not share post")),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) setBody("");
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-4" /> Share post
          </DialogTitle>
          <DialogDescription>
            Add an optional message. It will be posted to your timeline.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg border p-3">
          <UserAvatar user={post?.user} className="size-9" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{post?.user?.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {post?.body || "Image post"}
            </p>
          </div>
        </div>

        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Say something about this post (optional)"
        />

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={() => mutate()} disabled={isPending}>
            <Send className="size-4" /> {isPending ? "Sharing..." : "Share now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
