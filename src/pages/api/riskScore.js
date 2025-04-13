// // correctly fetching relationship 2
// import fetch from 'node-fetch';

// function simplifyData(items, type) {
//   return items.map(item => {
//     const username =
//       item.username && item.username.trim() !== ''
//         ? item.username
//         : (item.fullName && item.fullName.trim() !== '' ? item.fullName : `unknown_${item.id}`);
//     if (type === 'post') {
//       return {
//         id: item.id,
//         caption: typeof item.caption === 'string' ? item.caption.slice(0, 500) : '',
//         likeCount: item.like_count,
//         username,
//         tags:
//           item.tags?.map(tag => {
//             const tagUsername =
//               tag.username && tag.username.trim() !== ''
//                 ? tag.username
//                 : (tag.fullName && tag.fullName.trim() !== '' ? tag.fullName : `unknown_${tag.id || 'tag'}`);
//             return {
//               username: tagUsername,
//               fullName: tag.fullName || '',
//               profileImage: tag.profileImage || '',
//               gender: tag.gender || ''
//             };
//           }) || [],
//         imageUrl:
//           item.imageUrl ||
//           (item.image_versions &&
//             item.image_versions.items &&
//             item.image_versions.items.length > 0
//               ? item.image_versions.items[0].url
//               : null)
//       };
//     } else if (type === 'comment') {
//       return {
//         id: item.id,
//         text: typeof item.text === 'string' ? item.text.slice(0, 500) : '',
//         username,
//         likeCount: item.like_count || 0
//       };
//     }
//     return item;
//   });
// }

// function aggregateEngagement(posts, comments) {
//   const engagement = {};
//   posts.forEach(post => {
//     const user = post.username;
//     if (user) {
//       engagement[user] = engagement[user] || { likes: 0, comments: 0 };
//       engagement[user].likes += post.likeCount;
//     }
//     post.tags.forEach(tag => {
//       const tagUser = tag.username;
//       if (tagUser) {
//         engagement[tagUser] = engagement[tagUser] || { likes: 0, comments: 0 };
//         engagement[tagUser].likes += Math.floor(post.likeCount / 2);
//       }
//     });
//   });
//   comments.forEach(comment => {
//     const user = comment.username;
//     if (user) {
//       engagement[user] = engagement[user] || { likes: 0, comments: 0 };
//       engagement[user].comments += 1;
//       engagement[user].likes += comment.likeCount;
//     }
//   });
//   console.log("Aggregated Engagement Metrics:", engagement);
//   return engagement;
// }

// function chunkArray(arr, chunkSize = 5) {
//   const chunks = [];
//   for (let i = 0; i < arr.length; i += chunkSize) {
//     chunks.push(arr.slice(i, i + chunkSize));
//   }
//   console.log("Data Chunks:", chunks);
//   return chunks;
// }

// function isValidRiskScore(score) {
//   const num = Number(score);
//   return !isNaN(num) && num >= 0 && num <= 100;
// }

// function extractValidJSON(text) {
//   const startIndex = text.indexOf('{');
//   if (startIndex === -1) return null;
//   let openBraces = 0;
//   let endIndex = startIndex;
//   for (let i = startIndex; i < text.length; i++) {
//     if (text[i] === '{') openBraces++;
//     if (text[i] === '}') openBraces--;
//     if (openBraces === 0) {
//       endIndex = i;
//       break;
//     }
//   }
//   return text.substring(startIndex, endIndex + 1);
// }

// // ---------------------
// // GPT-4 Analysis Functions
// // ---------------------
// async function getRiskForChunk(chunk, aggregatedData, profileDetails) {
//   const jsonData = JSON.stringify({
//     data: chunk,
//     engagementMetrics: aggregatedData,
//     profileDetails
//   });
//   const prompt = `
// You are a seasoned intelligence analyst tasked with evaluating the risk level of a social media profile.
// Based on the JSON data below, calculate a risk score between 0 (minimal risk) and 100 (very high risk).
// Return only the risk score as a single number, with no additional text.

// Data: ${jsonData}
// `;
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json', 
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 20,
//       temperature: 0.2
//     })
//   });
//   const responseText = await response.text();
//   console.log("Response from GPT-4 (risk chunk):", responseText);
//   if (!response.ok)
//     throw new Error(`OpenAI API error (risk chunk): ${responseText}`);
//   const data = JSON.parse(responseText);
//   const score = data.choices[0].message.content.trim();
//   if (!isValidRiskScore(score)) console.warn("Invalid risk score received:", score);
//   return score;
// }

// async function getInterestsForChunk(chunk, aggregatedData, profileDetails) {
//   const jsonData = JSON.stringify({
//     data: chunk,
//     engagementMetrics: aggregatedData,
//     profileDetails
//   });
//   const prompt = `
// You are a social media analyst. Based on the JSON data below, identify the top five interests of the user (e.g., fitness, comedy, technology).
// Return only a JSON array of five strings, with no extra text.

// Data: ${jsonData}
// `;
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 40,
//       temperature: 0.2
//     })
//   });
//   const responseText = await response.text();
//   console.log("Response from GPT-4 (interests chunk):", responseText);
//   if (!response.ok)
//     throw new Error(`OpenAI API error (interests chunk): ${responseText}`);
//   const data = JSON.parse(responseText);
//   try {
//     let content = data.choices[0].message.content.trim();
//     content = content.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
//     return JSON.parse(content);
//   } catch (error) {
//     console.warn("Error parsing interests:", error);
//     return [];
//   }
// }

// async function getRelationshipsForChunk(chunk, aggregatedData, profileDetails) {
//   const jsonData = JSON.stringify({
//     data: chunk,
//     engagementMetrics: aggregatedData,
//     profileDetails,
//     note: "For any user with a username starting with 'unknown_', treat the data as incomplete. Use any available metadata such as fullName or gender to classify the relationship."
//   });
// //   const prompt = `
// // You are a seasoned intelligence analyst. Analyze the JSON data below and determine the relationships between the target user and their most engaged and tagged users.
// // Follow these detailed rules:
// // 1. Family Members: If two or more users are tagged in the same photo and share the same last name (extracted from their fullName), classify them as "Family".
// // 2. Romantic Partner: If a female user is tagged in multiple posts with high frequency, classify her as "Girlfriend/Wife".
// // 3. Associates: If business-related comments (e.g., "great work", "professional", "business") or a combination of 2+ likes, 3+ likes, or a comment plus a like is evident, classify as "Associate".
// // 4. Friends: If comments include casual language (e.g., "you look cool", "you real bro") or emojis, classify as "Friend".
// // If any user data is incomplete (e.g., username starts with "unknown_"), try to use available metadata (like fullName or gender) to make the best possible classification.
// // Return only a valid JSON object mapping each username (tagged or commenting) to one of the following categories: "Family", "Girlfriend/Wife", "Associate", or "Friend". Do not include any additional text.

// // Data: ${jsonData}
// // `;

