import { ApifyClient } from "apify-client";

function formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(0) + "k";
  return num.toString();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id, page = "1", limit = "5" } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 5;
  const offset = (pageNumber - 1) * pageSize;


  
  try {
    const client = new ApifyClient({
      token: "apify_api_GP5LAo7dzbzZyGkj4Lu8i0tuJlI4G90qJLX0", 
    });

    const input = {
      username: [id],
      resultsLimit: 60,
    };
    const run = await client.actor("apify/instagram-post-scraper").call(input);

    if (!run.defaultDatasetId) {
      return res.status(500).json({ error: "Failed to fetch profile posts" });
    }

    const datasetClient = client.dataset(run.defaultDatasetId);
    const { items } = await datasetClient.listItems({
      limit: pageSize,
      offset: offset,
    });

    const pagePosts = items.map((item) => {
      const datePosted = item.timestamp ? new Date(item.timestamp) : null;
      const formattedDate = datePosted
        ? datePosted.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Unknown Date";

      return {
        image: item.displayUrl || item.imageUrl || "",
        titleSnippet: item.caption
          ? item.caption.slice(0, 50)
          : "No Title", 
        dateTime: formattedDate,
        likes: item.likesCount ? formatNumber(item.likesCount) : "0",
        commentsCount: item.commentsCount
          ? formatNumber(item.commentsCount)
          : "0",

        fullCaption: item.caption || "",
        latestComments: item.latestComments || [], 
        latestComments: (item.latestComments || []).slice(0, 3),
      };
    });

    return res.status(200).json({ 
      isPrivate: true,

      posts: pagePosts });
  } catch (error) {
    console.error("Error fetching profile posts:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
