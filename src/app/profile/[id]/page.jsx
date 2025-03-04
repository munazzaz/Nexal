// Correct code
"use client"; // Mark this as a Client Component

import Header from "@/components/Header";
import InterestsCard from "@/components/InterestsCard"
import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import PostCard from "@/components/PostCard";
import PostSearch from "@/components/PostSearch";

const stats = [
    {
      iconSrc: "/card1.png",
      title: "Risk Score",
      mainText: "10,932",
      subText: "+8.34%",        // e.g. growth rate
      subTextColor: "text-[#28A745]", // color for the subText
    },
    {
      iconSrc: "/card2.png",
      title: "Latest Post",
      mainText: "12,642",
      subText: "+4.78%",
      subTextColor: "text-[#28A745]",
    },
    {
      iconSrc: "/card3.png",
      title: "Location",
      mainText: "United States",
      subText: "New York, NY", // e.g. city, state
      subTextColor: "text-[#28A745]", 
    },
    {
      iconSrc: "/card4.png",
      title: "Last Seen",
      mainText: "50 Minutes Ago",
      subText: "14 January 2025",
      subTextColor: "text-[#28A745]", 
    },
  ];


const fetcher = (url) => fetch(url).then((res) => res.json());

// Helper to insert a line break after a certain number of characters
function insertLineBreak(bio, limit = 60) {
  if (!bio || bio.length <= limit) {
    return bio || "";
  }
  const firstPart = bio.slice(0, limit);
  const secondPart = bio.slice(limit);
  return `${firstPart}\n${secondPart}`;
}

function formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num;
}

export default function ProfilePage() {
  const { id } = useParams();

  const { data, error } = useSWR(
    id ? `/api/profileDetails?id=${id}` : null,
    fetcher
  );

  return (
    <div className="bg-[#111827] min-h-screen">
      {/* Always show the header */}
      <div className="max-w-screen-2xl mx-auto">
        <Header />
      </div>
      <hr className="border-gray-700" />

      <div className="max-w-screen-2xl mx-auto p-4">
        {/* Loading and Error States */}
        {error ? (
          <div className="p-4 text-red-500 bg-slate-400 border border-gray-800 text-center">
            Error loading profile: {error.message || "Unknown error"}
          </div>
        ) : !data ? (
          <div className="p-4 text-gray-500 text-center">
            Loading Profile Details...
          </div>
        ) : (
          <>
            {/* Optional Page Heading */}
            <h1 className="text-[#F0FFFF] text-3xl font-semibold mb-6 px-12 mt-5">
              Social Media Report
            </h1>

            {/* The Profile Card */}
            <div className="mx-12 bg-[#1F2937] p-4 rounded-xl shadow-md flex flex-row w-[530px]">
              {/* LEFT COLUMN */}
              <div className="flex flex-col items-start w-1/2 mx-2">
                {/* Profile Image */}
                <Image
                  src={data.profilePicture || "/no-profile-pic-img.png"}
                  alt={data.username}
                  className="rounded-full object-cover flex-shrink-0 mb-9 "
                  width={120}
                  height={120}
                />

                {/* Followers / Following / Posts */}
                <div className="flex space-x-4 mt-4">
                  <div className="text-center">
                    <p className="text-[14px] text-gray-400">Followers</p>
                    <p className="text-white text-start font-semibold text-[12px]">
                      {formatNumber(data.followersCount)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] text-gray-400">Following</p>
                    <p className="text-white text-start font-semibold text-[12px]">
                      {formatNumber(data.followingCount)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] text-gray-400">Posts</p>
                    <p className="text-white text-start  font-semibold text-[12px]">
                      {formatNumber(data.postsCount)}
                    </p>
                  </div>
                </div>

                {/* Profile Type */}
                <div className="mt-4">
                  <p className="text-[14px] text-gray-400">Profile Type</p>
                  <p className="text-white text-[12px]">
                    {data.isPrivate ? "Private" : "Public"}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col w-1/2 mr-4">
                {/* Full Name */}
                <h2 className="text-[22px] font-bold text-[#F0FFFF]">
                  {data.fullName || data.username}
                </h2>

                {/* Username */}
                <p className="text-gray-400 text-[14px]">@{data.username}</p>

                {/* Verified Check */}
                {data.isVerified && (
                  <p className="text-blue-500 font-semibold mt-1">Verified</p>
                )}

                {/* Bio */}
                {data.bio && (
                  <p className="text-gray-300 text-[12px] mt-2 whitespace-pre-line">
                    Bio: {insertLineBreak(data.bio, 60)}
                  </p>
                )}

                {/* Website (Link To) */}
                {/* {data.externalUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Link to</p>
                    <a
                      href={data.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2ABDB2] hover:underline"
                    >
                      {data.externalUrl}
                    </a>
                  </div>
                )} */}

{data.externalUrl && (
  <div className="mt-4">
    <p className="text-sm text-gray-400">Link to</p>
    <a
      href={data.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#2ABDB2] hover:underline break-all"
    >
      {data.externalUrl}
    </a>
  </div>
)}


                {/* Business Category */}
                {data.businessCategory && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Business Category</p>
                    <p className="text-white">{data.businessCategory}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

         {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 mx-12 mt-6">
  {stats.map((item, idx) => (
    <div
      key={idx}
      className="bg-[#1F2937] px-4 py-2 pt-4 shadow-md flex flex-row items-center space-x-4 hover:scale-105 transition-transform duration-300"
    >
      {/* Left Column: Icon */}
      <Image
        src={item.iconSrc}
        alt={item.title}
        width={48}
        height={48}
        className="flex-shrink-0"
      />

      {/* Right Column: Text */}
      <div >
        <p className="text-[#E9ECEF] font-bold text-[16px] mb-[4px] ">
          {item.title}
        </p>
        <p className="text-[22px] text-white mb-[4px]">
          {item.mainText}
        </p>
        {item.subText && (
          <p className={`mt-1 mb-[4px] text-[#14px] ${item.subTextColor || ""}`}>
            {item.subText}
          </p>
        )}
      </div>
    </div>
  ))}
</div>
{/* Post Card Section */}
<div className="mt-16"><PostCard/></div>

{/* Intrest Card Section */}
<div className="mt-2">
         <InterestsCard/>
</div>

<div className="mt-16 px-5">
  <PostSearch />
</div>
      </div>
    </div>
  );
}


