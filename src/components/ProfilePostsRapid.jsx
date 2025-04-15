// "use client";
// import { useState, useEffect } from "react";
// import useSWR from "swr";
// import Image from "next/image";
// import dynamic from "next/dynamic";
// import Link from "next/link";

// const Search = dynamic(
//   () => import("lucide-react").then((mod) => mod.Search),
//   { ssr: false }
// );

// const fetcher = (url) => fetch(url).then((res) => res.json());

// const formatNumber = (num) => {
//   if (num >= 1000000) {
//     return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
//   }
//   if (num >= 1000) {
//     return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
//   }
//   return num;
// };

// const truncateText = (text, maxLength = 100) => {
//   if (!text) return "";
//   return text.length > maxLength ? text.substring(0, maxLength) + " ..." : text;
// };

// // --- Adjusted helper function ---
// function getSightEngineLabel(analysis) {
//   const labels = [];
//   // If safe score is below 0.8, flag as "adult content"
//   if (analysis.nudity && analysis.nudity.safe < 0.8) {
//     labels.push("adult content");
//   }
//   // If offensive probability is above 0.01, mark as "offensive"
//   if (analysis.offensive && analysis.offensive.prob > 0.01) {
//     labels.push("offensive");
//   }
//   // For weapons, if value is above 0.005, mark as "weapon"
//   if (analysis.weapon && analysis.weapon > 0.005) {
//     labels.push("weapon");
//   }
//   // For drugs, if value is above 0.005, mark as "drugs"
//   if (analysis.drugs && analysis.drugs > 0.005) {
//     labels.push("drugs");
//   }
//   // If no concerning value, mark as safe.
//   if (labels.length === 0) {
//     labels.push("safe");
//   }
//   return labels.join(", ");
// }

// export default function PostSearch({ username }) {
//   const [search, setSearch] = useState("");
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = 12;

//   // Fetch posts data
//   const { data, error } = useSWR(
//     username ? `/api/profilePosts?username=${username}&page=${currentPage}` : null,
//     fetcher
//   );

//   // Fetch risk score data (which includes imageAnalysis results)
//   const { data: riskScoreData, error: riskScoreError } = useSWR(
//     username ? `/api/riskScore?username=${username}` : null,
//     fetcher
//   );

//   // Fetch comments data when a post is selected
//   const { data: commentsData, error: commentsError } = useSWR(
//     selectedPost ? `/api/postComments?postId=${selectedPost.id}` : null,
//     fetcher
//   );

//   useEffect(() => {
//     if (commentsData) {
//       console.log("Fetched Comments Data:", commentsData);
//     }
//   }, [commentsData]);

//   if (error)
//     return <div className="p-6 text-red-500">Error loading posts</div>;
//   if (!data)
//     return <div className="p-6 text-gray-500">Loading posts...</div>;

//   // Utility function to normalize URLs (remove query parameters)
//   function normalizeUrl(url) {
//     return url.split('?')[0];
//   }

//   // Extract image analysis results from riskScoreData if available
//   const imageAnalysisResults =
//     riskScoreData && riskScoreData.imageAnalysis ? riskScoreData.imageAnalysis : [];

//   // Map through posts data and merge with image analysis results
//   const posts = (data.data && data.data.items ? data.data.items : []).map(
//     (post) => {
//       // Determine the image URL from possible fields
//       let imageUrl = null;
//       if (
//         post.image_versions2 &&
//         post.image_versions2.candidates &&
//         post.image_versions2.candidates[0]
//       ) {
//         imageUrl = post.image_versions2.candidates[0].url;
//       } else if (
//         post.image_versions &&
//         post.image_versions.items &&
//         post.image_versions.items[0]
//       ) {
//         imageUrl = post.image_versions.items[0].url;
//       } else if (
//         post.carousel_media &&
//         Array.isArray(post.carousel_media) &&
//         post.carousel_media.length > 0
//       ) {
//         const carouselItem = post.carousel_media[0];
//         if (
//           carouselItem.image_versions &&
//           carouselItem.image_versions.items &&
//           carouselItem.image_versions.items[0]
//         ) {
//           imageUrl = carouselItem.image_versions.items[0].url;
//         }
//       }

