import { useContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, ImagePlus, Loader2, Send, Type, X } from "lucide-react";
import toast from "react-hot-toast";

import { createPost } from "@/Api";
import { tokenContext } from "@/context/tokenContext.jsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserAvatar from "@/components/common/UserAvatar";
import { getErrorMessage } from "@/lib/format";

/**
 * POST /posts — create a post with body and/or image (multipart).
 * Launcher card + composer dialog.
 */
export default function CreatePost() {
  const { userData } = useContext(tokenContext);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => createPost(formData),
    onSuccess: () => {
      toast.success("Post created");
      closeAndReset();
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not create post")),
  });

  function closeAndReset() {
    setOpen(false);
    setBody("");
    setImage(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function onPickImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function onSubmit() {
    if (!body.trim() && !image) {
      toast.error("Add text or an image first");
      return;
    }
    const formData = new FormData();
    if (body.trim()) formData.append("body", body.trim());
    if (image) formData.append("image", image);
    mutate(formData);
  }

  const canPost = body.trim() || image;

  return (
    <Card className="py-0">
      <CardContent className="flex items-center gap-3 px-4 py-4">
        <UserAvatar user={userData} className="size-10" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-muted/50 text-muted-foreground hover:bg-muted flex-1 rounded-full border px-4 py-2.5 text-left text-sm transition-colors"
        >
          Start a post, {userData?.name?.split(" ")[0] || "friend"}…
        </button>
      </CardContent>

      <div className="flex items-center gap-1 border-t px-2 py-1.5">
        <Button
          type="button"
          variant="ghost"
          className="text-primary hover:text-primary flex-1 gap-2"
          onClick={() => setOpen(true)}
        >
          <Type className="size-4" /> Text
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="flex-1 gap-2 text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
          onClick={() => {
            setOpen(true);
            setTimeout(() => fileRef.current?.click(), 150);
          }}
        >
          <ImagePlus className="size-4" /> Photo
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) closeAndReset();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-3">
            <UserAvatar user={userData} className="size-11" />
            <div>
              <p className="text-sm font-semibold">{userData?.name}</p>
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Globe className="size-3" /> Everyone
              </span>
            </div>
          </div>

          <Textarea
            autoFocus
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="What do you want to talk about?"
            className="resize-none border-none px-0 text-base shadow-none focus-visible:ring-0"
            disabled={isPending}
          />

          {preview ? (
            <div className="relative">
              <img src={preview} alt="preview" className="max-h-72 w-full rounded-lg object-cover" />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 size-7"
                onClick={() => {
                  setImage(null);
                  setPreview("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
                disabled={isPending}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : null}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickImage}
          />

          <DialogFooter className="items-center justify-between sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
              onClick={() => fileRef.current?.click()}
              disabled={isPending}
            >
              <ImagePlus className="size-4" /> Photo
            </Button>
            <Button size="sm" className="gap-2" onClick={onSubmit} disabled={isPending || !canPost}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {isPending ? "Posting..." : "Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
