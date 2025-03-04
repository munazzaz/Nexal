// src/pages/api/profileDetails.js
import { ApifyClient } from 'apify-client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  try {
    // Prepare the Apify client with your token
    const client = new ApifyClient({
      token: 'apify_api_Fg3EwbIxRvoUMvKQp2YORhaoypUoc007jmoa'
    });
    
    // IMPORTANT: Use the required field "usernames" as an array
    const input = { usernames: [id] };

    const run = await client.actor('apify/instagram-profile-scraper').call(input);
    
    if (!run.defaultDatasetId) {
      return res.status(500).json({ error: 'Failed to fetch profile details' });
    }

    const datasetClient = client.dataset(run.defaultDatasetId);
    const { items } = await datasetClient.listItems({ limit: 1 });

    if (!items || !items.length) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = items[0];

    // Return all available details from the scraped data
    return res.status(200).json({
      id: profile.id || profile.username,
      username: profile.username,
      fullName: profile.fullName || '',
      bio: profile.biography || profile.bio || '',
      profilePicture: profile.profilePicUrlHD || profile.profilePicUrl || '/no-profile-pic-img.png',
      followersCount: profile.followersCount || 0,
      followingCount: profile.followingCount || 0,
      postsCount: profile.postsCount || 0,
      isPrivate: profile.isPrivate ?? false,
      isVerified: profile.isVerified ?? false,
      externalUrl: profile.externalUrl || '',
      businessCategory: profile.businessCategory || '',
      // Map additional fields as needed
    });
  } catch (error) {
    console.error('Error fetching profile details:', error.message || error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}


