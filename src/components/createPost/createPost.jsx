import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../../Api/posts/createPost.api';
import toast from 'react-hot-toast';

export default function CreatePost() {
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [imageScr, setImageScr] = useState('');
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => createPost(data),
        onSuccess: (res) => {
            const newPost = res?.post || res?.data?.post;
            if (newPost) {
                queryClient.setQueryData(['allPosts'], (old) => {
                    if (!old) return old;
                    const existing = Array.isArray(old?.posts) ? old.posts : [];
                    return { ...old, posts: [newPost, ...existing] };
                });
                const profileQueries = queryClient.getQueryCache().findAll({ queryKey: ['profile'] });
                profileQueries.forEach((q) => {
                    queryClient.setQueryData(q.queryKey, (old) => {
                        if (!old) return old;
                        const existing = Array.isArray(old?.posts) ? old.posts : [];
                        return { ...old, posts: [newPost, ...existing] };
                    });
                });
            }

            toast.success('Post added successfully');
            setBody('');
            setImage(null);
            setImageScr('');
            queryClient.invalidateQueries({ queryKey: ['profile'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['allPosts'], exact: false });
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to create post';
            toast.error(message);
        },
    });

    function handleAddPost(e) {
        e.preventDefault();
        if (!body.trim() && !image) {
            toast.error('Please add text or an image');
            return;
        }
        const formData = new FormData();
        if (body.trim()) {
            formData.append('body', body.trim());
        }
        if (image) {
            formData.append('image', image);
        }
        mutate(formData);
    }

    function handleChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setImageScr(URL.createObjectURL(file));
    }

    function handleRemoveImage() {
        setImage(null);
        setImageScr('');
    }

    return (
        <form className=" bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl transition-colors p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <label htmlFor="post-body" className="sr-only">Write a post</label>
                    <textarea
                        id="post-body"
                        onChange={(e) => setBody(e.target.value)}
                        value={body}
                        rows={3}
                        className="w-full px-4 py-3 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-sky-500 rounded-lg transition-colors resize-none placeholder:text-gray-500 dark:placeholder:text-gray-300"
                        placeholder="Share something..."
                        disabled={isPending}
                    />
                    {imageScr && (
                        <div className="mt-3 relative">
                            <img src={imageScr} alt="preview" className="w-full max-h-72 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 text-red-600 dark:text-red-400 rounded-full p-2 shadow-sm hover:bg-white dark:hover:bg-gray-800 transition"
                                disabled={isPending}
                                aria-label="Remove image"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-3">
                <label className="cursor-pointer inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                        disabled={isPending}
                    />
                    <div className="px-3 py-2 rounded-lg border border-sky-200 dark:border-sky-600 hover:bg-sky-50 dark:hover:bg-gray-700 text-sm flex items-center gap-2">
                        <i className="fa-regular fa-image"></i>
                        Add photo
                    </div>
                </label>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setBody('');
                            handleRemoveImage();
                        }}
                        className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        disabled={isPending || (!body && !image)}
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        onClick={handleAddPost}
                        className="px-4 py-2 rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 shadow-xs text-sm transition disabled:opacity-60"
                        disabled={isPending}
                    >
                        {isPending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </form>
    );
}
