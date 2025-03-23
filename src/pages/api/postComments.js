export default async function handler(req, res) {
    const { postId } = req.query;
  
    if (!postId) {
      console.error("No postId provided in query.");
      return res.status(400).json({ error: "postId query parameter is required." });
    }
  
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = "social-api4.p.rapidapi.com";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
    };
  
    const url = `https://social-api4.p.rapidapi.com/v1/comments?code_or_id_or_url=${postId}`;
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching comments:", errorText);
        return res
          .status(response.status)
          .json({ error: `Error fetching data: ${errorText}` });
      }
  
      const data = await response.json();
  
      let comments = data.data && data.data.items ? data.data.items : [];
  
      const formattedComments = comments.slice(0, 3).map((comment) => ({
        username: comment.user?.username || "Unknown",
        text: comment.text || "No comment",
        date: comment.created_at
          ? new Date(comment.created_at * 1000).toLocaleDateString()
          : "Unknown",
        profilePic: comment.user?.profile_pic_url || "/defaultProfilePic.png",
      }));
  
      return res.status(200).json({ comments: formattedComments });
    } catch (error) {
      console.error("Exception caught while fetching comments:", error);
      return res.status(500).json({ error: error.message });
    }
  }
  