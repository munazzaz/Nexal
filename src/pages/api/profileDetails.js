export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const apiResponse = await fetch(
      `https://social-api4.p.rapidapi.com/v1/info?username_or_id_or_url=${username}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': "social-api4.p.rapidapi.com"
        }
      }
    );

    if (!apiResponse.ok) {
      console.error('Error response from RapidAPI:', apiResponse.status, apiResponse.statusText);
      return res.status(apiResponse.status).json({ error: 'Error fetching profile details from RapidAPI' });
    }

    const fullData = await apiResponse.json();

    const profileData = fullData.data;

    const filteredData = {
      follower_count: profileData.follower_count,
      following_count: profileData.following_count,
      full_name: profileData.full_name,
      biography: profileData.biography,
      username: profileData.username,
      profile_pic_url_hd: profileData.profile_pic_url_hd,
      external_url: profileData.external_url,
      postsCount: profileData.media_count, 
    };

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: 'Failed to fetch profile details' });
  }
}
