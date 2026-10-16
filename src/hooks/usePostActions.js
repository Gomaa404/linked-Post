import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { toggleBookmarkPost, toggleLikePost } from "@/Api";
import { tokenContext } from "@/context/tokenContext.jsx";
import { getErrorMessage } from "@/lib/format";

/**
 * Like / bookmark interactions shared by every post surface.
 * Mirrors the API contract: PUT /posts/:id/like and PUT /posts/:id/bookmark.
 */
export function usePostActions() {
  const queryClient = useQueryClient();
  const { userData } = useContext(tokenContext);
  const [overrides, setOverrides] = useState({});

  const likeMutation = useMutation({
    mutationFn: (postId) => toggleLikePost(postId),
    onSuccess: (res, postId) => {
      setOverrides((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          liked: res?.data?.liked,
          likesCount: res?.data?.likesCount,
        },
      }));
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update like")),
  });

  const bookmarkMutation = useMutation({
    mutationFn: (postId) => toggleBookmarkPost(postId),
    onSuccess: (res, postId) => {
      setOverrides((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          bookmarked: res?.data?.bookmarked,
        },
      }));
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Could not update bookmark")),
  });

  const like = {
    isPending: likeMutation.isPending,
    isLiked: (post) =>
      overrides[post?._id]?.liked ??
      Boolean(post?.likes?.includes(userData?._id)),
    count: (post) =>
      overrides[post?._id]?.likesCount ??
      post?.likesCount ??
      post?.likes?.length ??
      0,
    toggle: (post) => likeMutation.mutate(post._id),
  };

  const bookmark = {
    isPending: bookmarkMutation.isPending,
    isBookmarked: (post) =>
      overrides[post?._id]?.bookmarked ?? Boolean(post?.bookmarked),
    toggle: (post) => bookmarkMutation.mutate(post._id),
  };

  return { like, bookmark };
}
