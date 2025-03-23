"use client";
import useSWR from "swr";

const fetcher = url => fetch(url).then(res => res.json());

export default function ProfilePosts({ profileId }) {
  const { data, error } = useSWR(
    profileId ? `/api/profilePosts?id=${profileId}` : null,
    fetcher
  );

  if (error) return <div>Error loading posts: {error.message}</div>;
  if (!data) return <div>Loading posts...</div>;

  return (
    <div>
      {data.posts && data.posts.length > 0 ? (
        data.posts.map((post, idx) => (
          <div key={idx} className="mb-4">
            <img
              src={post.imageUrl}
              alt={post.caption || "Post image"}
              className="w-full rounded"
            />
            <p className="mt-2 text-white">{post.caption}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No posts found.</p>
      )}
    </div>
  );
}
