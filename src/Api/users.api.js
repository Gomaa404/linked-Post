import client from "./client";

/* ------------------------------------------------------------------ *
 * Users endpoints
 * ------------------------------------------------------------------ */

// GET /users/:userId/profile — public profile + isFollowing flag
export async function getUserProfile(userId) {
  const { data } = await client.get(`/users/${userId}/profile`);
  return data;
}

// PUT /users/:userId/follow — toggle follow / unfollow
export async function toggleFollow(userId) {
  const { data } = await client.put(`/users/${userId}/follow`);
  return data;
}

// GET /users/:userId/posts — posts belonging to a user (paginated)
export async function getUserPosts(userId, params) {
  const { data } = await client.get(`/users/${userId}/posts`, { params });
  return data;
}

// GET /users/suggestions — follow suggestions with pagination
export async function getSuggestions(params) {
  const { data } = await client.get("/users/suggestions", { params });
  return data;
}

// GET /users/bookmarks — the authenticated user's bookmarked posts
export async function getBookmarks(params) {
  const { data } = await client.get("/users/bookmarks", { params });
  return data;
}
