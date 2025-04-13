"use client";
import React from "react";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function InterestsCard({ username }) {
  const { data, error } = useSWR(
    username ? `/api/riskScore?username=${username}` : null,
    fetcher
  );

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading interests.
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="p-4 text-gray-500">
        Loading interests...
      </div>
    );
  }

  const { topInterests } = data;

  if (!topInterests || topInterests.length === 0) {
    return (
      <div className="bg-[#1F2937] p-6 rounded shadow-md mx-12 mt-6">
        <h2 className="text-[#F0FFFF] text-[20px] font-semibold mb-4">Top 5 Interests</h2>
        <p className="text-gray-400">No interests found.</p>
      </div>
    );
  }

  return (
    <div className="mx-12">
      <div
        className="bg-[#223554] border border-[#0D6EFD] rounded-xl px-8 py-4 w-full flex items-center justify-center"
        style={{ boxShadow: "0.05px rgba(13, 110, 253, 0.5)" }}
      >
        <h2 className="text-[#0D6EFD] text-[32px] font-medium">Interests</h2>
      </div>

      <div className="mt-7 flex items-center justify-center">
        <div className="bg-[#1f2937] border border-[#6c757d] rounded-md px-6 pb-10 pt-6 w-full shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105">
          <h2 className="text-[#F0FFFF] text-[20px] font-semibold mb-4">Top 5 Interests</h2>
          <div className="space-y-4">
            {topInterests.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mt-3 mb-1">
                  <span className="text-[#E9ECEF] text-[14.4px]">
                    {item.interest} - {item.percentage}%
                  </span>
                  <Image
                    src="/checkmark.png"
                    alt="Check"
                    width={16}
                    height={16}
                  />
                </div>
                <div className="relative">
                  <div className="w-full bg-[#6c757d] border border-[#6c757d] rounded-md h-4 overflow-hidden">
                    <div className="bg-[#198754] h-4" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
