// export default async function handler(req, res) {
//   const { username, page } = req.query;

//   if (!username) {
//     console.error("No username provided in query.");
//     return res.status(400).json({ error: "Username query parameter is required." });
//   }

  
//   const requestedPage = page ? parseInt(page, 10) : 1;
//   const postsPerPage = 5;
//   const requiredPostsCount = requestedPage * postsPerPage;

//   const apiKey = process.env.RAPIDAPI_KEY; 
//   const apiHost = "social-api4.p.rapidapi.com";
//   const options = {
//     method: "GET",
//     headers: {
//       "x-rapidapi-key": apiKey,
//       "x-rapidapi-host": apiHost,
//     },
//   };

//   const baseUrl = `https://social-api4.p.rapidapi.com/v1/posts?username_or_id_or_url=${username}
//   `;

//   let allPosts = [];
//   let currentPageUrl = baseUrl;
//   let paginationToken = null;

//   try {
//     do {
//       console.log("Requesting URL:", currentPageUrl);
//       const response = await fetch(currentPageUrl, options);
//       if (!response.ok) {
//         const textResponse = await response.text();
//         console.error("Error response status:", response.status);
//         return res
//           .status(response.status)
//           .json({ error: `Error fetching data from RapidAPI: ${textResponse}` });
//       }

//       const data = await response.json();
//       // TEMP: dump the entire response so you can see its structure in your server logs
// // console.log("🎯 RapidAPI response:", JSON.stringify(data, null, 2));


//       if (data.data && data.data.items) {
//         allPosts = allPosts.concat(data.data.items);
//       } else {
//         console.warn("No posts items found in response.");
//       }

//       paginationToken = data.pagination_token || null;
//       if (allPosts.length >= requiredPostsCount) break;

//       if (paginationToken) {
//         currentPageUrl = `${baseUrl}&pagination_token=${paginationToken}`;
//       }
//     } while (paginationToken);

//     const startIndex = (requestedPage - 1) * postsPerPage;
//     const endIndex = startIndex + postsPerPage;
//     const paginatedPosts = allPosts.slice(startIndex, endIndex);

//     const totalPages = Math.ceil(allPosts.length / postsPerPage);

//     res.status(200).json({
//       data: {
//         items: paginatedPosts,
//         count: allPosts.length,
//         totalPages,
//         currentPage: requestedPage,
//       },
//     });
//   } catch (error) {
//     console.error("Exception caught while fetching data:", error);
//     res.status(500).json({ error: error.message });
//   }
// }

// Corretc apo

// export default async function handler(req, res) {
//   const { username, page } = req.query;

//   if (!username) {
//     console.error("No username provided in query.");
//     return res.status(400).json({ error: "Username query parameter is required." });
//   }

//   const requestedPage = page ? parseInt(page, 10) : 1;
//   const postsPerPage = 5;
//   const requiredPostsCount = requestedPage * postsPerPage;

//   const apiKey = process.env.RAPIDAPI_KEY;
//   const apiHost = "social-api4.p.rapidapi.com";
//   const options = {
//     method: "GET",
//     headers: {
//       "x-rapidapi-key": apiKey,
//       "x-rapidapi-host": apiHost,
//     },
//   };

//   // Construct the base URL to fetch posts using the username parameter.
//   const baseUrl = `https://social-api4.p.rapidapi.com/v1/posts?username_or_id_or_url=${username}`;

//   let allPosts = [];
//   let currentPageUrl = baseUrl;
//   let paginationToken = null;

//   try {
//     do {
//       // console.log("Requesting URL:", currentPageUrl);
//       const response = await fetch(currentPageUrl, options);
//       if (!response.ok) {
//         const textResponse = await response.text();
//         console.error("Error response status:", response.status);
//         return res
//           .status(response.status)
//           .json({ error: `Error fetching data from RapidAPI: ${textResponse}` });
//       }

//       const data = await response.json();
      
//       // Log the entire API response
//       // console.log("Complete API response:", JSON.stringify(data, null, 2));
      
//       // Check for tagged user information based on client's format.
//       if (data.data && data.data.items) {
//         data.data.items.forEach((post, index) => {
//           // If the post has a non-empty "tagged_users" array, then log it.
//           if (post.tagged_users && post.tagged_users.length > 0) {
//             // console.log(`Post #${index + 1} - Tagged users:`);
//             post.tagged_users.forEach((tagged, i) => {
//               // console.log(`  Tagged user ${i + 1}:`);
//               // console.log("    Position:", tagged.position);
//               // console.log("    Show Category of User:", tagged.show_category_of_user);
//               // console.log("    User Details:", JSON.stringify(tagged.user, null, 2));
//             });
//           }
//         });
//       } else {
//         console.warn("No posts items found in response.");
//       } 


