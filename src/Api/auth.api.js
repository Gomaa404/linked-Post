import client from "./client";

/* ------------------------------------------------------------------ *
 * Users & Auth endpoints
 * ------------------------------------------------------------------ */

// POST /users/signup — create account and return token + basic user data
export async function signup(payload) {
  const { data } = await client.post("/users/signup", payload);
  return data;
}

// POST /users/signin — login with email, username or login (+ password)
export async function signin(payload) {
  const { data } = await client.post("/users/signin", payload);
  return data;
}

// PATCH /users/change-password — rotate password and return refreshed token
export async function changePassword(payload) {
  const { data } = await client.patch("/users/change-password", payload);
  return data;
}

// PUT /users/upload-photo — multipart upload of the profile photo
export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await client.put("/users/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// GET /users/profile-data — current authenticated profile
export async function getLoggedUser() {
  const { data } = await client.get("/users/profile-data");
  return data;
}
