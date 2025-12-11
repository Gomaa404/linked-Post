import axios from "axios";
const token = localStorage.getItem("token");
export async function getAllPosts() {
  const { data } = await axios.get(
    "https://linked-posts.routemisr.com/posts?limit=53",
    {
      headers: {
        token: token,
      },
    }
  );
  return data;
}