// const prompt = `
// You are a seasoned intelligence analyst. Analyze the JSON data below and determine the relationships between the target user and their most engaged and tagged users.
// Follow these detailed rules:
// 1. Family Members: If two or more users are tagged in the same photo and share the same last name (extracted from their fullName), classify them as "Family".
// 2. Romantic Partner:
//    - If a female user is tagged in multiple posts with high frequency, classify her as "Girlfriend/Wife".
//    - If a male user is tagged in multiple posts with high frequency, classify him as "Boyfriend/Husband".
// 3. Associates: If business-related comments (e.g., "great work", "professional", "business") or a combination of 2+ likes, 3+ likes, or a comment plus a like is evident, classify as "Associate".
// 4. Friends: If comments include casual language (e.g., "you look cool", "you real bro") or emojis, classify as "Friend".
// If any user data is incomplete (e.g., username starts with "unknown_"), use available metadata (such as fullName or gender) for the best classification.
// **IMPORTANT:** Output only a valid JSON object _without any markdown formatting or extra text_. The JSON should map each username (tagged or commenting) to one of these exact strings: "Family", "Girlfriend/Wife", "Boyfriend/Husband", "Associate", or "Friend". If no relationships can be determined, output {}.
// Data: ${jsonData}
// `;
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 200,
//       temperature: 0.2
//     })
//   });
  
//   const responseText = await response.text();
//   console.log("Response from GPT-4 (relationships chunk):", responseText);
//   if (!response.ok)
//     throw new Error(`OpenAI API error (relationships chunk): ${responseText}`);
  
//   const data = JSON.parse(responseText);
//   let content = data.choices[0].message.content.trim();
//   content = content.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
//   try {
//     return JSON.parse(content);
//   } catch (error) {
//     console.warn("Error parsing relationships:", error);
//     const extracted = extractValidJSON(content);
//     if (extracted) {
//       try {
//         return JSON.parse(extracted);
//       } catch (err) {
//         console.warn("Fallback JSON parsing failed:", err);
//       }
//     }
//     return {};
//   }
// }

// async function getFinalRiskScore(partialScores) {
//   const combinedScores = partialScores.join("\n");
//   const prompt = `
// You are a seasoned intelligence analyst. Given the following partial risk scores, consolidate them into a single risk score between 0 and 100.
// Return only the final risk score, with no extra text.

// Partial Risk Scores:
// ${combinedScores}
// `;
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 20,
//       temperature: 0.2
//     })
//   });
//   const responseText = await response.text();
//   console.log("Response from GPT-4 (final risk aggregation):", responseText);
//   if (!response.ok)
//     throw new Error(`OpenAI Aggregation API error (risk): ${responseText}`);
//   const data = JSON.parse(responseText);
//   const finalScore = data.choices[0].message.content.trim();
//   if (!isValidRiskScore(finalScore))
//     console.warn("Invalid final risk score received:", finalScore);
//   return finalScore;
// }

// async function getFinalInterests(partialInterestsArrays) {
//   const prompt = `
// You are a social media analyst. Given the following arrays of interests, consolidate them and determine the overall top five interests.
// Return only a JSON array of five strings, with no additional text.

// Partial Interests Arrays:
// ${JSON.stringify(partialInterestsArrays)}
// `;
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 40,
//       temperature: 0.2
//     })
//   });
//   const responseText = await response.text();
//   console.log("Response from GPT-4 (final interests aggregation):", responseText);
//   if (!response.ok)
//     throw new Error(`OpenAI Aggregation API error (interests): ${responseText}`);
//   const data = JSON.parse(responseText);
//   try {
//     let content = data.choices[0].message.content.trim();
//     content = content.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
//     return JSON.parse(content);
//   } catch (error) {
//     console.warn("Error parsing final interests:", error);
//     return [];
//   }
// }

// // ---------------------
// // Data Fetching Functions
// // ---------------------
// async function fetchUserData(username) {
//   console.log(`Fetching posts for ${username}`);
//   const postsRes = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/profilePosts?username=${username}`
//   );
//   const postsText = await postsRes.text();
//   console.log("Posts Response:", postsText);
//   if (!postsRes.ok) throw new Error('Failed to fetch posts data');
//   const postsData = JSON.parse(postsText);
//   const posts = postsData.data?.items || [];

//   const commentPromises = posts.map(async post => {
//     if (!post.id) return [];
//     console.log(`Fetching comments for post ${post.id}`);
//     const commentsRes = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/postComments?postId=${post.id}`
//     );
//     const commentsText = await commentsRes.text();
//     console.log(`Comments for post ${post.id}:`, commentsText);
//     if (commentsRes.ok) {
//       const cData = JSON.parse(commentsText);
//       return cData.comments || [];
//     }
//     return [];
//   });
//   const allCommentsArray = await Promise.all(commentPromises);
//   const allComments = allCommentsArray.flat();
//   return {
//     posts: simplifyData(posts, 'post'),
//     comments: simplifyData(allComments, 'comment')
//   };
// }

// async function fetchProfileDetails(username) {
//   console.log(`Fetching profile details for ${username}`);
//   const detailsRes = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/profileDetails?username=${username}`
//   );
//   const detailsText = await detailsRes.text();
//   console.log("Profile Details Response:", detailsText);
//   if (!detailsRes.ok) throw new Error('Failed to fetch profile details');
//   return JSON.parse(detailsText);
// }


// // Helper: Determine a label based on SightEngine analysis.
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



//   // Return a comma-separated string of labels.
//   // return labels.join(", ");
// // }

// // ---------------------
// // Sight Engine Image Analysis Helper
// // ---------------------
// async function analyzeImageWithSightEngine(imageUrl) {
//   const apiUser = '1445178053';
//   const apiSecret = 'ktwUL8eshaAri6pBXFHhdtcsm77n7BhF';
//   const endpoint = 'https://api.sightengine.com/1.0/check.json';
//   const params = new URLSearchParams({
//     api_user: apiUser,
//     api_secret: apiSecret,
//     models: 'nudity,wad,offensive',
//     url: imageUrl
//   });
//   const url = `${endpoint}?${params.toString()}`;
//   console.log(`Analyzing image with URL: ${imageUrl}`);
  
//   const response = await fetch(url);
//   const responseText = await response.text();
//   console.log(`Sight Engine response for ${imageUrl}:`, responseText);
//   if (!response.ok)
//     throw new Error(`Sight Engine API error for ${imageUrl}: ${responseText}`);
  
//   const analysis = JSON.parse(responseText);
//   // Use the helper to compute the label based on the analysis.
//   const label = getSightEngineLabel(analysis);
//     // Log the computed label to the console
//     console.log(`Computed label for ${imageUrl}:`, label);
//   // Return the image URL, the full analysis, and the computed label.
//   return { imageUrl, analysis, label };
// }


// // ---------------------
// // Main API Handler
// // ---------------------
// export default async function handler(req, res) {
//   const { username } = req.query;
//   if (!username)
//     return res.status(400).json({ error: 'Username is required' });

//   try {
//     // Fetch posts, comments, and profile details for the main user.
//     const { posts, comments } = await fetchUserData(username);
//     const profileDetails = await fetchProfileDetails(username);
//     const engagementMetrics = aggregateEngagement(posts, comments);
//     const combinedData = [...posts, ...comments];
//     const chunks = chunkArray(combinedData); // Default chunk size now 5

//     // Risk and Interests Analysis
//     const riskPromises = chunks.map(chunk =>
//       getRiskForChunk(chunk, engagementMetrics, profileDetails)
//     );
//     const interestsPromises = chunks.map(chunk =>
//       getInterestsForChunk(chunk, engagementMetrics, profileDetails)
//     );
//     const partialRiskScores = await Promise.all(riskPromises);
//     const partialInterestsArrays = await Promise.all(interestsPromises);
//     const finalRiskScore = await getFinalRiskScore(partialRiskScores);
//     const finalInterests = await getFinalInterests(partialInterestsArrays);