//       // Find matching image analysis result by comparing normalized URLs.
//       const matchingAnalysis = imageAnalysisResults.find((analysis) =>
//         normalizeUrl(analysis.imageUrl) === normalizeUrl(imageUrl)
//       );

//       // If found, add its computed label; otherwise, an empty string.
//       const sightLabel = matchingAnalysis ? matchingAnalysis.label : "";

//       // Determine caption/snippet
//       let titleSnippet = "No caption";
//       if (post.caption) {
//         if (typeof post.caption === "object" && post.caption.text) {
//           titleSnippet = post.caption.text;
//         } else if (typeof post.caption === "string") {
//           titleSnippet = post.caption;
//         } else {
//           titleSnippet = JSON.stringify(post.caption);
//         }
//       }

//       const dateTime = post.taken_at
//         ? new Date(post.taken_at * 1000).toLocaleDateString()
//         : "N/A";
//       const likes = post.like_count;
//       const commentsCount = post.comment_count;

//       return {
//         ...post,
//         image: imageUrl, // For display purposes
//         imageUrl,        // For matching analysis results
//         titleSnippet,
//         dateTime,
//         likes,
//         commentsCount,
//         sightLabel,      // Computed label from SightEngine
//       };
//     }
//   );

//   const filteredPosts = posts.filter((post) =>
//     post.titleSnippet.toLowerCase().includes(search.toLowerCase())
//   );

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handleOpenModal = (post) => setSelectedPost(post);
//   const handleCloseModal = () => setSelectedPost(null);

//   return (
//     <div className="p-6 text-white">
//       <h1 className="text-[40px] text-[#F0FFFF] font-semibold mb-4">
//         Summary
//       </h1>

//       <div className="flex items-center gap-4 mb-4">
//         <div className="relative flex-1">
//           <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//             size={18}
//           />
//           <input
//             type="text"
//             placeholder="Filter by post title"
//             className="w-full p-2 pl-10 pr-4 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:border-teal-400"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <button className="bg-[#52C2B1] px-4 py-2 text-white border rounded-md">
//           Filter By
//         </button>
//       </div>

//       <div className="bg-[#1f2937] mt-8 border border-gray-700 rounded-md overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-[#1f2937]">
//             <tr className="border-b text-[14px] border-gray-400">
//               <th className="p-3 text-[#F0FFFF]">Image</th>
//               <th className="p-3 text-[#F0FFFF]">Post Title/Snippet</th>
//               <th className="p-3 text-[#F0FFFF]">Date/Time</th>
//               <th className="p-3 text-[#F0FFFF]">Likes</th>
//               <th className="p-3 text-[#F0FFFF]">Comments</th>
//               <th className="p-3 text-[#F0FFFF]">View Full Details</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y text-[#F0FFFF] divide-gray-700">
//             {filteredPosts.length > 0 ? (
//               filteredPosts.map((post, index) => (
//                 <tr key={index} className="hover:bg-[#323232] transition-colors">
//                   <td className="p-3">
//                     {post.imageUrl ? (
//                       <div className="relative w-[60px] h-[60px]">
//                         <Image
//                           src={post.imageUrl}
//                           alt={post.titleSnippet}
//                           fill
//                           className="object-cover rounded-full"
//                         />
//                         {post.sightLabel && (
//                           <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-xs text-center text-white rounded-b">
//                             {post.sightLabel}
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="text-gray-400">No image</div>
//                     )}
//                   </td>
//                   <td className="p-3 text-[14px]">
//                     {truncateText(post.titleSnippet, 100)}
//                   </td>
//                   <td className="p-3">{post.dateTime}</td>
//                   <td className="p-3 text-[14px]">{formatNumber(post.likes)}</td>
//                   <td className="p-3 text-[14px] text-[#2ABDB2]">
//                     {formatNumber(post.commentsCount)}
//                   </td>
//                   <td className="p-3 text-[14px] text-center">
//                     <Image
//                       src="/eye.png"
//                       alt="View"
//                       width={32}
//                       height={32}
//                       className="cursor-pointer"
//                       onClick={() => handleOpenModal(post)}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="p-3 text-center">
//                   No posts available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-center mt-4">
//         <button
//           onClick={handlePrevPage}
//           disabled={currentPage === 1}
//           className="px-3 py-1 border rounded-l hover:bg-gray-700 disabled:opacity-50"
//         >
//           &lt;
//         </button>
//         {Array.from({ length: totalPages }, (_, index) => {
//           const pageNumber = index + 1;
//           if (totalPages === 12 && pageNumber > 5 && pageNumber !== totalPages) {
//             if (pageNumber === 6) {
//               return (
//                 <span
//                   key="ellipsis"
//                   className="px-3 py-1 border border-t-0 border-b-0 border-gray-700"
//                 >
//                   ...
//                 </span>
//               );
//             }
//             return null;
//           }
//           return (
//             <button
//               key={pageNumber}
//               onClick={() => handlePageChange(pageNumber)}
//               className={`px-3 py-1 border hover:bg-gray-700 ${
//                 pageNumber === currentPage ? "bg-teal-400" : ""
//               }`}
//             >
//               {pageNumber}
//             </button>
//           );
//         })}
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 border rounded-r hover:bg-gray-700 disabled:opacity-50"
//         >
//           &gt;
//         </button>
//       </div>

