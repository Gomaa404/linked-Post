import client from "./client";

/* ------------------------------------------------------------------ *
 * Comments & Replies endpoints
 * ------------------------------------------------------------------ */

// GET /posts/:postId/comments — paginated post comments
export async function getPostComments(postId, params) {
  const { data } = await client.get(`/posts/${postId}/comments`, { params });
  return data;
}

// POST /posts/:postId/comments — create comment (content/image, multipart)
export async function createComment(postId, formData) {
  const { data } = await client.post(`/posts/${postId}/comments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// GET /posts/:postId/comments/:commentId/replies — paginated replies
export async function getCommentReplies(postId, commentId, params) {
  const { data } = await client.get(
    `/posts/${postId}/comments/${commentId}/replies`,
    { params }
  );
  return data;
}

// POST /posts/:postId/comments/:commentId/replies — create reply (multipart)
export async function createReply(postId, commentId, formData) {
  const { data } = await client.post(
    `/posts/${postId}/comments/${commentId}/replies`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

// PUT /posts/:postId/comments/:commentId — edit comment by owner (multipart)
export async function updateComment(postId, commentId, formData) {
  const { data } = await client.put(
    `/posts/${postId}/comments/${commentId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

// DELETE /posts/:postId/comments/:commentId — delete by comment/post owner
export async function deleteComment(postId, commentId) {
  const { data } = await client.delete(
    `/posts/${postId}/comments/${commentId}`
  );
  return data;
}

// PUT /posts/:postId/comments/:commentId/like — toggle comment like
export async function toggleLikeComment(postId, commentId) {
  const { data } = await client.put(
    `/posts/${postId}/comments/${commentId}/like`
  );
  return data;
}