//     // Calculate interest percentages
//     const aggregatedInterests = partialInterestsArrays.flat();
//     const interestCounts = aggregatedInterests.reduce((acc, interest) => {
//       const key = interest.trim().toLowerCase();
//       acc[key] = (acc[key] || 0) + 1;
//       return acc;
//     }, {});
//     const totalInterests = aggregatedInterests.length;
//     const interestPercentages = Object.keys(interestCounts).map(interest => ({
//       interest,
//       percentage: ((interestCounts[interest] / totalInterests) * 100).toFixed(2)
//     }));
//     interestPercentages.sort((a, b) => b.percentage - a.percentage);
//     const topFiveInterestsWithPercentage = interestPercentages.slice(0, 5);

//     // Relationship Analysis with aggregation of responses
//     const relationshipChunks = chunkArray(combinedData);
//     const relationshipsPromises = relationshipChunks.map(chunk =>
//       getRelationshipsForChunk(chunk, engagementMetrics, profileDetails)
//     );
//     const partialRelationships = await Promise.all(relationshipsPromises);
    
//     // Aggregate counts for each username and each relationship type, using engagement as weight.
//     const relationshipCounts = {};
//     partialRelationships.forEach(chunkResp => {
//       Object.entries(chunkResp).forEach(([user, rel]) => {
//         if (!relationshipCounts[user]) {
//           relationshipCounts[user] = { Family: 0, "Girlfriend/Wife": 0, Associate: 0, Friend: 0 };
//         }
//         const weight = (engagementMetrics[user]?.likes || 0) + (engagementMetrics[user]?.comments || 0) || 1;
//         if (rel in relationshipCounts[user]) {
//           relationshipCounts[user][rel] += weight;
//         }
//       });
//     });
    
//     // Decide final classification and determine profile image for each relationship user.
//     // const finalRelationships = {};
//     // Object.entries(relationshipCounts).forEach(([user, counts]) => {
//     //   if (user.startsWith("unknown_")) return;
//     //   let relationshipType = "";
//     //   if (counts.Family > 0) {
//     //     relationshipType = "Family";
//     //   } 
//     //   // else if (counts["Girlfriend/Wife"] > 0) {
//     //   //   relationshipType = "Girlfriend/Wife";
//     //   // } 
//     //   else if (counts["Girlfriend/Wife"] > 0 || counts["Boyfriend/Husband"] > 0) {
//     //     // Choose the relationship type with the higher count
//     //     relationshipType = counts["Girlfriend/Wife"] >= counts["Boyfriend/Husband"]
//     //       ? "Girlfriend/Wife"
//     //       : "Boyfriend/Husband";
//     //   }
//     //   else if (counts.Associate > counts.Friend) {
//     //     relationshipType = "Associate";
//     //   } else {
//     //     relationshipType = "Friend";
//     //   }
      
//     //   // For related users, try to get their profile image from available sources:
//     //   let profileImage = "";
//     //   // 1. Check if the posts' tags contain this user's profile image.
//     //   profileImage = posts.reduce((acc, post) => {
//     //     const tag = post.tags.find(t => t.username === user);
//     //     return (tag && tag.profileImage) ? tag.profileImage : acc;
//     //   }, "");
//     //   // 2. If still not available, use a default placeholder.
//     //   if (!profileImage) {
//     //     profileImage = "https://example.com/default-profile.png";
//     //   }
      
//     //   finalRelationships[user] = {
//     //     relationship: relationshipType,
//     //     profileImage
//     //   };
//     // });
    

//     // Decide final classification and determine profile image for each relationship user.
// const finalRelationships = {};
// Object.entries(relationshipCounts).forEach(([user, counts]) => {
//   if (user.startsWith("unknown_")) return;
//   let relationshipType = "";
//   if (counts.Family > 0) {
//     relationshipType = "Family";
//   } else if (counts["Girlfriend/Wife"] > 0 || counts["Boyfriend/Husband"] > 0) {
//     relationshipType = counts["Girlfriend/Wife"] >= counts["Boyfriend/Husband"]
//       ? "Girlfriend/Wife"
//       : "Boyfriend/Husband";
//   } else if (counts.Associate > counts.Friend) {
//     relationshipType = "Associate";
//   } else {
//     relationshipType = "Friend";
//   }
  
//   // Retrieve profile image from posts' tags for this user.
//   let profileImage = posts.reduce((acc, post) => {
//     const tag = post.tags.find(t => t.username === user);
//     return (tag && tag.profileImage) ? tag.profileImage : acc;
//   }, "");
  
//   // Fallback to default image if none found.
//   if (!profileImage) {
//     profileImage = "https://example.com/default-profile.png";
//   }
  
//   finalRelationships[user] = {
//     relationship: relationshipType,
//     profileImage
//   };
// });

//     const relationshipsOutput = Object.keys(finalRelationships).length > 0
//       ? finalRelationships
//       : "No relationships found";

//     // Include the main user's profile image from profileDetails.
//     const mainUserProfileImage = profileDetails.profileImage || "https://example.com/default-profile.png";

//     // Optional: Image Analysis if risk score is above threshold.
//     let imageAnalysisResults = [];
//     if (Number(finalRiskScore) > 60) {
//       const imagesToAnalyze = posts.filter(post => post.imageUrl).map(post => post.imageUrl);
//       console.log("Images selected for analysis:", imagesToAnalyze);
//       if (imagesToAnalyze.length > 0) {
//         imageAnalysisResults = await Promise.all(
//           imagesToAnalyze.map(imageUrl => analyzeImageWithSightEngine(imageUrl))
//         );
//       }
//     }

//     // Final consolidated response now includes the main user's profile image.
//     res.status(200).json({
//       finalAnalysis: finalRiskScore,
//       topInterests: topFiveInterestsWithPercentage,
//       relationships: relationshipsOutput,
//       mainUserProfileImage, // Added main user profile picture here.
//       imageAnalysis: imageAnalysisResults
//     });
//   } catch (error) {
//     console.error("Error in riskScore handler:", error);
//     res.status(500).json({ error: error.message });
//   }
// }











// // More tagged user and relationship user profile pic
// function simplifyData(items, type) {
//   return items.map(item => {
//     const username =
//       item.username && item.username.trim() !== ''
//         ? item.username
//         : (item.fullName && item.fullName.trim() !== '' ? item.fullName : `unknown_${item.id}`);
//     if (type === 'post') {
//       return {
//         id: item.id,
//         caption: typeof item.caption === 'string' ? item.caption.slice(0, 500) : '',
//         likeCount: item.like_count,
//         username,
//         // Preserve any tags provided in the post (if they exist)
//         tags:
//           item.tags?.map(tag => {
//             const tagUsername =
//               tag.username && tag.username.trim() !== ''
//                 ? tag.username
//                 : (tag.fullName && tag.fullName.trim() !== '' ? tag.fullName : `unknown_${tag.id || 'tag'}`);
//             return {
//               username: tagUsername,
//               fullName: tag.fullName || '',
//               profileImage: tag.profileImage || '',
//               gender: tag.gender || ''
//             };
//           }) || [],
//         // New field: Extract tagged_users from the API response (if available)
//         taggedUsers:
//           item.tagged_users && item.tagged_users.length > 0
//             ? item.tagged_users.map(tagged => {
//                 return {
//                   username: tagged.user.username || '',
//                   fullName: tagged.user.full_name || '',
//                   profileImage: tagged.user.profile_pic_url || ''
//                 };
//               })
//             : [],
//         imageUrl:
//           item.imageUrl ||
//           (item.image_versions &&
//             item.image_versions.items &&
//             item.image_versions.items.length > 0
//               ? item.image_versions.items[0].url
//               : null)
//       };
//     } else if (type === 'comment') {
//       return {
//         id: item.id,
//         text: typeof item.text === 'string' ? item.text.slice(0, 500) : '',
//         username,
//         likeCount: item.like_count || 0
//       };
//     }
//     return item;
//   });
// }

