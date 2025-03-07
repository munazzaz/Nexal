"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link"
const SearchBar = ({ placeholder = "Search Profile..." }) => {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [cachedPages, setCachedPages] = useState({});

  const handleSearch = async (page = 1) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || !/^[a-zA-Z0-9._]+$/.test(trimmedQuery)) {
      setError("User not found. Please type an existing username.");
      setProfiles([]);
      return;
    }
    if (selectedPlatform === "Facebook") {
      setError("Facebook is not supported yet.");
      setProfiles([]);
      return;
    }

    if (cachedPages[page]) {
      const { profiles: cachedProfs, currentPage: cp, totalPages: tp } =
        cachedPages[page];
      setProfiles(cachedProfs);
      setCurrentPage(cp);
      setTotalPages(tp);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setProfiles([]);

    try {
      const response = await fetch(
        `/api/${selectedPlatform.toLowerCase()}Search?query=${trimmedQuery}&page=${page}&limit=5`
      );
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found");
        } else {
          setError(data.error || "Something went wrong");
        }
        setProfiles([]);
        return;
      }

      setProfiles(data.profiles || []);
      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || 1);

      setCachedPages((prev) => ({
        ...prev,
        [page]: {
          profiles: data.profiles,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        },
      }));
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError("An error occurred while fetching profiles.");
    } finally {
      setLoading(false);
    }
  };

  const onSearchClick = () => {
    setCurrentPage(1);
    setCachedPages({});
    handleSearch(1);
  };

  const handleSelect = (platform) => {
    setSelectedPlatform(platform);
    setIsOpen(false);
    if (platform === "Facebook") {
      setError("Facebook is not supported.");
      setProfiles([]);
    } else if (query) {
      setCurrentPage(1);
      setCachedPages({});
      handleSearch(1);
    }
  };

  const onNext = () => {
    if (currentPage < totalPages) {
      handleSearch(currentPage + 1);
    }
  };
  const onPrev = () => {
    if (currentPage > 1) {
      handleSearch(currentPage - 1);
    }
  };

  const onPageClick = (pageNum) => {
    if (pageNum !== currentPage) {
      handleSearch(pageNum);
    }
  };

  const getDisplayedPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3, 4, "...", totalPages);
    }
    return pages;
  };

  const displayedPages = getDisplayedPages();

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      <div className="flex items-center space-x-2 w-full">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-6 py-2 bg-gradient-to-r from-teal-400 to-blue-500 font-bold text-gray-300 rounded-md w-32 flex items-center justify-between hover:opacity-90"
          >
            {selectedPlatform} <span className="ml-2">▾</span>
          </button>
          {isOpen && (
            <div className="absolute left-0 mt-2 w-32 bg-[#111827] border border-gray-600 rounded-md shadow-lg">
              <ul className="text-gray-300">
                <li
                  className="px-4 py-2 hover:bg-[#52C2B1] cursor-pointer"
                  onClick={() => handleSelect("Instagram")}
                >
                  Instagram
                </li>
                <li
                  className="px-4 py-2 hover:bg-[#52C2B1] cursor-pointer"
                  onClick={() => handleSelect("Facebook")}
                >
                  Facebook
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>


      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-[#F0FFFF]">Loading...</p>}

      <div className="w-full space-y-2 bg-gray-800 border border-cyan-600 rounded-lg">
        {profiles.map((profile) => (
            <Link key={profile.id} href={`/profile/${profile.id}`}>
          <div className="p-4 rounded-md flex items-center">
            <Image
              src={profile.profilePicture || "/no-profile-pic-img.png"}
              alt={profile.username || "Profile image"}
              width={60}
              height={60}
              className="rounded-full mx-5"
              priority
              onError={(e) => (e.target.src = "/no-profile-pic-img.png")}
            />
            <div>
              <p className="text-white font-bold">{profile.username}</p>
              <p className="text-gray-400">{profile.bio}</p>
            </div>
          </div>
          </Link>
        ))}
      </div>

      {profiles.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onPrev}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              ←
            </button>
            <button
              onClick={onNext}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              →
            </button>
          </div>

          <div className="flex space-x-2 mt-4">
            {displayedPages.map((p, idx) => {
              if (p === "...") {
                return (
                  <div
                    key={`ellipsis-${idx}`}
                    className="px-3 py-1 bg-transparent text-white rounded opacity-50"
                  >
                    ...
                  </div>
                );
              }
              return (
                <button
                  key={`page-${p}`}
                  onClick={() => onPageClick(p)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    p === currentPage
                      ? "bg-teal-400 text-white font-bold"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-white">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;


