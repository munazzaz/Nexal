"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SearchBar = ({ placeholder = "Search Instagram..." }) => {
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cachedData, setCachedData] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");


  const handleSearch = async (platformUsed = selectedPlatform) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || !/^[a-zA-Z0-9._]+$/.test(trimmedQuery)) {
      setError("User not found. Please type an existing username.");
      setProfile(null);
      return;
    }

    if (platformUsed === "Facebook") {
      setError("Facebook is not supported yet.");
      setProfile(null);
      return;
    }

    if (cachedData[trimmedQuery]) {
      setProfile(cachedData[trimmedQuery]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const response = await fetch(`/api/${platformUsed.toLowerCase()}?username=${trimmedQuery}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setProfile(null);
        return;
      }

      setProfile(data);
      setCachedData((prev) => ({ ...prev, [trimmedQuery]: data }));
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("An error occurred while fetching profile.");
    } finally {
      setLoading(false);
    }
  };


  const onDropdownClick = (platform) => {
    setSelectedPlatform(platform);
    setIsOpen(false);
    handleSearch(platform); 
  };

  return (
    <div className="w-full flex flex-col items-start space-y-4">
      <div className="w-full flex space-x-2">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={`Search ${selectedPlatform}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-200 
                       border border-gray-600 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-[#52C2B1]  text-white rounded-md flex items-center"
          >
            {selectedPlatform} <span className="ml-2">▾</span>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
              <ul className="text-white">
                <li
                  className="px-4 py-2 hover:bg-[#52C2B1]  cursor-pointer"
                  onClick={() => onDropdownClick("Instagram")}
                >
                  Instagram
                </li>
                <li
                  className="px-4 py-2 hover:bg-[#52C2B1]  cursor-pointer"
                  onClick={() => onDropdownClick("Facebook")}
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

      {profile && (
        <Link href={`/profile/${profile.username}`}>
          <div className="w-[1000px] bg-gray-800 border border-cyan-600 
                          rounded-lg p-4 flex items-center cursor-pointer"
          >
            <Image
              src={profile.profile_pic_url || "/no-profile-pic-img.png"}
              alt={profile.username || "Profile image"}
              width={60}
              height={60}
              className="rounded-full mx-5"
              onError={(e) => (e.target.src = "/no-profile-pic-img.png")}
            />
            <div>
              <p className="text-white font-bold">{profile.username}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default SearchBar;
