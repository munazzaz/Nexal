import Image from 'next/image';
import React, { useState } from 'react';

function formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(0) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num;
}

const ProfileCard = ({ profile }) => {
  const initialImg = profile.profile_pic_url_hd || profile.profile_pic_url || "/no-profile-pic-img.png";
  const [imgSrc, setImgSrc] = useState(initialImg);

  return (
    <div className="border border-gray-500 rounded-lg p-6 w-[540px] mx-14 text-left">
      <div className="mb-6">
        <Image
          src={imgSrc}
          alt={profile.username || "Profile image"}
          className="rounded-full object-cover"
          onError={() => setImgSrc("/no-profile-pic-img.png")}
          width={160}
          height={160}
        />
      </div>
      <h2 className="text-[20px] font-bold text-gray-300">{profile.full_name}</h2>
      <h3 className="text-gray-300 text-[18px]">@{profile.username}</h3>
      <p className="text-gray-300 text-[16px] mt-2">{profile.biography}</p>
      <div className="flex space-x-4 mt-4">
        <span className="text-[18px] text-gray-300">
          Followers: {formatNumber(profile.follower_count)}
        </span>
        <span className="text-[18px] text-gray-300">
          Following: {formatNumber(profile.following_count)}
        </span>
        <span className="text-[18px] text-gray-300">
          Posts: {formatNumber(profile.postsCount)}
        </span>
      </div>
      {profile.external_url && (
        <a
          href={profile.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-blue-500 hover:underline block"
        >
          Visit External Site
        </a>
      )}
    </div>
  );
};

export default ProfileCard;
