import React, { useContext, useEffect, useState } from 'react';
import PLACEHOLDER from "../../assets/op.jpg";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../../Api/posts/deletePost.api';
import { updatePost } from '../../Api/posts/updatePost.api';
import toast from 'react-hot-toast';
import { tokenContext } from '../../context/tokenContext.jsx';

export default function SinglePost({ post, setShow, isClickable = true }) {
    const { userData } = useContext(tokenContext);
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [draftBody, setDraftBody] = useState(post?.body || '');
    const [draftImageFile, setDraftImageFile] = useState(null);
    const [draftImagePreview, setDraftImagePreview] = useState(post?.image || '');
    const [removeImage, setRemoveImage] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const isOwner = userData?._id && post?.user?._id && userData._id === post.user._id;

    useEffect(() => {
        setDraftBody(post?.body || '');
        setDraftImageFile(null);
        setDraftImagePreview(post?.image || '');
        setRemoveImage(false);
    }, [post]);

    const { mutate: handleDelete, isLoading: isDeleting } = useMutation({
        mutationFn: (postId) => deletePost(postId),
        onSuccess: () => {
            toast.success('Post deleted successfully');
            queryClient.invalidateQueries(['allPosts']);
            queryClient.invalidateQueries(['profile']);
            queryClient.invalidateQueries(['singlePost']);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to delete post');
        },
    });

    const { mutate: handleUpdate, isLoading: isUpdating } = useMutation({
        mutationFn: ({ postId, payload }) => updatePost(postId, payload),
        onSuccess: () => {
            toast.success('Post updated successfully');
            queryClient.invalidateQueries(['allPosts']);
            queryClient.invalidateQueries(['profile']);
            queryClient.invalidateQueries(['singlePost']);
            setIsEditing(false);
            setDraftImageFile(null);
            setRemoveImage(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to update post');
        },
    });

    const onDeleteClick = (e) => {
        e.preventDefault();
        if (!post?._id || !isOwner || isDeleting) return;
        handleDelete(post._id);
    };

    const handleImageChange = (file) => {
        if (!file) return;
        setDraftImageFile(file);
        setDraftImagePreview(URL.createObjectURL(file));
        setRemoveImage(false);
    };

    return (
        <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <img
                        src={post?.user?.photo || PLACEHOLDER}
                        alt="avatar"
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{post?.user?.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{post?.createdAt}</p>
                    </div>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button
                            className="px-3 py-1.5 rounded-lg hover:bg-sky-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                            onClick={(e) => {
                                e.preventDefault();
                                setMenuOpen((prev) => !prev);
                            }}
                            disabled={isDeleting || isUpdating}
                            aria-label="Post actions"
                        >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsEditing(true);
                                        setMenuOpen(false);
                                    }}
                                    disabled={isDeleting || isUpdating}
                                >
                                    <i className="fa-regular fa-pen-to-square"></i> Edit Post
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700"
                                    onClick={onDeleteClick}
                                    disabled={isDeleting || isUpdating}
                                >
                                    <i className="fa-solid fa-xmark"></i> Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="mb-4">
                    <textarea
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        rows={4}
                        placeholder="Edit your post..."
                        className="w-full px-4 py-3 rounded-lg border border-sky-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />

                    <div className="mt-3 flex items-center gap-2">
                        <button
                            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm transition disabled:opacity-60"
                            disabled={!draftBody?.trim() || isUpdating}
                            onClick={() => {
                                const formData = new FormData();
                                formData.append('body', draftBody.trim());
                                if (draftImageFile && !removeImage) formData.append('image', draftImageFile);
                                if (removeImage) formData.append('removeImage', true);
                                handleUpdate({ postId: post._id, payload: formData });
                            }}
                        >
                            {isUpdating ? 'Saving...' : 'Save'}
                        </button>

                        <button
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition"
                            onClick={() => {
                                setIsEditing(false);
                                setDraftBody(post?.body || '');
                                setDraftImageFile(null);
                                setDraftImagePreview(post?.image || '');
                                setRemoveImage(false);
                            }}
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <label className="cursor-pointer text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageChange(file);
                                }}
                                disabled={isUpdating}
                            />
                            Change Photo
                        </label>

                        {(post?.image || draftImagePreview) && (
                            <label className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={removeImage}
                                    onChange={(e) => {
                                        setRemoveImage(e.target.checked);
                                        if (e.target.checked) {
                                            setDraftImageFile(null);
                                            setDraftImagePreview('');
                                        }
                                    }}
                                    disabled={isUpdating}
                                />
                                Remove Current Photo
                            </label>
                        )}
                    </div>

                    {draftImagePreview && !removeImage && (
                        <img
                            src={draftImagePreview}
                            alt="preview"
                            className="w-full max-h-72 object-cover rounded-lg border border-gray-200 dark:border-gray-700 mt-3"
                        />
                    )}
                </div>
            ) : (
                <p className="text-gray-800 dark:text-gray-200 mb-4">{post?.body}</p>
            )}

            {(!isEditing || (!removeImage && draftImagePreview)) && (
                <img
                    src={isEditing ? draftImagePreview : post.image || PLACEHOLDER}
                    alt="post"
                    className="w-full max-h-96 object-cover rounded-xl mb-4"
                />
            )}

            <div className="flex items-center justify-between my-3 py-2 shadow-lg dark:shadow-sm rounded-2xl px-3 bg-sky-50 dark:bg-gray-700 transition-colors">
                <button className="px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-sky-900 dark:hover:bg-sky-700 hover:text-white transition-all text-gray-700 dark:text-gray-300">
                    <i className="fa-regular fa-thumbs-up"></i> Like
                </button>
                <button
                    className="px-4 py-1.5 rounded-lg hover:bg-sky-900 dark:hover:bg-sky-700 hover:text-white transition-all text-gray-700 dark:text-gray-300"
                    onClick={() => setShow?.((prev) => ({ ...prev, [post._id]: !prev[post._id] }))}
                >
                    <i className="fa-regular fa-comment"></i> Comment
                </button>
                <button className="px-4 py-1.5 rounded-lg hover:bg-sky-900 dark:hover:bg-sky-700 hover:text-white transition-all text-gray-700 dark:text-gray-300">
                    <i className="fa-regular fa-share-from-square"></i> Share
                </button>
            </div>
        </div>
    );
}