import axios from "axios";

export async function getUserProfile(userId) {
  const token = localStorage.getItem("token");
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data } = await axios.get(
    `https://linked-posts.routemisr.com/users/${userId}`,
    {
      headers: {
        token,
      },
    }
  );
  return data;
}
