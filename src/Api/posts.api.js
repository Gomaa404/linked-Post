import client from "./client";

/* ------------------------------------------------------------------ *
 * Posts endpoints
 * ------------------------------------------------------------------ */

// GET /posts — public post listing (newest first)
export async function getAllPosts(params) {
  const { data } = await client.get("/posts", { params });
  return data;
}

// GET /posts/feed — home timeline. Supports only=following|me|all, hasImage, page/limit, cursor/limit
export async function getFeed(params) {
  const { data } = await client.get("/posts/feed", { params });
  return data;
}

// POST /posts — create post with body/image (multipart)
export async function createPost(formData) {
  const { data } = await client.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// GET /posts/:postId — single post
export async function getSinglePost(postId) {
  const { data } = await client.get(`/posts/${postId}`);
  return data;
}

// PUT /posts/:postId — update body/image, or remove image (multipart)
export async function updatePost(postId, formData) {
  const { data } = await client.put(`/posts/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// DELETE /posts/:postId — delete a post
export async function deletePost(postId) {
  const { data } = await client.delete(`/posts/${postId}`);
  return data;
}

// GET /posts/:postId/likes — users who liked the post (paginated)
export async function getPostLikes(postId, params) {
  const { data } = await client.get(`/posts/${postId}/likes`, { params });
  return data;
}

// PUT /posts/:postId/like — toggle like
export async function toggleLikePost(postId) {
  const { data } = await client.put(`/posts/${postId}/like`);
  return data;
}

// PUT /posts/:postId/bookmark — toggle bookmark
export async function toggleBookmarkPost(postId) {
  const { data } = await client.put(`/posts/${postId}/bookmark`);
  return data;
}

// POST /posts/:postId/share — create a share post linked to the original
export async function sharePost(postId, body) {
  const { data } = await client.post(`/posts/${postId}/share`, { body });
  return data;
}