// function aggregateEngagement(posts, comments) {
//   const engagement = {};
//   posts.forEach(post => {
//     const user = post.username;
//     if (user) {
//       engagement[user] = engagement[user] || { likes: 0, comments: 0 };
//       engagement[user].likes += post.likeCount;
//     }
//     post.tags.forEach(tag => {
//       const tagUser = tag.username;
//       if (tagUser) {
//         engagement[tagUser] = engagement[tagUser] || { likes: 0, comments: 0 };
//         engagement[tagUser].likes += Math.floor(post.likeCount / 2);
//       }
//     });
//   });
//   comments.forEach(comment => {
//     const user = comment.username;
//     if (user) {
//       engagement[user] = engagement[user] || { likes: 0, comments: 0 };
//       engagement[user].comments += 1;
//       engagement[user].likes += comment.likeCount;
//     }
//   });
//   return engagement;
// }

// function chunkArray(arr, chunkSize = 5) {
//   const chunks = [];
//   for (let i = 0; i < arr.length; i += chunkSize) {
//     chunks.push(arr.slice(i, i + chunkSize));
//   }
//   return chunks;
// }

// function isValidRiskScore(score) {
//   const num = Number(score);
//   return !isNaN(num) && num >= 0 && num <= 100;
// }

// function extractValidJSON(text) {
//   const startIndex = text.indexOf('{');
//   if (startIndex === -1) return null;
//   let openBraces = 0;
//   let endIndex = startIndex;
//   for (let i = startIndex; i < text.length; i++) {
//     if (text[i] === '{') openBraces++;
//     if (text[i] === '}') openBraces--;
//     if (openBraces === 0) {
//       endIndex = i;
//       break;
//     }
//   }
//   return text.substring(startIndex, endIndex + 1);
// }

// // ---------------------
// // GPT-4 Analysis Functions
// // ---------------------
// async function getRiskForChunk(chunk, aggregatedData, profileDetails) {
//   const jsonData = JSON.stringify({
//     data: chunk,
//     engagementMetrics: aggregatedData,
//     profileDetails
//   });
//   const prompt = 
// `You are a seasoned intelligence analyst evaluating the risk level of a social media profile.
// Based on the JSON data below, calculate a risk score between 0 (minimal risk) and 100 (very high risk).
// The instructions are:
// 1. If the profile is normal and exhibits little or no concerning activity, assign a risk score that is moderate and low. In such cases, the risk score should not exceed 20–30.
// 2. Only if the data indicates significant signs of concerning activity should the risk score be high (above 60).
// 3. Return only the risk score as a single number with no extra text.

// Data: ${jsonData}`;

//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json', 
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 20,
//       temperature: 0.2
//     })
//   });
//   const responseText = await response.text();
//   if (!response.ok)
//     throw new Error(`OpenAI API error (risk chunk): ${responseText}`);
//   const dataResp = JSON.parse(responseText);
//   const score = dataResp.choices[0].message.content.trim();
//   if (!isValidRiskScore(score)) console.warn("Invalid risk score received:", score);
//   return score;
// }

// async function getInterestsForChunk(chunk, aggregatedData, profileDetails) {
//   const jsonData = JSON.stringify({
//     data: chunk,
//     engagementMetrics: aggregatedData,
//     profileDetails
//   });
//   const prompt =
// // `You are a social media analyst. Analyze the JSON data below to identify recurring themes or keywords that suggest the user's interests.
// // Return a valid JSON array of up to five strings representing the top interests with no extra text.

// // Data: ${jsonData}`;
// `You are a social media analyst tasked with identifying the core interests of a user based on their activity data. An interest should reflect a recurring theme or subject found consistently across posts, comments, and other interactions, rather than isolated or ambiguous references. Follow these rules:
// 1. Analyze the JSON data below and focus on keywords or phrases that appear frequently.
// 2. Disregard incidental or one-off terms.
// 3. Choose up to five interests that best represent a pattern in the user’s engagement and content.
// 4. Return only a valid JSON array of up to five strings, where each string is a clear and concise interest, with no additional text.

// Data: ${jsonData}`;
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 60,
//       temperature: 0.2
//     })
//   });
//   const responseText = await response.text();
//   if (!response.ok)
//     throw new Error(`OpenAI API error (interests chunk): ${responseText}`);
//   const dataResp = JSON.parse(responseText);
//   try {
//     let content = dataResp.choices[0].message.content.trim();
//     content = content.replace(/^```(?:json\s*)?/, '').replace(/```$/, '').trim();
//     return JSON.parse(content);
//   } catch (error) {
//     console.warn("Error parsing interests:", error);
//     return [];
//   }
// }

// async function getRelationshipsForChunk(chunk, aggregatedData, profileDetails) {
//   const jsonData = JSON.stringify({
//     data: chunk,
//     engagementMetrics: aggregatedData,
//     profileDetails,
//     note: "For any user with a username starting with 'unknown_', treat the data as incomplete. Use any available metadata such as fullName or gender to classify the relationship."
//   });
//   const prompt = 
// `You are a seasoned intelligence analyst. Analyze the JSON data below and determine the relationships between the target user and their most engaged and tagged users.
// Follow these detailed rules:
// 1. Family Members: If two or more users are tagged in the same photo and share the same last name (extracted from their fullName), classify them as "Family".
// 2. Romantic Partner:
//    - If the target user's profile details indicate a male gender, then:
//        * If a female user is tagged in multiple posts with high frequency, classify her as "Girlfriend/Wife".
//        * If a male user is tagged in multiple posts with high frequency, classify him as "Boyfriend/Husband".
//    - If the target user's profile details indicate a female gender, then:
//        * If a male user is tagged in multiple posts with high frequency, classify him as "Boyfriend/Husband".
// 3. Associates: If business-related comments or multiple interactions (e.g., a combination of likes and comments) are evident, classify as "Associate".
// 4. Friends: Otherwise, classify as "Friend".
// **IMPORTANT:** Output only a valid JSON object without any markdown formatting or extra text.
// The JSON should map each username to one of these exact strings: "Family", "Girlfriend/Wife", "Boyfriend/Husband", "Associate", or "Friend". If no relationships can be determined, output {}.
// Data: ${jsonData}`;
  
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 200,
//       temperature: 0.2
//     })
//   });
  
//   const responseText = await response.text();
//   if (!response.ok)
//     throw new Error(`OpenAI API error (relationships chunk): ${responseText}`);
  
//   const dataResp = JSON.parse(responseText);
//   let content = dataResp.choices[0].message.content.trim();
//   content = content.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
//   try {
//     return JSON.parse(content);
//   } catch (error) {
//     console.warn("Error parsing relationships:", error);
//     const extracted = extractValidJSON(content);
//     if (extracted) {
//       try {
//         return JSON.parse(extracted);
//       } catch (err) {
//         console.warn("Fallback JSON parsing failed:", err);
//       }
//     }
//     return {};
//   }
// }

// async function getFinalRiskScore(partialScores) {
//   const combinedScores = partialScores.join("\n");
//   const prompt =
// `You are a seasoned intelligence analyst. Given the following partial risk scores, consolidate them into a final risk score between 0 and 100.
// Return only the final risk score with no extra text.

