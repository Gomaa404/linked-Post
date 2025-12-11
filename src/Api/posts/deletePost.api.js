import axios from "axios";

export async function deletePost(postId) {
  const token = localStorage.getItem("token");
  const { data } = await axios.delete(
    `https://linked-posts.routemisr.com/posts/${postId}`,
    {
      headers: {
        token,
      },
    }
  );

  return data;
}
