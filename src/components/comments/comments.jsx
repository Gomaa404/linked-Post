import React, { useState, useContext } from 'react';
import PLACEHOLDER from "../../assets/op.jpg";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../Api/comments/createComment.api';
import toast from 'react-hot-toast';
import { tokenContext } from '../../context/tokenContext.jsx';

export default function Comments({ post, show }) {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();
    const { userData } = useContext(tokenContext);

    const updateCommentsForPost = (newComment, updater) => {
        if (!newComment) return;
        queryClient.setQueriesData({ queryKey: updater, exact: false }, (old) => {
            if (!old) return old;
            if (old?._id === post._id) {
                const existing = Array.isArray(old.comments) ? old.comments : [];
                return { ...old, comments: [newComment, ...existing] };
            }
            if (Array.isArray(old?.posts)) {
                const updatedPosts = old.posts.map((p) => {
                    if (p?._id !== post._id) return p;
                    const existing = Array.isArray(p.comments) ? p.comments : [];
                    return { ...p, comments: [newComment, ...existing] };
                });
                return { ...old, posts: updatedPosts };
            }
            if (Array.isArray(old)) {
                return old.map((p) => {
                    if (p?._id !== post._id) return p;
                    const existing = Array.isArray(p.comments) ? p.comments : [];
                    return { ...p, comments: [newComment, ...existing] };
                });
            }
            return old;
        });
    };

    const { mutate, isPending } = useMutation({
        mutationFn: createComment,
        onSuccess: (res) => {
            const rawComment = res?.comment || res?.data?.comment || res?.data?.data?.comment;
            const creatorFromApi = rawComment?.commentCreator || rawComment?.commentedBy || rawComment?.user;
            const photoFromApi =
                creatorFromApi?.photo?.secure_url ||
                creatorFromApi?.photo?.url ||
                creatorFromApi?.photo ||
                creatorFromApi?.avatar ||
                creatorFromApi?.image;

            const newComment = rawComment ? {
                ...rawComment,
                commentCreator: creatorFromApi || {
                    _id: userData?._id,
                    name: userData?.name || 'You',
                    photo: userData?.photo || null,
                },
            }
                : null;

            if (newComment?.commentCreator) {
                newComment.commentCreator = {
                    ...newComment.commentCreator,
                    name: newComment.commentCreator.name || userData?.name || 'You',
                    photo: photoFromApi || newComment.commentCreator.photo || userData?.photo || null,
                };
            }

            updateCommentsForPost(newComment, ['allPosts']);
            updateCommentsForPost(newComment, ['profile']);
            updateCommentsForPost(newComment, ['singlePost']);
            updateCommentsForPost(newComment, ['singlePost', post._id]);
            queryClient.invalidateQueries({ queryKey: ['singlePost'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['allPosts'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['profile'], exact: false });
            toast.success('Comment added');
            setContent('');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to add comment';
            toast.error(message);
        }
    });

    if (!post) return null;

    const submitComment = (e) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error('Please write a comment');
            return;
        }
        mutate({ postId: post._id, content: content.trim() });
    };

    const isOpen = !!show?.[post?._id];
    console.log(post.comments);

    return (
        <>
            {isOpen && (
                <div className="mt-3 bg-gray-50 dark:bg-gray-700 rounded-xl shadow dark:shadow-sm border dark:border-gray-600 p-4 overflow-scroll h-60 transition-colors">
                    {post?.comments.map((comment, idx) => {
                        const creator = comment?.commentCreator || comment?.commentedBy || comment?.user;
                        const photo = creator?.photo;
                        let photoUrl = null;
                        if (photo) {
                            if (typeof photo === 'string' && photo.trim() !== '') {
                                photoUrl = photo; 
                            } else if (photo?.secure_url) {
                                photoUrl = photo.secure_url; 
                            } else if (photo?.url) {
                                photoUrl = photo.url;
                            }
                        }
                        photoUrl = photoUrl || creator?.avatar || creator?.image || PLACEHOLDER;
                        return (
                            <div key={comment?._id || idx} className="mb-4">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={photoUrl}
                                        className="w-9 h-9 rounded-full object-cover"
                                        alt="avatar"
                                        onError={(e) => {
                                            e.target.src = PLACEHOLDER;
                                        }}
                                    />
                                    <div className="bg-gray-200 dark:bg-gray-600 rounded-xl p-3 w-full">
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {creator?.name || comment?.name}
                                        </p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                            {comment?.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {(post.comments.length === 0) && (
                        <p className="text-sm text-gray-500 dark:text-gray-300">No comments yet.</p>
                    )}
                </div>
            )}
            <form className="flex gap-3 mt-3" onSubmit={submitComment}>
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-sky-800 dark:focus:ring-sky-600 outline-none"
                    disabled={isPending}
                />
                <button
                    type="submit"
                    className="px-5 py-2 bg-sky-800 hover:bg-sky-950 dark:bg-sky-700 dark:hover:bg-sky-800 text-white rounded-lg transition-colors disabled:opacity-60"
                    disabled={isPending}
                >
                    {isPending ? 'Sending...' : 'Send'} </button>
            </form>
        </>
    )
}