//       {selectedPost && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//           onClick={handleCloseModal}
//         >
//           <div
//             className="bg-[#1f2937] text-white p-4 md:p-6 rounded-md relative w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-2 right-2 text-[16px] px-2 py-1 bg-[#000000] font-bold"
//               onClick={handleCloseModal}
//             >
//               X
//             </button>
//             <div className="relative w-full mt-5 h-[250px]">
//               <Image
//                 src={selectedPost.imageUrl}
//                 alt="Post image"
//                 fill
//                 className="object-contain object-center rounded bg-[#1f2937]"
//               />
//               {selectedPost.sightLabel && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-xs text-center text-white p-1">
//                   {selectedPost.sightLabel}
//                 </div>
//               )}
//             </div>
//             <h2 className="text-[12px] mt-4 mb-2">
//               {selectedPost.titleSnippet}
//             </h2>
//             <div className="mt-2">
//               <h3 className="font-semibold mb-1">Comments</h3>
//               {commentsError && (
//                 <p className="text-[14px] text-red-300">
//                   Error loading comments.
//                 </p>
//               )}
//               {!commentsData && !commentsError ? (
//                 <p className="text-[14px] text-gray-300">Loading comments...</p>
//               ) : commentsData &&
//                 commentsData.comments &&
//                 commentsData.comments.length > 0 ? (
//                 <div className="mt-4">
//                   {commentsData.comments.map((comment, i) => (
//                     <div
//                       key={i}
//                       className="p-2 rounded text-[14px] text-gray-100 border-b border-gray-600 flex items-center gap-2"
//                     >
//                       <Image
//                         src={comment.profilePic}
//                         alt={comment.username}
//                         width={30}
//                         height={30}
//                         className="rounded-full"
//                       />
//                       <div>
//                         <p>
//                           <strong>{comment.username}</strong> ({comment.date}):
//                         </p>
//                         <p>{comment.text}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-[14px] text-gray-300">
//                   No comments available.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

const Search = dynamic(
  () => import("lucide-react").then((mod) => mod.Search),
  { ssr: false }
);

const fetcher = (url) => fetch(url).then((res) => res.json());

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + " ..." : text;
};

// --- Adjusted helper function ---
function getSightEngineLabel(analysis) {
  const labels = [];
  if (analysis.nudity && analysis.nudity.safe < 0.8) {
    labels.push("adult content");
  }
  if (analysis.offensive && analysis.offensive.prob > 0.01) {
    labels.push("offensive");
  }
  if (analysis.weapon && analysis.weapon > 0.005) {
    labels.push("weapon");
  }
  if (analysis.drugs && analysis.drugs > 0.005) {
    labels.push("drugs");
  }
  if (labels.length === 0) {
    labels.push("safe");
  }
  return labels.join(", ");
}