// Partial Risk Scores:
// ${combinedScores}`;
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 20,
//       temperature: 0.2
//     })
//   });
//   const responseText = await response.text();
//   if (!response.ok)
//     throw new Error(`OpenAI Aggregation API error (risk): ${responseText}`);
//   const dataResp = JSON.parse(responseText);
//   const finalScore = dataResp.choices[0].message.content.trim();
//   if (!isValidRiskScore(finalScore))
//     console.warn("Invalid final risk score received:", finalScore);
//   return finalScore;
// }

// async function getFinalInterests(partialInterestsArrays) {
//   const prompt =
// `You are a social media analyst. Given the following arrays of interests, consolidate them to determine the overall top five interests of the user.
// Return only a JSON array of up to five strings with no extra text.

// Partial Interests Arrays:
// ${JSON.stringify(partialInterestsArrays)}`;
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-2024-08-06',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 60,
//       temperature: 0.2
//     })
//   });
//   const responseText = await response.text();
//   if (!response.ok)
//     throw new Error(`OpenAI Aggregation API error (interests): ${responseText}`);
//   const dataResp = JSON.parse(responseText);
//   try {
//     let content = dataResp.choices[0].message.content.trim();
//     content = content.replace(/^```(?:json\s*)?/, '').replace(/```$/, '').trim();
//     const interests = JSON.parse(content);
//     return interests.length > 0 ? interests : ["travel", "food", "music", "sports", "technology"];
//   } catch (error) {
//     console.warn("Error parsing final interests:", error);
//     return ["travel", "food", "music", "sports", "technology"];
//   }
// }

// // ---------------------
// // Data Fetching Functions with Pagination
// // ---------------------
// async function fetchUserData(username) {
//   let allPosts = [];
//   const maxPages = 5;
//   for (let page = 1; page <= maxPages; page++) {
//     const postsRes = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/profilePosts?username=${username}&page=${page}`
//     );
//     if (!postsRes.ok) {
//       console.warn(`Failed to fetch posts on page ${page}`);
//       break;
//     }
//     const postsData = await postsRes.json();
//     const posts = postsData.data?.items || [];
//     if (posts.length === 0) break;
//     allPosts = allPosts.concat(posts);
//   }

//   let allComments = [];
//   const commentPromises = allPosts.map(async post => {
//     if (!post.id) return [];
//     const commentsRes = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/postComments?postId=${post.id}`
//     );
//     if (!commentsRes.ok) {
//       console.warn(`Failed to fetch comments for post ${post.id}`);
//       return [];
//     }
//     const cData = await commentsRes.json();
//     return cData.comments || [];
//   });
//   const commentsArray = await Promise.all(commentPromises);
//   allComments = commentsArray.flat();

//   return {
//     posts: simplifyData(allPosts, 'post'),
//     comments: simplifyData(allComments, 'comment')
//   };
// }

// async function fetchProfileDetails(username) {
//   const detailsRes = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/profileDetails?username=${username}`
//   );
//   const detailsText = await detailsRes.text();
//   if (!detailsRes.ok) throw new Error('Failed to fetch profile details');
//   return JSON.parse(detailsText);
// }

// // ---------------------
// // Sight Engine Image Analysis Helper
// // ---------------------
// function getSightEngineLabel(analysis) {
//   const labels = [];
//   if (analysis.nudity && analysis.nudity.safe < 0.8) {
//     labels.push("adult content");
//   }
//   if (analysis.offensive && analysis.offensive.prob > 0.01) {
//     labels.push("offensive");
//   }
//   if (analysis.weapon && analysis.weapon > 0.005) {
//     labels.push("weapon");
//   }
//   if (analysis.drugs && analysis.drugs > 0.005) {
//     labels.push("drugs");
//   }
//   if (labels.length === 0) {
//     labels.push("safe");
//   }
//   return labels.join(", ");
// }

// async function analyzeImageWithSightEngine(imageUrl) {
//   const apiUser = '150452328';
//   const apiSecret = 'uEzhj5Q2FVbg4jfnB4mRc84cdRqTpz4m';
//   const endpoint = 'https://api.sightengine.com/1.0/check.json';
//   const params = new URLSearchParams({
//     api_user: apiUser,
//     api_secret: apiSecret,
//     models: 'nudity,wad,offensive',
//     url: imageUrl
//   });
//   const url = `${endpoint}?${params.toString()}`;
  
//   const response = await fetch(url);
//   const responseText = await response.text();
//   if (!response.ok)
//     throw new Error(`Sight Engine API error for ${imageUrl}: ${responseText}`);
  
//   const analysis = JSON.parse(responseText);
//   const label = getSightEngineLabel(analysis);
//   return { imageUrl, analysis, label };
// }

// // ---------------------
// // Main API Handler
// // ---------------------
// export default async function handler(req, res) {
//   const { username } = req.query;
//   if (!username)
//     return res.status(400).json({ error: 'Username is required' });

//   try {
//     // Fetch posts, comments, and profile details.
//     const { posts, comments } = await fetchUserData(username);
//     const profileDetails = await fetchProfileDetails(username);
//     const engagementMetrics = aggregateEngagement(posts, comments);
//     const combinedData = [...posts, ...comments];
//     const chunks = chunkArray(combinedData); // Uses chunk size of 5

//     // Risk and Interests Analysis
//     const riskPromises = chunks.map(chunk =>
//       getRiskForChunk(chunk, engagementMetrics, profileDetails)
//     );
//     const interestsPromises = chunks.map(chunk =>
//       getInterestsForChunk(chunk, engagementMetrics, profileDetails)
//     );
//     const partialRiskScores = await Promise.all(riskPromises);
//     const partialInterestsArrays = await Promise.all(interestsPromises);
//     const finalRiskScore = await getFinalRiskScore(partialRiskScores);
//     const finalInterests = await getFinalInterests(partialInterestsArrays);

//     // Calculate interest percentages
//     const aggregatedInterests = partialInterestsArrays.flat();
//     const interestCounts = aggregatedInterests.reduce((acc, interest) => {
//       const key = interest.trim().toLowerCase();
//       acc[key] = (acc[key] || 0) + 1;
//       return acc;
//     }, {});
//     const totalInterests = aggregatedInterests.length;
//     const interestPercentages = Object.keys(interestCounts).map(interest => ({
//       interest,
//       percentage: ((interestCounts[interest] / totalInterests) * 100).toFixed(2)
//     }));
//     interestPercentages.sort((a, b) => b.percentage - a.percentage);
//     const topFiveInterestsWithPercentage = interestPercentages.slice(0, 5);

//     // ---------------------
//     // Relationship Analysis (chunk-based)
//     // ---------------------
//     // Build a lookup for all tagged images from posts
//     const taggedLookup = {};
//     posts.forEach(post => {
//       // Check "tags" array
//       if (post.tags && post.tags.length > 0) {
//         post.tags.forEach(tag => {
//           const tagUsername = tag.username?.trim();
//           if (tagUsername && tag.profileImage) {
//             if (!taggedLookup[tagUsername]) {
//               taggedLookup[tagUsername] = tag.profileImage;
//             }
//           }
//         });
//       }
//       // Check "taggedUsers" array
//       if (post.taggedUsers && post.taggedUsers.length > 0) {
//         post.taggedUsers.forEach(tagged => {
//           const tagUsername = tagged.username?.trim();
//           if (tagUsername && tagged.profileImage) {
//             if (!taggedLookup[tagUsername]) {
//               taggedLookup[tagUsername] = tagged.profileImage;
//             }
//           }
//         });
//       }
//     });

