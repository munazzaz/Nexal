import React from "react";
import Image from "next/image";

const InterestsCard = () => {
  const items = [
    { label: "Time passed",    color: "bg-[#198754]", progress: "w-full", check: true },
    { label: "Impressions",    color: "bg-[#0D6EFD]", progress: "w-3/4" },
    { label: "Clicks",         color: "bg-[#0D6EFD]", progress: "w-3/4" },
    { label: "Amount spent",   color: "bg-[#0D6EFD]", progress: "w-1/2" },
  ];

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
          <h2 className="text-[#F0FFFF] text-[20px] font-semibold mb-4">Interests</h2>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1 mt-3">
                  <span className="mt-3 text-[#E9ECEF] text-[14.4px]">
                    {item.label}
                  </span>
                  {item.check && <Image
                          src="/checkmark.png"
                          alt="Arrow"
                          width={16}
                          height={16}
                        />}
                </div>

                <div className="relative">
                  <div className="relative w-full bg-[#6c757d] border border-[#6c757d] rounded-md h-4 overflow-hidden">
                    <div className={`${item.progress} ${item.color} h-4`} />
                  </div>

                  {item.progress !== "w-full" && (
                    item.color === "bg-[#198754]" ? (
                      <span className="absolute -top-3 right-0">
                         <Image
                          src="/checkmark.png"
                          alt="Arrow"
                          width={16}
                          height={16}
                        />
                      </span>
                    ) : (
                      <span className="absolute -top-6 right-0">
                        <Image
                          src="/arrow.png"
                          alt="Arrow"
                          width={14}
                          height={14}
                        />
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default InterestsCard;