export default function PostSearch({ username }) {
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showChildPosts, setShowChildPosts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;

  // Fetch posts data
  const { data, error } = useSWR(
    username ? `/api/profilePosts?username=${username}&page=${currentPage}` : null,
    fetcher
  );

  // Fetch risk score data (which includes imageAnalysis results)
  const { data: riskScoreData, error: riskScoreError } = useSWR(
    username ? `/api/riskScore?username=${username}` : null,
    fetcher
  );

  // Fetch comments data when a post is selected
  const { data: commentsData, error: commentsError } = useSWR(
    selectedPost ? `/api/postComments?postId=${selectedPost.id}` : null,
    fetcher
  );

  useEffect(() => {
    if (commentsData) {
      console.log("Fetched Comments Data:", commentsData);
    }
  }, [commentsData]);

  if (error)
    return <div className="p-6 text-red-500">Error loading posts</div>;
  if (!data)
    return <div className="p-6 text-gray-500">Loading posts...</div>;

  // Utility function to normalize URLs (remove query parameters)
  function normalizeUrl(url) {
    return url.split('?')[0];
  }

  const imageAnalysisResults =
    riskScoreData && riskScoreData.imageAnalysis ? riskScoreData.imageAnalysis : [];

  // Process posts data and merge with analysis results
  const posts = (data.data && data.data.items ? data.data.items : []).map(
    (post) => {
      let imageUrl = null;
      if (
        post.image_versions2 &&
        post.image_versions2.candidates &&
        post.image_versions2.candidates[0]
      ) {
        imageUrl = post.image_versions2.candidates[0].url;
      } else if (
        post.image_versions &&
        post.image_versions.items &&
        post.image_versions.items[0]
      ) {
        imageUrl = post.image_versions.items[0].url;
      } else if (
        post.carousel_media &&
        Array.isArray(post.carousel_media) &&
        post.carousel_media.length > 0
      ) {
        // Use the first carousel item if available
        const carouselItem = post.carousel_media[0];
        if (
          carouselItem.image_versions &&
          carouselItem.image_versions.items &&
          carouselItem.image_versions.items[0]
        ) {
          imageUrl = carouselItem.image_versions.items[0].url;
        }
      }

      const matchingAnalysis = imageAnalysisResults.find((analysis) =>
        normalizeUrl(analysis.imageUrl) === normalizeUrl(imageUrl)
      );
      const sightLabel = matchingAnalysis ? matchingAnalysis.label : "";

      let titleSnippet = "No caption";
      if (post.caption) {
        if (typeof post.caption === "object" && post.caption.text) {
          titleSnippet = post.caption.text;
        } else if (typeof post.caption === "string") {
          titleSnippet = post.caption;
        } else {
          titleSnippet = JSON.stringify(post.caption);
        }
      }

      const dateTime = post.taken_at
        ? new Date(post.taken_at * 1000).toLocaleDateString()
        : "N/A";
      const likes = post.like_count;
      const commentsCount = post.comment_count;

      return {
        ...post,
        image: imageUrl,
        imageUrl,
        titleSnippet,
        dateTime,
        likes,
        commentsCount,
        sightLabel,
      };
    }
  );

  const filteredPosts = posts.filter((post) =>
    post.titleSnippet.toLowerCase().includes(search.toLowerCase())
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setShowChildPosts(false); // Reset child posts view
  };
  const handleCloseModal = () => {
    setSelectedPost(null);
    setShowChildPosts(false);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-[40px] text-[#F0FFFF] font-semibold mb-4">
        Summary
      </h1>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Filter by post title"
            className="w-full p-2 pl-10 pr-4 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:border-teal-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="bg-[#52C2B1] px-4 py-2 text-white border rounded-md">
          Filter By
        </button>
      </div>

      <div className="bg-[#1f2937] mt-8 border border-gray-700 rounded-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1f2937]">
            <tr className="border-b text-[14px] border-gray-400">
              <th className="p-3 text-[#F0FFFF]">Image</th>
              <th className="p-3 text-[#F0FFFF]">Post Title/Snippet</th>
              <th className="p-3 text-[#F0FFFF]">Date/Time</th>
              <th className="p-3 text-[#F0FFFF]">Likes</th>
              <th className="p-3 text-[#F0FFFF]">Comments</th>
              <th className="p-3 text-[#F0FFFF]">View Details</th>
            </tr>
          </thead>
          <tbody className="divide-y text-[#F0FFFF] divide-gray-700">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <tr key={index} className="hover:bg-[#323232] transition-colors">
                  <td className="p-3">
                    {post.imageUrl ? (
                      <div className="relative w-[60px] h-[60px]">
                        <Image
                          src={post.imageUrl}
                          alt={post.titleSnippet}
                          fill
                          className="object-cover rounded-full"
                        />
                        {post.sightLabel && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-xs text-center text-white rounded-b">
                            {post.sightLabel}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </td>
                  <td className="p-3 text-[14px]">
                    {truncateText(post.titleSnippet, 100)}
                  </td>
                  <td className="p-3">{post.dateTime}</td>
                  <td className="p-3 text-[14px]">{formatNumber(post.likes)}</td>
                  <td className="p-3 text-[14px] text-[#2ABDB2]">
                    {formatNumber(post.commentsCount)}
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center">
                  No posts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-l hover:bg-gray-700 disabled:opacity-50"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          if (totalPages === 12 && pageNumber > 5 && pageNumber !== totalPages) {
            if (pageNumber === 6) {
              return (
                <span
                  key="ellipsis"
                  className="px-3 py-1 border border-t-0 border-b-0 border-gray-700"
                >
                  ...
                </span>
              );
            }
            return null;
          }
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 border hover:bg-gray-700 ${
                pageNumber === currentPage ? "bg-teal-400" : ""
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-r hover:bg-gray-700 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>

      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#1f2937] text-white p-4 md:p-6 rounded-md relative w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-[16px] px-2 py-1 bg-[#000000] font-bold"
              onClick={handleCloseModal}
            >
              X
            </button>
            {/* Main Post Image */}
            <div className="relative w-full mt-5 h-[250px]">
              <Image
                src={selectedPost.imageUrl}
                alt="Post image"
                fill
                className="object-contain object-center rounded bg-[#1f2937]"
              />
              {selectedPost.sightLabel && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-xs text-center text-white p-1">
                  {selectedPost.sightLabel}
                </div>
              )}
            </div>
            <h2 className="text-[12px] mt-4 mb-2">
              {selectedPost.titleSnippet}
            </h2>

            {/* Button to toggle view for child/ carousel posts */}
            {selectedPost.carousel_media &&
              Array.isArray(selectedPost.carousel_media) &&
              selectedPost.carousel_media.length > 0 && (
                <button
                  onClick={() => setShowChildPosts(!showChildPosts)}
                  className="mt-3 mb-3 px-4 py-2 bg-teal-500 text-sm font-semibold rounded hover:bg-teal-600"
                >
                  {showChildPosts ? "Hide Child Posts" : "View Child Posts"}
                </button>
              )}

            {/* Display carousel child images if toggled */}
            {showChildPosts && selectedPost.carousel_media && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {selectedPost.carousel_media.map((child, i) => {
                  // Determine the child image URL
                  let childUrl = null;
                  if (
                    child.image_versions2 &&
                    child.image_versions2.candidates &&
                    child.image_versions2.candidates[0]
                  ) {
                    childUrl = child.image_versions2.candidates[0].url;
                  } else if (
                    child.image_versions &&
                    child.image_versions.items &&
                    child.image_versions.items[0]
                  ) {
                    childUrl = child.image_versions.items[0].url;
                  } else if (
                    child.video_versions &&
                    child.video_versions[0]
                  ) {
                    childUrl = child.video_versions[0].url;
                  }
                  return (
                    <div key={i} className="relative w-[80px] h-[80px] flex-shrink-0">
                      {childUrl ? (
                        <Image
                          src={childUrl}
                          alt={`Child ${i + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-500 flex items-center justify-center text-xs">
                          No image
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-2">
              <h3 className="font-semibold mb-1">Comments</h3>
              {commentsError && (
                <p className="text-[14px] text-red-300">
                  Error loading comments.
                </p>
              )}
              {!commentsData && !commentsError ? (
                <p className="text-[14px] text-gray-300">Loading comments...</p>
              ) : commentsData &&
                commentsData.comments &&
                commentsData.comments.length > 0 ? (
                <div className="mt-4">
                  {commentsData.comments.map((comment, i) => (
                    <div
                      key={i}
                      className="p-2 rounded text-[14px] text-gray-100 border-b border-gray-600 flex items-center gap-2"
                    >
                      <Image
                        src={comment.profilePic}
                        alt={comment.username}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <div>
                        <p>
                          <strong>{comment.username}</strong> ({comment.date}):
                        </p>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-gray-300">
                  No comments available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