//       // Merge the new set of posts into allPosts if available
//       if (data.data && data.data.items) {
//         allPosts = allPosts.concat(data.data.items);
//       }

//       // Update the pagination token (if available)
//       paginationToken = data.pagination_token || null;
//       if (allPosts.length >= requiredPostsCount) break;

//       if (paginationToken) {
//         currentPageUrl = `${baseUrl}&pagination_token=${paginationToken}`;
//       }
//     } while (paginationToken);

//     // Calculate the indices for paginated posts
//     const startIndex = (requestedPage - 1) * postsPerPage;
//     const endIndex = startIndex + postsPerPage;
//     const paginatedPosts = allPosts.slice(startIndex, endIndex);
//     const totalPages = Math.ceil(allPosts.length / postsPerPage);

//     res.status(200).json({
//       data: {
//         items: paginatedPosts,
//         count: allPosts.length,
//         totalPages,
//         currentPage: requestedPage,
//       },
//     });
//   } catch (error) {
//     console.error("Exception caught while fetching data:", error);
//     res.status(500).json({ error: error.message });
//   }
// }


// export default async function handler(req, res) {
//   const { username, page } = req.query;

//   if (!username) {
//     console.error("No username provided in query.");
//     return res
//       .status(400)
//       .json({ error: "Username query parameter is required." });
//   }

//   const requestedPage = page ? parseInt(page, 10) : 1;
//   const postsPerPage = 5;
//   const requiredPostsCount = requestedPage * postsPerPage;

//   const apiKey = process.env.RAPIDAPI_KEY;
//   const apiHost = "social-api4.p.rapidapi.com";
//   const options = {
//     method: "GET",
//     headers: {
//       "x-rapidapi-key": apiKey,
//       "x-rapidapi-host": apiHost,
//     },
//   };

//   // Construct the base URL to fetch posts using the username parameter.
//   const baseUrl = `https://social-api4.p.rapidapi.com/v1/posts?username_or_id_or_url=${username}`;

//   let allPosts = [];
//   let currentPageUrl = baseUrl;
//   let paginationToken = null;

//   try {
//     do {
//       // Request data from RapidAPI
//       const response = await fetch(currentPageUrl, options);
//       if (!response.ok) {
//         const textResponse = await response.text();
//         console.error("Error response status:", response.status);
//         return res
//           .status(response.status)
//           .json({ error: `Error fetching data from RapidAPI: ${textResponse}` });
//       }

//       const data = await response.json();

//       // Process and log details for each post in the response.
//       if (data.data && data.data.items) {
//         data.data.items.forEach((post, index) => {
//           // Log carousel (child) posts if they exist
//           if (post.carousel_media && Array.isArray(post.carousel_media)) {
//             console.log(`\n📸 Carousel Post #${index + 1} (Post ID: ${post.id})`);
//             console.log(`Number of media items: ${post.carousel_media.length}`);
//             post.carousel_media.forEach((media, mediaIndex) => {
//               // Log the entire media object for inspection
//               console.log(`\nFull Media Object for Carousel Post #${index + 1} - Media ${mediaIndex + 1}:`);
//               console.log(JSON.stringify(media, null, 2));

//               // Now try to extract the URL
//               let url = "No URL found";
//               if (media.image_versions2 && media.image_versions2.candidates && media.image_versions2.candidates.length > 0) {
//                 url = media.image_versions2.candidates[0].url;
//               } else if (media.video_versions && media.video_versions.length > 0) {
//                 url = media.video_versions[0].url;
//               }

//               console.log(`  ➤ Media ${mediaIndex + 1}:`);
//               console.log(`     Type: ${media.media_type}`);
//               console.log(`     URL: ${url}`);
//             });
//           }

//           // Optionally, log tagged users for each post
//           if (post.tagged_users && post.tagged_users.length > 0) {
//             console.log(`Post #${index + 1} - Tagged users:`);
//             post.tagged_users.forEach((tagged, i) => {
//               console.log(`  Tagged user ${i + 1}:`);
//               console.log("    Username:", tagged.user?.username);
//               console.log("    Position:", tagged.position);
//             });
//           }
//         });
//       } else {
//         console.warn("No posts items found in response.");
//       }

//       // Merge the new set of posts into allPosts if available
//       if (data.data && data.data.items) {
//         allPosts = allPosts.concat(data.data.items);
//       }

//       // Update the pagination token (if available)
//       paginationToken = data.pagination_token || null;
//       if (allPosts.length >= requiredPostsCount) break;

