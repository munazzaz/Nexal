import React from 'react';
import Image from 'next/image';

const posts = [
  {
    username: '@jennysmith',
    date: '3 days ago',
    likes: 3,
    comments: 2,
    imageUrl: '/post1.jpg',
  },
  {
    username: '@jennysmith',
    date: '3 days ago',
    likes: 3,
    comments: 2,
    imageUrl: '/post2.jpg',
  },
  {
    username: '@jennysmith',
    date: '3 days ago',
    likes: 3,
    comments: 2,
    imageUrl: '/post3.jpg',
  },
  {
    username: '@jennysmith',
    date: '3 days ago',
    likes: 3,
    comments: 2,
    imageUrl: '/post4.jpg',
  },
  {
    username: '@jennysmith',
    date: '3 days ago',
    likes: 3,
    comments: 2,
    imageUrl: '/post5.jpg',
  },
  {
    username: '@jennysmith',
    date: '3 days ago',
    likes: 3,
    comments: 2,
    imageUrl: '/post6.jpg',
  },
  {
    username: '@jennysmith',
    date: '3 days ago',
    likes: 3,
    comments: 2,
    imageUrl: '/post7.jpg',
  },
];

const PostCard = () => {
  return (
    <div className="bg-gray-900 p-10">
      <h1 className="text-[48px] text-[#F0FFFF] font-medium mb-3">Detailed Social Media Report</h1>
      <h2 className="text-[28px] font-medium text-[#F0FFFF] mb-2">Profile Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-[#1F2937] rounded-md shadow-lg overflow-hidden 
             border border-transparent border-[#2dd4bfm]
            transition-transform 
            transform hover:scale-105 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500"
          >
            <Image
              src={post.imageUrl}
              alt="Post Image"
              width={240}
              height={360}
              className="object-cover w-full"
            />
            <div className="p-4">
              <p className="text-[#E9ECEF] text-[18px] ">{post.username}</p>
              <p className="text-[#E9ECEF] text-[16px] mt-2">{post.date}</p>
              <p className="text-[#E9ECEF] text-[16px]">
                {post.likes} likes, {post.comments} comments
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
