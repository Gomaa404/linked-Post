import axios from "axios";

export async function updatePost(postId, payload) {
  const token = localStorage.getItem("token");

  const { data } = await axios.put(
    `https://linked-posts.routemisr.com/posts/${postId}`,
    payload,
    {
      headers: {
        token,
      },
    }
  );

  return data;
}
