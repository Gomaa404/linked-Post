import React, { useState } from "react";
import { getAllPosts } from "../../Api/posts/allPosts.api.js";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader/loader";
import Comments from "../comments/comments";
import { Link } from "react-router-dom";
import PLACEHOLDER from "../../assets/op.jpg";
import SinglePost from "../singlePost/singlePost.jsx";
import CreatePost from "../createPost/createPost.jsx";

export default function Home() {
    const [show, setShow] = useState({});

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["allPosts"],
        queryFn: getAllPosts,
        select: (data) => data.posts,
    });
    if (isError) return <p className="text-red-600 dark:text-red-400 text-center p-5">Error: {error.message}</p>;
    if (isLoading) return <Loader />;
    return (
        <div className="  min-h-screen py-5  transition-colors ">
            <div className="w-scree  md:w-[60%]  mx-auto rounded-xl shadow-md dark:shadow-gray-700  mb-5 transition-colors">
                <CreatePost />
            </div>
            {data.map((post) => {
                return <div key={post._id} className="w-screen bg-white dark:bg-gray-800 md:w-[60%] mx-auto rounded-xl shadow-md dark:shadow-gray-700 p-5 mb-5 transition-colors">
                    <Link to={`postDetails/${post._id}`} className="block cursor-pointer">
                        <SinglePost post={post} show={show} setShow={setShow} />
                    </Link>
                    <Comments post={post} show={show} setShow={setShow} />
                </div>
            })}
        </div>
    );
}