// import React from 'react';
// import useSWR from 'swr';

// const fetcher = (url) => fetch(url).then(res => res.json());

// // Helper function to determine text color based on relationship type.
// const getRelationshipColor = (type) => {
//   switch (type) {
//     case 'Family':
//       return 'text-blue-500';
//     case 'Girlfriend/Wife':
//       return 'text-pink-500';
//     case 'Boyfriend/Husband':
//         return 'text-yellow-500';  
//     case 'Associate':
//       return 'text-green-500';
//     case 'Friend':
//       return 'text-purple-500';
//     default:
//       return 'text-gray-500';
//   }
// };

// const RelationshipList = ({ username }) => {
//   const { data, error } = useSWR(
//     username ? `/api/riskScore?username=${username}` : null,
//     fetcher
//   );

//   if (error) {
//     return <div className="p-4 text-red-600">Error loading relationships: {error.message}</div>;
//   }

//   if (!data) {
//     return <div className="p-4 text-white">Loading relationships...</div>;
//   }

//   const { relationships } = data;

//   // Handle case when relationships is a string.
//   if (typeof relationships === 'string') {
//     return (
//       <div className="mt-20 bg-[#1F2937] shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Relationships</h2>
//         <p className="text-[#F0FFFF] ">{relationships}</p>
//       </div>
//     );
//   }

//   // Map through the relationships object if it's valid.
//   return (
//     <div className="mt-5 mx-12 bg-[#1F2937] px-5 pt-10 pb-10 pr-5 border border-[#6c757d] shadow-lg rounded-lg p-6">      
//       {/* 
//         Use a grid with 5 columns. 
//         "gap-4" provides spacing between items, 
//         and items will wrap to a new row if more than 5 exist.
//       */}
//       {/* <ul className="grid grid-cols-5 gap-4">
//         {Object.entries(relationships).map(([user, relType]) => (
//           <li 
//             key={user} 
//             className="border border-[#6c757d] rounded-md p-5 shadow-md flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
//           >
//             <span className="font-medium text-[#F0FFFF] text-[18px]">{user}</span>
//             <span className={`text-sm font-semibold ${getRelationshipColor(relType)}`}>
//               {relType}
//             </span>
//           </li>
//         ))}
//       </ul> */}


// <ul className="grid grid-cols-5 gap-4">
//   {Object.entries(relationships).map(([user, relData]) => (
//     <li 
//       key={user} 
//       className="border border-[#6c757d] rounded-md p-5 shadow-md flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
//     >
//       <span className="font-medium text-[#F0FFFF] text-[18px]">{user}</span>
//       <span className={`text-sm font-semibold ${getRelationshipColor(relData.relationship)}`}>
//         {relData.relationship}
//       </span>
//     </li>
//   ))}
// </ul>
//     </div>
//   );
// };

// export default RelationshipList;


// More tagged user and relationship user profile pic

import Image from 'next/image';
import React from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Helper function to determine text color based on relationship type.
const getRelationshipColor = (type) => {
  switch (type) {
    case 'Family':
      return 'text-blue-500';
    case 'Girlfriend/Wife':
      return 'text-pink-500';
    case 'Boyfriend/Husband':
      return 'text-yellow-500';
    case 'Associate':
      return 'text-green-500';
    case 'Friend':
      return 'text-purple-500';
    default:
      return 'text-gray-500';
  }
};

const RelationshipList = ({ username }) => {
  const { data, error } = useSWR(
    username ? `/api/riskScore?username=${username}` : null,
    fetcher
  );

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading relationships: {error.message}
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 text-white">Loading relationships...</div>;
  }

  const { relationships } = data;

  // Handle case when relationships is returned as a string.
  if (typeof relationships === 'string') {
    return (
      <div className="mt-20 bg-[#1F2937] shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Relationships</h2>
        <p className="text-[#F0FFFF] ">{relationships}</p>
      </div>
    );
  }

  // Render the relationships with profile images using a grid layout.
  return (
    <div className="mt-5 mx-12 bg-[#1F2937] px-5 pt-10 pb-10 pr-5 border border-[#6c757d] shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Relationships</h2>
      <ul className="grid grid-cols-5 gap-4">
        {Object.entries(relationships).map(([user, relData]) => (
          <li
            key={user}
            className="border border-[#6c757d] rounded-md p-5 shadow-md flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
          >
            {/* Display profile image */}
            <Image
              src={relData.profileImage || "/no-profile-pic-img.png"}
              alt={`Profile of ${relData.username}`}
              className="w-16 h-16 rounded-full mb-2 object-cover"
              width={120}
              height={120}
              onError={(e) => (e.target.src = "/no-profile-pic-img.png")}
              
            />
            {/* Display the username */}
            <span className="font-medium text-[#F0FFFF] text-[18px]">
              {relData.username}
            </span>
            {/* Display relationship type with text color */}
            <span
              className={`text-sm font-semibold ${getRelationshipColor(
                relData.relationship
              )}`}
            >
              {relData.relationship}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelationshipList;