//     const relationshipChunks = chunkArray(combinedData);
//     const relationshipsPromises = relationshipChunks.map(chunk =>
//       getRelationshipsForChunk(chunk, engagementMetrics, profileDetails)
//     );
//     const partialRelationships = await Promise.all(relationshipsPromises);

//     // Aggregate relationship counts weighted by engagement.
//     const relationshipCounts = {};
//     partialRelationships.forEach(chunkResp => {
//       Object.entries(chunkResp).forEach(([user, rel]) => {
//         if (!relationshipCounts[user]) {
//           relationshipCounts[user] = { Family: 0, "Girlfriend/Wife": 0, "Boyfriend/Husband": 0, Associate: 0, Friend: 0 };
//         }
//         const weight = ((engagementMetrics[user]?.likes || 0) + (engagementMetrics[user]?.comments || 0)) || 1;
//         if (rel in relationshipCounts[user]) {
//           relationshipCounts[user][rel] += weight;
//         }
//       });
//     });

//     // Build initial finalRelationships map using the taggedLookup
//     const defaultImage = "/no-profile-pic-img.png";
//     const finalRelationships = {};
//     Object.entries(relationshipCounts).forEach(([user, counts]) => {
//       if (user.startsWith("unknown_")) return;
//       let relationshipType = "";
//       if (counts.Family > 0) {
//         relationshipType = "Family";
//       } else if (counts["Girlfriend/Wife"] > 0 || counts["Boyfriend/Husband"] > 0) {
//         relationshipType = counts["Girlfriend/Wife"] >= counts["Boyfriend/Husband"]
//           ? "Girlfriend/Wife"
//           : "Boyfriend/Husband";
//       } else if (counts.Associate > counts.Friend) {
//         relationshipType = "Associate";
//       } else {
//         relationshipType = "Friend";
//       }

//       // Use the lookup; fallback to iterating posts; finally, defaultImage if none
//       let profileImage = taggedLookup[user] || posts.reduce((acc, post) => {
//         let tagFound = post.tags && post.tags.find(t => t.username === user);
//         if (!tagFound && post.taggedUsers) {
//           tagFound = post.taggedUsers.find(t => t.username === user);
//         }
//         return (tagFound && tagFound.profileImage) ? tagFound.profileImage : acc;
//       }, "");

//       finalRelationships[user] = {
//         username: user,
//         relationship: relationshipType,
//         profileImage: profileImage || defaultImage
//       };
//     });

//     // --- NEW: Update with official profile details if available.
//     const relationshipUsernames = Object.keys(finalRelationships);
//     const profileDetailsArr = await Promise.all(
//       relationshipUsernames.map(un => fetchProfileDetails(un).catch(() => ({})))
//     );
//     relationshipUsernames.forEach((un, idx) => {
//       const details = profileDetailsArr[idx] || {};
//       finalRelationships[un].profileImage =
//         details.profileImage || finalRelationships[un].profileImage;
//     });

//     const relationshipsOutput = Object.keys(finalRelationships).length > 0
//       ? finalRelationships
//       : "No relationships found";

//     // Main user profile image from profileDetails.
//     const mainUserProfileImage = profileDetails.profileImage || defaultImage;

//     // Optionally perform image analysis if the final risk score is high.
//     let imageAnalysisResults = [];
//     if (Number(finalRiskScore) > 60) {
//       const imagesToAnalyze = posts.filter(post => post.imageUrl).map(post => post.imageUrl);
//       if (imagesToAnalyze.length > 0) {
//         imageAnalysisResults = await Promise.all(
//           imagesToAnalyze.map(imageUrl => analyzeImageWithSightEngine(imageUrl))
//         );
//       }
//     }

//     // Return everything
//     res.status(200).json({
//       finalAnalysis: finalRiskScore,
//       topInterests: topFiveInterestsWithPercentage,
//       relationships: relationshipsOutput,
//       mainUserProfileImage,
//       imageAnalysis: imageAnalysisResults
//     });
//   } catch (error) {
//     console.error("Error in riskScore handler:", error);
//     res.status(500).json({ error: error.message });
//   }
// }




// ---------------------
// Data Simplification Functions
// ---------------------
function simplifyData(items, type) {
  return items.map(item => {
    const username =
      item.username && item.username.trim() !== ''
        ? item.username
        : (item.fullName && item.fullName.trim() !== '' ? item.fullName : `unknown_${item.id}`);
    if (type === 'post') {
      return {
        id: item.id,
        caption: typeof item.caption === 'string' ? item.caption.slice(0, 500) : '',
        likeCount: item.like_count,
        username,
        tags:
          item.tags?.map(tag => {
            const tagUsername =
              tag.username && tag.username.trim() !== ''
                ? tag.username
                : (tag.fullName && tag.fullName.trim() !== '' ? tag.fullName : `unknown_${tag.id || 'tag'}`);
            return {
              username: tagUsername,
              fullName: tag.fullName || '',
              profileImage: tag.profileImage || '',
              gender: tag.gender || ''
            };
          }) || [],
        taggedUsers:
          item.tagged_users && item.tagged_users.length > 0
            ? item.tagged_users.map(tagged => {
                return {
                  username: tagged.user.username || '',
                  fullName: tagged.user.full_name || '',
                  profileImage: tagged.user.profile_pic_url || ''
                };
              })
            : [],
        imageUrl:
          item.imageUrl ||
          (item.image_versions &&
            item.image_versions.items &&
            item.image_versions.items.length > 0
              ? item.image_versions.items[0].url
              : null)
      };
    } else if (type === 'comment') {
      return {
        id: item.id,
        text: typeof item.text === 'string' ? item.text.slice(0, 500) : '',
        username,
        likeCount: item.like_count || 0
      };
    }
    return item;
  });
}

function aggregateEngagement(posts, comments) {
  const engagement = {};
  posts.forEach(post => {
    const user = post.username;
    if (user) {
      engagement[user] = engagement[user] || { likes: 0, comments: 0 };
      engagement[user].likes += post.likeCount;
    }
    post.tags.forEach(tag => {
      const tagUser = tag.username;
      if (tagUser) {
        engagement[tagUser] = engagement[tagUser] || { likes: 0, comments: 0 };
        engagement[tagUser].likes += Math.floor(post.likeCount / 2);
      }
    });
  });
  comments.forEach(comment => {
    const user = comment.username;
    if (user) {
      engagement[user] = engagement[user] || { likes: 0, comments: 0 };
      engagement[user].comments += 1;
      engagement[user].likes += comment.likeCount;
    }
  });
  return engagement;
}

function chunkArray(arr, chunkSize = 5) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

function isValidRiskScore(score) {
  const num = Number(score);
  return !isNaN(num) && num >= 0 && num <= 100;
}

function extractValidJSON(text) {
  const startIndex = text.indexOf('{');
  if (startIndex === -1) return null;
  let openBraces = 0;
  let endIndex = startIndex;
  for (let i = startIndex; i < text.length; i++) {
    if (text[i] === '{') openBraces++;
    if (text[i] === '}') openBraces--;
    if (openBraces === 0) {
      endIndex = i;
      break;
    }
  }
  return text.substring(startIndex, endIndex + 1);
}

