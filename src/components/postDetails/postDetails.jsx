import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../Api/posts/singlePost.api.js';
import { useParams } from 'react-router-dom';
import Loader from '../loader/loader';
import SinglePost from '../singlePost/singlePost.jsx';
import Comments from '../comments/comments.jsx';
import React, { useState } from 'react';

export default function PostDetails() {
    let { id } = useParams();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['singlePost', id],
        queryFn: () => getPosts(id),
        select: (data) => data.post,
    });
    const [show, setShow] = useState({});
    if (isLoading) return <Loader />;
    if (isError) return <p className='text-red-500 dark:text-red-400'>Error: {error.message}</p>;
    return (
        <div className='bg-sky-100 dark:bg-gray-900 py-5 h-[calc(100hv-65px)] flex justify-center items-center transition-colors'>
            <div className="sm:w-screen bg-white dark:bg-gray-800 lg:w-[60%] mx-auto rounded-xl shadow-md dark:shadow-sm p-5 mb-5 transition-colors">
                <SinglePost post={data} setShow={setShow} show={show} />
                <Comments post={data} show={show} />
            </div>
        </div>
    );
}
