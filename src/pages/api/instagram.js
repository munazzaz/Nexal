export default async function handler(req, res) {
    const { username } = req.query;
  
    if (!username) {
      console.error("No username provided in query.");
      return res.status(400).json({ error: "Username query parameter is required." });
    }
  
    const url = `https://social-api4.p.rapidapi.com/v1/posts?username_or_id_or_url=${username}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, 
        "x-rapidapi-host": "social-api4.p.rapidapi.com",
      },
    };
  
    try {
      console.log("Requesting URL:", url);
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching data. Status: ${response.status}`, errorText);
        return res.status(response.status).json({ error: `Error fetching data from RapidAPI: ${errorText}` });
      }
      const data = await response.json();
      const profileData = data.data.user;
      res.status(200).json(profileData);
    } catch (error) {
      console.error("Exception caught while fetching data:", error);
      res.status(500).json({ error: error.message });
    }
  }
  