// ---------------------
// GPT-4 Analysis Functions
// ---------------------
async function getRiskForChunk(chunk, aggregatedData, profileDetails) {
  const jsonData = JSON.stringify({
    data: chunk,
    engagementMetrics: aggregatedData,
    profileDetails
  });
  const prompt = 
`You are a seasoned intelligence analyst evaluating the risk level of a social media profile.
Based on the JSON data below, calculate a risk score between 0 (minimal risk) and 100 (very high risk).
The instructions are:
1. If the profile is normal and exhibits little or no concerning activity, assign a risk score that is moderate and low. In such cases, the risk score should not exceed 20–30.
2. Only if the data indicates significant signs of concerning activity should the risk score be high (above 60).
3. Return only the risk score as a single number with no extra text.

Data: ${jsonData}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
    },
    body: JSON.stringify({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 20,
      temperature: 0.2
    })
  });
  const responseText = await response.text();
  if (!response.ok)
    throw new Error(`OpenAI API error (risk chunk): ${responseText}`);
  const dataResp = JSON.parse(responseText);
  const score = dataResp.choices[0].message.content.trim();
  if (!isValidRiskScore(score)) console.warn("Invalid risk score received:", score);
  return score;
}

async function getInterestsForChunk(chunk, aggregatedData, profileDetails) {
  const jsonData = JSON.stringify({
    data: chunk,
    engagementMetrics: aggregatedData,
    profileDetails
  });
  // Modified prompt with weights. This prompt instructs the analyzer to return each interest with a weight (1 to 10).
  const prompt =
`You are a social media analyst tasked with identifying the core interests of a user based on their activity data. For each interest, assign a weight between 1 and 10 indicating its prominence in the user's engagement. Return a valid JSON array of objects, each with the keys "interest" (a string) and "weight" (a number). Do not include any extra text.

Data: ${jsonData}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
    },
    body: JSON.stringify({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 80,
      temperature: 0.2
    })
  });
  const responseText = await response.text();
  if (!response.ok)
    throw new Error(`OpenAI API error (interests chunk): ${responseText}`);
  const dataResp = JSON.parse(responseText);
  try {
    let content = dataResp.choices[0].message.content.trim();
    content = content.replace(/^```(?:json\s*)?/, '').replace(/```$/, '').trim();
    return JSON.parse(content);
  } catch (error) {
    console.warn("Error parsing interests:", error);
    return [];
  }
}

async function getRelationshipsForChunk(chunk, aggregatedData, profileDetails) {
  const jsonData = JSON.stringify({
    data: chunk,
    engagementMetrics: aggregatedData,
    profileDetails,
    note: "For any user with a username starting with 'unknown_', treat the data as incomplete. Use any available metadata such as fullName or gender to classify the relationship."
  });
  const prompt = 
`You are a seasoned intelligence analyst. Analyze the JSON data below and determine the relationships between the target user and their most engaged and tagged users.
Follow these detailed rules:
1. Family Members: If two or more users are tagged in the same photo and share the same last name (extracted from their fullName), classify them as "Family".
2. Romantic Partner:
   - If the target user's profile details indicate a male gender, then:
       * If a female user is tagged in multiple posts with high frequency, classify her as "Girlfriend/Wife".
       * If a male user is tagged in multiple posts with high frequency, classify him as "Boyfriend/Husband".
   - If the target user's profile details indicate a female gender, then:
       * If a male user is tagged in multiple posts with high frequency, classify him as "Boyfriend/Husband".
3. Associates: If business-related comments or multiple interactions (e.g., a combination of likes and comments) are evident, classify as "Associate".
4. Friends: Otherwise, classify as "Friend".
**IMPORTANT:** Output only a valid JSON object without any markdown formatting or extra text.
The JSON should map each username to one of these exact strings: "Family", "Girlfriend/Wife", "Boyfriend/Husband", "Associate", or "Friend". If no relationships can be determined, output {}.
Data: ${jsonData}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.2
    })
  });
  
  const responseText = await response.text();
  if (!response.ok)
    throw new Error(`OpenAI API error (relationships chunk): ${responseText}`);
  
  const dataResp = JSON.parse(responseText);
  let content = dataResp.choices[0].message.content.trim();
  content = content.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(content);
  } catch (error) {
    console.warn("Error parsing relationships:", error);
    const extracted = extractValidJSON(content);
    if (extracted) {
      try {
        return JSON.parse(extracted);
      } catch (err) {
        console.warn("Fallback JSON parsing failed:", err);
      }
    }
    return {};
  }
}

async function getFinalRiskScore(partialScores) {
  const combinedScores = partialScores.join("\n");
  const prompt =
`You are a seasoned intelligence analyst. Given the following partial risk scores, consolidate them into a final risk score between 0 and 100.
Return only the final risk score with no extra text.

Partial Risk Scores:
${combinedScores}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
    },
    body: JSON.stringify({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 20,
      temperature: 0.2
    })
  });
  const responseText = await response.text();
  if (!response.ok)
    throw new Error(`OpenAI Aggregation API error (risk): ${responseText}`);
  const dataResp = JSON.parse(responseText);
  const finalScore = dataResp.choices[0].message.content.trim();
  if (!isValidRiskScore(finalScore))
    console.warn("Invalid final risk score received:", finalScore);
  return finalScore;
}

async function getFinalInterests(partialInterestsArrays) {
  const prompt =
`You are a social media analyst. Given the following arrays of weighted interests, consolidate them to determine the overall top five interests of the user.
Return only a JSON array of up to five strings with no extra text.

Partial Interests Arrays:
${JSON.stringify(partialInterestsArrays)}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
    },
    body: JSON.stringify({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.2
    })
  });
  const responseText = await response.text();
  if (!response.ok)
    throw new Error(`OpenAI Aggregation API error (interests): ${responseText}`);
  const dataResp = JSON.parse(responseText);
  try {
    let content = dataResp.choices[0].message.content.trim();
    content = content.replace(/^```(?:json\s*)?/, '').replace(/```$/, '').trim();
    const interests = JSON.parse(content);
    return interests.length > 0 ? interests : ["travel", "food", "music", "sports", "technology"];
  } catch (error) {
    console.warn("Error parsing final interests:", error);
    return ["travel", "food", "music", "sports", "technology"];
  }
}

// ---------------------
// Data Fetching Functions with Pagination
// ---------------------
async function fetchUserData(username) {
  let allPosts = [];
  const maxPages = 5;
  for (let page = 1; page <= maxPages; page++) {
    const postsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/profilePosts?username=${username}&page=${page}`
    );
    if (!postsRes.ok) {
      console.warn(`Failed to fetch posts on page ${page}`);
      break;
    }
    const postsData = await postsRes.json();
    const posts = postsData.data?.items || [];
    if (posts.length === 0) break;
    allPosts = allPosts.concat(posts);
  }

  let allComments = [];
  const commentPromises = allPosts.map(async post => {
    if (!post.id) return [];
    const commentsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/postComments?postId=${post.id}`
    );
    if (!commentsRes.ok) {
      console.warn(`Failed to fetch comments for post ${post.id}`);
      return [];
    }
    const cData = await commentsRes.json();
    return cData.comments || [];
  });
  const commentsArray = await Promise.all(commentPromises);
  allComments = commentsArray.flat();

  return {
    posts: simplifyData(allPosts, 'post'),
    comments: simplifyData(allComments, 'comment')
  };
}

async function fetchProfileDetails(username) {
  const detailsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/profileDetails?username=${username}`
  );
  const detailsText = await detailsRes.text();
  if (!detailsRes.ok) throw new Error('Failed to fetch profile details');
  return JSON.parse(detailsText);
}

