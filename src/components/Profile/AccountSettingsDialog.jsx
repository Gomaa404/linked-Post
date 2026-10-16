import { useContext, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera, KeyRound, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { changePassword, uploadProfilePhoto } from "@/Api";
import { tokenContext } from "@/context/tokenContext.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/common/UserAvatar";
import { getErrorMessage } from "@/lib/format";

/**
 * Account settings:
 *  - PUT   /users/upload-photo
 *  - PATCH /users/change-password
 */
export default function AccountSettingsDialog({ open, onOpenChange }) {
  const { userData, refreshUser, setToken } = useContext(tokenContext);
  const fileRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [form, setForm] = useState({ password: "", newPassword: "" });

  const upload = useMutation({
    mutationFn: (file) => uploadProfilePhoto(file),
    onSuccess: async () => {
      toast.success("Profile photo updated");
      await refreshUser();
      setPhotoPreview("");
      if (fileRef.current) fileRef.current.value = "";
    },
    onError: (error) => toast.error(getErrorMessage(error, "Upload failed")),
  });

  const password = useMutation({
    mutationFn: () => changePassword(form),
    onSuccess: (res) => {
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
      }
      toast.success("Password changed");
      setForm({ password: "", newPassword: "" });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not change password")),
  });

  function onPickPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    upload.mutate(file);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account settings</DialogTitle>
          <DialogDescription>
            Manage your profile photo and password.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4">
          <UserAvatar
            user={{ ...userData, photo: photoPreview || userData?.photo }}
            className="size-16"
          />
          <div className="space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileRef.current?.click()}
              disabled={upload.isPending}
            >
              {upload.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
              Change photo
            </Button>
            <p className="text-muted-foreground text-xs">PNG or JPG, up to a few MB.</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickPhoto}
          />
        </div>

        <Separator />

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            password.mutate();
          }}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <KeyRound className="size-4" /> Change password
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={password.isPending || !form.password || !form.newPassword}
            >
              {password.isPending ? "Updating..." : "Update password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
