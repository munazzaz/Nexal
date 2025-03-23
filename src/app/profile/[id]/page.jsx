"use client";
import React from 'react';
import Header from "@/components/Header";
import InterestsCard from "@/components/InterestsCard";
import PostCard from "@/components/PostCard";
import ProfilePostsRapid from "@/components/ProfilePostsRapid";
import ProfileCard from "@/components/ProfileCard";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";

const stats = [
  {
    iconSrc: "/card1.png",
    title: "Risk Score",
    mainText: "10,932",
    subText: "+8.34%",
    subTextColor: "text-[#28A745]",
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
    subText: "New York, NY",
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

function insertLineBreak(bio, limit = 60) {
  if (!bio || bio.length <= limit) return bio || "";
  return `${bio.slice(0, limit)}\n${bio.slice(limit)}`;
}

function formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num;
}

export default function ProfilePage() {
  const { id } = useParams();
  const { data, error } = useSWR(
    id ? `/api/profileDetails?username=${id}` : null,
    fetcher
  );

  return (
    <div className="bg-[#111827] min-h-screen">
      {/* Header */}
      <div className="max-w-screen-2xl mx-auto">
        <Header />
      </div>
      <hr className="border-gray-700" />

      <div className="max-w-screen-2xl mx-auto p-4">
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
            <h1 className="text-[#F0FFFF] text-3xl font-semibold mb-6 px-12 mt-5">
              Social Media Report
            </h1>

            <div className=''><ProfileCard profile={data} /></div>
            

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 mx-12 mt-6">
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#1F2937] px-4 py-2 pt-4 shadow-md flex items-center space-x-4 hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src={item.iconSrc}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="flex-shrink-0"
                  />
                  <div>
                    <p className="text-[#E9ECEF] font-bold text-[16px] mb-[4px]">
                      {item.title}
                    </p>
                    <p className="text-[22px] text-white mb-[4px]">
                      {item.mainText}
                    </p>
                    {item.subText && (
                      <p className={`mt-1 mb-[4px] text-[14px] ${item.subTextColor}`}>
                        {item.subText}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <PostCard />
            </div>

            <div className="mt-2">
              <InterestsCard />
            </div>

            <div className="mt-16 px-5">
              <ProfilePostsRapid username={id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