// ---------------------
// Sight Engine Image Analysis Helper
// ---------------------
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

async function analyzeImageWithSightEngine(imageUrl) {
  const apiUser = '150452328';
  const apiSecret = 'uEzhj5Q2FVbg4jfnB4mRc84cdRqTpz4m';
  const endpoint = 'https://api.sightengine.com/1.0/check.json';
  const params = new URLSearchParams({
    api_user: apiUser,
    api_secret: apiSecret,
    models: 'nudity,wad,offensive',
    url: imageUrl
  });
  const url = `${endpoint}?${params.toString()}`;
  
  const response = await fetch(url);
  const responseText = await response.text();
  if (!response.ok)
    throw new Error(`Sight Engine API error for ${imageUrl}: ${responseText}`);
  
  const analysis = JSON.parse(responseText);
  const label = getSightEngineLabel(analysis);
  return { imageUrl, analysis, label };
}

// ---------------------
// Main API Handler
// ---------------------
export default async function handler(req, res) {
  const { username } = req.query;
  if (!username)
    return res.status(400).json({ error: 'Username is required' });

  try {
    // Fetch posts, comments, and profile details.
    const { posts, comments } = await fetchUserData(username);
    const profileDetails = await fetchProfileDetails(username);
    const engagementMetrics = aggregateEngagement(posts, comments);
    const combinedData = [...posts, ...comments];
    const chunks = chunkArray(combinedData); // Uses chunk size of 5

    // Risk and Interests Analysis
    const riskPromises = chunks.map(chunk =>
      getRiskForChunk(chunk, engagementMetrics, profileDetails)
    );
    const interestsPromises = chunks.map(chunk =>
      getInterestsForChunk(chunk, engagementMetrics, profileDetails)
    );
    const partialRiskScores = await Promise.all(riskPromises);
    const partialInterestsArrays = await Promise.all(interestsPromises);
    const finalRiskScore = await getFinalRiskScore(partialRiskScores);
    const finalInterests = await getFinalInterests(partialInterestsArrays);

    // ---------------------
    // Calculate weighted interest percentages
    // ---------------------
    // First, flatten weighted interests from all chunks
    const weightedInterests = partialInterestsArrays.flat();
    // Sum weights per interest (case-insensitive)
    const aggregatedWeights = {};
    weightedInterests.forEach(item => {
      const key = item.interest.trim().toLowerCase();
      const weight = Number(item.weight) || 1;
      aggregatedWeights[key] = (aggregatedWeights[key] || 0) + weight;
    });
    const totalWeight = Object.values(aggregatedWeights).reduce((sum, weight) => sum + weight, 0);
    const interestPercentages = Object.keys(aggregatedWeights).map(interest => ({
      interest,
      percentage: ((aggregatedWeights[interest] / totalWeight) * 100).toFixed(2)
    }));
    // Sort interests based on percentage (descending)
    interestPercentages.sort((a, b) => b.percentage - a.percentage);
    const topFiveInterestsWithPercentage = interestPercentages.slice(0, 5);

    // ---------------------
    // Relationship Analysis (chunk-based)
    // ---------------------
    // Build a lookup for all tagged images from posts
    const taggedLookup = {};
    posts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          const tagUsername = tag.username?.trim();
          if (tagUsername && tag.profileImage) {
            if (!taggedLookup[tagUsername]) {
              taggedLookup[tagUsername] = tag.profileImage;
            }
          }
        });
      }
      if (post.taggedUsers && post.taggedUsers.length > 0) {
        post.taggedUsers.forEach(tagged => {
          const tagUsername = tagged.username?.trim();
          if (tagUsername && tagged.profileImage) {
            if (!taggedLookup[tagUsername]) {
              taggedLookup[tagUsername] = tagged.profileImage;
            }
          }
        });
      }
    });

    const relationshipChunks = chunkArray(combinedData);
    const relationshipsPromises = relationshipChunks.map(chunk =>
      getRelationshipsForChunk(chunk, engagementMetrics, profileDetails)
    );
    const partialRelationships = await Promise.all(relationshipsPromises);

    // Aggregate relationship counts weighted by engagement.
    const relationshipCounts = {};
    partialRelationships.forEach(chunkResp => {
      Object.entries(chunkResp).forEach(([user, rel]) => {
        if (!relationshipCounts[user]) {
          relationshipCounts[user] = { Family: 0, "Girlfriend/Wife": 0, "Boyfriend/Husband": 0, Associate: 0, Friend: 0 };
        }
        const weight = ((engagementMetrics[user]?.likes || 0) + (engagementMetrics[user]?.comments || 0)) || 1;
        if (rel in relationshipCounts[user]) {
          relationshipCounts[user][rel] += weight;
        }
      });
    });

    // Build finalRelationships map using the taggedLookup
    const defaultImage = "/no-profile-pic-img.png";
    const finalRelationships = {};
    Object.entries(relationshipCounts).forEach(([user, counts]) => {
      if (user.startsWith("unknown_")) return;
      let relationshipType = "";
      if (counts.Family > 0) {
        relationshipType = "Family";
      } else if (counts["Girlfriend/Wife"] > 0 || counts["Boyfriend/Husband"] > 0) {
        relationshipType = counts["Girlfriend/Wife"] >= counts["Boyfriend/Husband"]
          ? "Girlfriend/Wife"
          : "Boyfriend/Husband";
      } else if (counts.Associate > counts.Friend) {
        relationshipType = "Associate";
      } else {
        relationshipType = "Friend";
      }

      let profileImage = taggedLookup[user] || posts.reduce((acc, post) => {
        let tagFound = post.tags && post.tags.find(t => t.username === user);
        if (!tagFound && post.taggedUsers) {
          tagFound = post.taggedUsers.find(t => t.username === user);
        }
        return (tagFound && tagFound.profileImage) ? tagFound.profileImage : acc;
      }, "");

      finalRelationships[user] = {
        username: user,
        relationship: relationshipType,
        profileImage: profileImage || defaultImage
      };
    });

    // Update finalRelationships with official profile details if available.
    const relationshipUsernames = Object.keys(finalRelationships);
    const profileDetailsArr = await Promise.all(
      relationshipUsernames.map(un => fetchProfileDetails(un).catch(() => ({})))
    );
    relationshipUsernames.forEach((un, idx) => {
      const details = profileDetailsArr[idx] || {};
      finalRelationships[un].profileImage =
        details.profileImage || finalRelationships[un].profileImage;
    });

    const relationshipsOutput = Object.keys(finalRelationships).length > 0
      ? finalRelationships
      : "No relationships found";

    // Main user profile image from profileDetails.
    const mainUserProfileImage = profileDetails.profileImage || defaultImage;

    // Optionally perform image analysis if the final risk score is high.
    let imageAnalysisResults = [];
    if (Number(finalRiskScore) > 60) {
      const imagesToAnalyze = posts.filter(post => post.imageUrl).map(post => post.imageUrl);
      if (imagesToAnalyze.length > 0) {
        imageAnalysisResults = await Promise.all(
          imagesToAnalyze.map(imageUrl => analyzeImageWithSightEngine(imageUrl))
        );
      }
    }

    // Return consolidated analysis
    res.status(200).json({
      finalAnalysis: finalRiskScore,
      topInterests: topFiveInterestsWithPercentage,
      relationships: relationshipsOutput,
      mainUserProfileImage,
      imageAnalysis: imageAnalysisResults
    });
  } catch (error) {
    console.error("Error in riskScore handler:", error);
    res.status(500).json({ error: error.message });
  }
}
