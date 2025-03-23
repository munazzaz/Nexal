"use client";

import { useState } from "react";
import useSWR from "swr";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function PostSearch({ profileId }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null); 

  const limit = 5;
  const totalPages = 12;

  const { data, error } = useSWR(
    profileId
      ? `/api/profilePosts?id=${profileId}&page=${page}&limit=${limit}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  if (error) return <div className="p-6 text-red-500">Error loading posts</div>;
  if (!data) return <div className="p-6 text-gray-500">Loading posts...</div>;


  const posts = data?.posts || [];

  const filteredPosts = posts.filter((post) =>
    post.titleSnippet.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-[40px] text-[#F0FFFF] font-semibold mb-4">Summary</h1>

      <div className="flex items-center gap-60 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Filter by post title"
            className="w-full p-2 pl-10 pr-4 bg-[#1f2937] text-white 
                       border border-gray-500 rounded-md 
                       focus:outline-none focus:border-teal-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-[#5DC2B1] text-[14px] text-white 
                           rounded-md hover:bg-teal-600 transition">
          Filter By
        </button>
      </div>

      <div className="bg-[#1f2937] mt-8 border border-gray-700 rounded-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1f2937]">
            <tr className="border-b text-[14px] border-gray-400">
              <th className="p-3 text-[#F0FFFF]">Image</th>
              <th className="p-3 text-[#F0FFFF]">Post Title/Snippet</th>
              <th className="p-3 text-[#F0FFFF]">Date/Time</th>
              <th className="p-3 text-[#F0FFFF]">Likes</th>
              <th className="p-3 text-[#F0FFFF]">Comments</th>
              <th className="p-3 text-[#F0FFFF]">View Full Details</th>
            </tr>
          </thead>
          <tbody className="divide-y text-[#F0FFFF] divide-border-gray-400">
            {filteredPosts.map((post, index) => (
              <tr
                key={index}
                className="hover:bg-[#323232] text-[#F0FFFF] text-[14px] transition-colors"
              >
                <td className="p-3">
                  <Image
                    src={post.image}
                    alt={post.titleSnippet} 
                    width={60}
                    height={60}
                    className="rounded-full w-18 h-16"
                  />
                </td>
                <td className="p-3 text-[14px]">{post.titleSnippet}</td>
                <td className="p-3">{post.dateTime}</td>
                <td className="p-3 text-[14px]">{post.likes}</td>
                <td className="p-3 text-[14px] text-[#2ABDB2]">
                  {post.commentsCount}
                </td>
                <td className="p-3 text-[14px] text-center">
                  <Image
                    src="/eye.png"
                    alt="View"
                    width={32}
                    height={32}
                    className="cursor-pointer"
                    onClick={() => handleOpenModal(post)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center space-x-3 p-4 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="w-10 h-10 flex items-center justify-center 
                     rounded-full border border-gray-500 text-white 
                     hover:bg-[#2ABDB2] transition 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => setPage(1)}
          className={`w-10 h-10 flex items-center justify-center 
                     rounded-full border border-gray-500 text-white transition 
                     ${
                       page === 1
                         ? "bg-[#2ABDB2] font-semibold"
                         : "hover:bg-[#2ABDB2]"
                     }`}
        >
          1
        </button>

        <button
          onClick={() => setPage(2)}
          className={`w-10 h-10 flex items-center justify-center 
                     rounded-full border border-gray-500 text-white transition 
                     ${
                       page === 2
                         ? "bg-[#2ABDB2] font-semibold"
                         : "hover:bg-[#2ABDB2]"
                     }`}
        >
          2
        </button>

        <button
          onClick={() => setPage(3)}
          className={`w-10 h-10 flex items-center justify-center 
                     rounded-full border border-gray-500 text-white transition 
                     ${
                       page === 3
                         ? "bg-[#2ABDB2] font-semibold"
                         : "hover:bg-[#2ABDB2]"
                     }`}
        >
          3
        </button>

        <button
          onClick={() => setPage(4)}
          className={`w-10 h-10 flex items-center justify-center 
                     rounded-full border border-gray-500 text-white transition 
                     ${
                       page === 4
                         ? "bg-[#2ABDB2] font-semibold"
                         : "hover:bg-[#2ABDB2]"
                     }`}
        >
          4
        </button>

        <span className="text-white">...</span>

        <button
          onClick={() => setPage(12)}
          className={`w-10 h-10 flex items-center justify-center 
                     rounded-full border border-gray-500 text-white transition 
                     ${
                       page === 12
                         ? "bg-[#2ABDB2] font-semibold"
                         : "hover:bg-[#2ABDB2]"
                     }`}
        >
          12
        </button>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="w-10 h-10 flex items-center justify-center 
                     rounded-full border border-gray-500 text-white 
                     hover:bg-[#2ABDB2] transition 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#1f2937] text-white p-4 md:p-6 rounded-md relative 
                       w-[90%] max-w-[500px] max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-[16px] px-2 py-1 bg-[#000000] font-bold"
              onClick={handleCloseModal}
            >
              X
            </button>

            Post Image
      

<div className="relative w-full h-[250px]"> 
  <Image
    src={selectedPost.image}
    alt="Post image"
    fill  
    className="object-contain object-center rounded bg-[#1f2937]"
  />
</div>


{selectedPost.latestComments && selectedPost.latestComments.length > 0 ? (
  <div className="mt-4">
    <h3 className="font-semibold mb-1">
      Comments 
    </h3>
    <ul className="">
      {selectedPost.latestComments.slice(0, 3).map((cmt, i) => (
        <li
          key={i}
          className="p-2 rounded text-[14px] text-gray-100"
        >
          <p>
            <strong>{cmt.username}</strong>: {cmt.text}
          </p>
        </li>
      ))}
    </ul>
  </div>
) : (
  <p className="mt-4 text-[14px] text-gray-100">No comments here</p>
)}

          </div>
        </div>
      )}
    </div>
  );
}