//       if (paginationToken) {
//         currentPageUrl = `${baseUrl}&pagination_token=${paginationToken}`;
//       }
//     } while (paginationToken);

//     // Calculate the indices for paginated posts
//     const startIndex = (requestedPage - 1) * postsPerPage;
//     const endIndex = startIndex + postsPerPage;
//     const paginatedPosts = allPosts.slice(startIndex, endIndex);
//     const totalPages = Math.ceil(allPosts.length / postsPerPage);

//     res.status(200).json({
//       data: {
//         items: paginatedPosts,
//         count: allPosts.length,
//         totalPages,
//         currentPage: requestedPage,
//       },
//     });
//   } catch (error) {
//     console.error("Exception caught while fetching data:", error);
//     res.status(500).json({ error: error.message });
//   }
// }



export default async function handler(req, res) {
  const { username, page } = req.query;

  if (!username) {
    console.error("No username provided in query.");
    return res
      .status(400)
      .json({ error: "Username query parameter is required." });
  }

  const requestedPage = page ? parseInt(page, 10) : 1;
  const postsPerPage = 5;
  const requiredPostsCount = requestedPage * postsPerPage;

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = "social-api4.p.rapidapi.com";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  };

  // Construct the base URL to fetch posts using the username parameter.
  const baseUrl = `https://social-api4.p.rapidapi.com/v1/posts?username_or_id_or_url=${username}`;

  let allPosts = [];
  let currentPageUrl = baseUrl;
  let paginationToken = null;

  try {
    do {
      // Request data from RapidAPI
      const response = await fetch(currentPageUrl, options);
      if (!response.ok) {
        const textResponse = await response.text();
        console.error("Error response status:", response.status);
        return res
          .status(response.status)
          .json({ error: `Error fetching data from RapidAPI: ${textResponse}` });
      }

      const data = await response.json();

      // Process and log details for each post in the response.
      if (data.data && data.data.items) {
        data.data.items.forEach((post, index) => {
          // Log carousel (child) posts if they exist
          if (post.carousel_media && Array.isArray(post.carousel_media)) {
            // console.log(`\n📸 Carousel Post #${index + 1} (Post ID: ${post.id})`);
            // console.log(`Number of media items: ${post.carousel_media.length}`);
            post.carousel_media.forEach((media, mediaIndex) => {
              // Log the entire media object for inspection
              // console.log(
              //   `\nFull Media Object for Carousel Post #${index + 1} - Media ${mediaIndex + 1}:`
              // );
              // console.log(JSON.stringify(media, null, 2));

              // Try to extract the URL from possible properties
              let url = "No URL found";
              if (
                media.image_versions2 &&
                media.image_versions2.candidates &&
                media.image_versions2.candidates.length > 0
              ) {
                url = media.image_versions2.candidates[0].url;
              } else if (
                media.image_versions &&
                media.image_versions.items &&
                media.image_versions.items.length > 0
              ) {
                url = media.image_versions.items[0].url;
              } else if (
                media.video_versions &&
                media.video_versions.length > 0
              ) {
                url = media.video_versions[0].url;
              }

              // console.log(`  ➤ Media ${mediaIndex + 1}:`);
              // console.log(`     Type: ${media.media_type}`);
              // console.log(`     URL: ${url}`);
            });
          }

          // Optionally, log tagged users for each post
          if (post.tagged_users && post.tagged_users.length > 0) {
            console.log(`Post #${index + 1} - Tagged users:`);
            post.tagged_users.forEach((tagged, i) => {
              // console.log(`  Tagged user ${i + 1}:`);
              // console.log("    Username:", tagged.user?.username);
              // console.log("    Position:", tagged.position);
            });
          }
        });
      } else {
        console.warn("No posts items found in response.");
      }

      // Merge the new set of posts into allPosts if available
      if (data.data && data.data.items) {
        allPosts = allPosts.concat(data.data.items);
      }

      // Update the pagination token (if available)
      paginationToken = data.pagination_token || null;
      if (allPosts.length >= requiredPostsCount) break;

      if (paginationToken) {
        currentPageUrl = `${baseUrl}&pagination_token=${paginationToken}`;
      }
    } while (paginationToken);

    // Calculate the indices for paginated posts
    const startIndex = (requestedPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allPosts.length / postsPerPage);

    res.status(200).json({
      data: {
        items: paginatedPosts,
        count: allPosts.length,
        totalPages,
        currentPage: requestedPage,
      },
    });
  } catch (error) {
    console.error("Exception caught while fetching data:", error);
    res.status(500).json({ error: error.message });
  }
}
