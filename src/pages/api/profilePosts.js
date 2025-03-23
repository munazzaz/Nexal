export default async function handler(req, res) {
  const { username, page } = req.query;

  if (!username) {
    console.error("No username provided in query.");
    return res.status(400).json({ error: "Username query parameter is required." });
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

  const baseUrl = `https://social-api4.p.rapidapi.com/v1/posts?username_or_id_or_url=${username}`;

  let allPosts = [];
  let currentPageUrl = baseUrl;
  let paginationToken = null;

  try {
    do {
      console.log("Requesting URL:", currentPageUrl);
      const response = await fetch(currentPageUrl, options);
      if (!response.ok) {
        const textResponse = await response.text();
        console.error("Error response status:", response.status);
        return res
          .status(response.status)
          .json({ error: `Error fetching data from RapidAPI: ${textResponse}` });
      }

      const data = await response.json();

      if (data.data && data.data.items) {
        allPosts = allPosts.concat(data.data.items);
      } else {
        console.warn("No posts items found in response.");
      }

      paginationToken = data.pagination_token || null;
      if (allPosts.length >= requiredPostsCount) break;

      if (paginationToken) {
        currentPageUrl = `${baseUrl}&pagination_token=${paginationToken}`;
      }
    } while (paginationToken);

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



