import axios from "axios";

export async function getUserPost(userId) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `https://linked-posts.routemisr.com/users/${userId}/posts?limit=10`,
    {
      headers: {
        token,
      },
    }
  );

  return data;
}
