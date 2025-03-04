import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";


const posts = [
    {
        image: "/searchpost1.jpg",
        title: "Abstract art",
        date: "Jan 1, 2022 10:00am",
        likes: "2.3k likes",
        comments: "120 comments",
    },
    {
        image: "/searchpost1.jpg",
        title: "Beautiful sunset",
        date: "Jan 2, 2022 12:00pm",
        likes: "4.5k likes",
        comments: "230 comments",
    },
    {
        image: "/searchpost1.jpg",
        title: "Cute puppies",
        date: "Jan 3, 2022 11:00am",
        likes: "3.2k likes",
        comments: "150 comments",
    },
    {
        image: "/searchpost1.jpg",
        title: "Delicious food",
        date: "Jan 4, 2022 9:00am",
        likes: "5.7k likes",
        comments: "300 comments",
    },
    {
        image: "/searchpost1.jpg",
        title: "Travel adventure",
        date: "Jan 5, 2022 2:00pm",
        likes: "6.4k likes",
        comments: "400 comments",
    },
];

export default function PostSearch() {
    const [search, setSearch] = useState("");

    // Filter logic
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    // Show only 5 items
    const displayedPosts = filteredPosts.slice(0, 5);



    return (
        <div className="p-6 text-white">
            <h1 className="text-[40px] text-[#F0FFFF] font-semibold mb-4">Summary</h1>

            {/* Search Bar + Button */}
            <div className="flex items-center gap-60 mb-4">
                {/* Input Container */}
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

                {/* Filter Button */}
                <button
                    className="px-4 py-2 bg-[#5DC2B1] text-[14px] text-white 
                     rounded-md hover:bg-teal-600 transition"
                >
                    Filter By
                </button>
            </div>

            {/* Posts Table (no scrolling) */}
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
                        {displayedPosts.map((post, index) => (
                            <tr key={index} className="hover:bg-[#323232] text-[#F0FFFF] text-[14px] transition-colors">
                                <td className="p-3">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        width={60}
                                        height={60}
                                        className="rounded-full"
                                    />
                                </td>
                                <td className="p-3 text-[14px]">{post.title}</td>
                                <td className="p-3">{post.date}</td>
                                <td className="p-3 text-[14px]">{post.likes}</td>
                                <td className="p-3 text-[14px] text-[#2ABDB2]">{post.comments}</td>
                                <td className="p-3 text-[14px] text-center">
                                    <Image 
                                        src="/eye.png"
                                        alt="View"
                                        width={32}
                                        height={32}
                                        className="bg-[]"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 mt-6">
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-white hover:bg-[#2ABDB2] transition">
                    <ChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2ABDB2] text-white font-semibold">
                    1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-white hover:bg-[#2ABDB2] transition">
                    2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-white hover:bg-[#2ABDB2] transition">
                    3
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-white hover:bg-[#2ABDB2] transition">
                    4
                </button>

                <span className="text-white">...</span>

                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-white hover:bg-[#2ABDB2] transition">
                    12
                </button>

                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 text-white hover:bg-[#2ABDB2] transition">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
