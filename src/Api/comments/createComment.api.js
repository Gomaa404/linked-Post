import axios from "axios";

export async function createComment({ postId, content }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `https://linked-posts.routemisr.com/comments`,
    { post: postId, content },
    {
      headers: {
        token,
      },
    }
  );

  return data;
}
