import { useContext, useState } from "react";
import { tokenContext } from "../../context/tokenContext.jsx";
import { useQuery } from "@tanstack/react-query";
import { getUserPost } from "../../Api/posts/getUserPost.api.js";
import { useParams } from "react-router-dom";
import Loader from "../loader/loader.jsx";
import SinglePost from "../singlePost/singlePost.jsx";
import Comments from "../comments/comments.jsx";
import PLACEHOLDER from "../../assets/op.jpg";
import CreatePost from "../createPost/createPost.jsx";

export default function Profile() {
    const [show, setShow] = useState({});
    const { userData } = useContext(tokenContext);
    const { id } = useParams();
    const profileId = id || userData?._id;

    const { data: postsData, isLoading: isLoadingPosts, isError: isPostsError, error: postsError } = useQuery({
        queryKey: ["profile", profileId],
        queryFn: () => getUserPost(profileId),
        enabled: !!profileId,
    });

    if (isLoadingPosts) return <Loader />;
    if (isPostsError) {
        return (
            <div className="bg-sky-50 dark:bg-gray-900 w-screen min-h-[calc(100vh-65px)] p-6 transition-colors">
                <div className="w-[60%] max-sm:w-[90%] mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-sm rounded-lg p-6 mt-5 text-center border-sky-800 dark:border-sky-600 border transition-colors">
                    <p className="text-center text-red-600 dark:text-red-400 text-xl">Error: {postsError?.message || "Failed to load profile"}</p>
                </div>
            </div>
        );
    }

    const isOwnProfile = profileId === userData?._id;
    let displayUser = null;

    if (isOwnProfile) {
        displayUser = userData;
    } else if (postsData?.posts && postsData.posts.length > 0 && postsData.posts[0]?.user) {
        displayUser = postsData.posts[0].user;
    } else if (postsData?.user) {

        displayUser = postsData.user;
    } else {
        displayUser = null;
    }
    if (!displayUser && !isOwnProfile) {
        return (
            <div className="bg-sky-50 dark:bg-gray-900 w-screen min-h-[calc(100vh-65px)] p-6 transition-colors">
                <div className="w-[60%] max-sm:w-[90%] mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-sm rounded-lg p-6 mt-5 text-center border-sky-800 dark:border-sky-600 border transition-colors">
                    <p className="text-center text-gray-600 dark:text-gray-300 text-xl">Unable to load user profile information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-sky-50 dark:bg-gray-900 w-screen min-h-[calc(100vh-65px)] py-5 transition-colors">

            <div className="w-[60%] max-sm:w-[90%] mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-sm rounded-lg p-6 mt-5 text-center border-sky-800 dark:border-sky-600 border mb-5 transition-colors">
                <img
                    src={displayUser?.photo || PLACEHOLDER}
                    alt="user"
                    className="w-40 h-40 rounded-full mx-auto object-cover border shadow-md dark:shadow-sm dark:border-gray-600"
                />
                <h2 className="text-2xl font-semibold mt-4 text-sky-800 dark:text-sky-400">
                    {displayUser?.name || "No Name"}
                </h2>

                {displayUser?.email && (
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{displayUser.email}</p>
                )}

                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Account ID: {displayUser?._id || "N/A"}
                </div>
            </div>
            <div className="w-[60%] max-sm:w-[90%]   mx-auto shadow-lg dark:shadow-sm rounded-lg px-4 py-2   mb-5 transition-colors">
                <CreatePost />
            </div>
            <div className="w-[60%] max-sm:w-[90%] mx-auto  ">
                {postsData?.posts && postsData.posts.length > 0 ? (
                    postsData.posts.map((post) => {
                        return <div key={post?._id} className=" bg-white dark:bg-gray-800 ] mx-auto rounded-xl shadow-md dark:shadow-sm p-5 mb-5 transition-colors">

                            <SinglePost post={post} show={show} setShow={setShow} />
                            <Comments post={post} show={show} setShow={setShow} />
                        </div>
                    })
                ) : (
                    <div className="text-center text-gray-400 dark:text-gray-500 mt-10">No posts found.</div>
                )}
            </div>
        </div>
    );
}