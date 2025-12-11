import axios from "axios";

export async function getLoggedUser() {
  const token = localStorage.getItem("token");
  
  const { data } = await axios.get('https://linked-posts.routemisr.com/users/profile-data',
    {
      headers: {
        token: token,
      },
    }
  );
  return data;
}
