import { ApifyClient } from 'apify-client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, platform, page = 1 } = req.query;

  if (!query || query === '*') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }
  if (platform && platform.toLowerCase() !== 'instagram') {
    return res.status(400).json({
      error: 'Please select the correct platform. Facebook is not supported.'
    });
  }

  try {
    const pageInt = parseInt(page, 10) || 1;
    const limit = 5; // Fetch only 5 profiles per request
    const maxPages = 7;

    if (pageInt > maxPages) {
      return res.status(400).json({
        error: `Invalid page number. Only pages 1 through ${maxPages} are allowed.`
      });
    }

    const client = new ApifyClient({
      token: 'apify_api_Fg3EwbIxRvoUMvKQp2YORhaoypUoc007jmoa'
    });

    const input = {
      search: query,
      searchType: 'user',
      searchLimit: limit * maxPages, // Fetch all possible results upfront for sorting
      page: 1 // Always fetch from the first page for sorting purposes
    };

    const run = await client.actor('apify/instagram-search-scraper').call(input);

    if (!run.defaultDatasetId) {
      console.error('Error: No dataset ID returned from API');
      return res
        .status(500)
        .json({ error: 'Failed to fetch data from Instagram scraper' });
    }

    const datasetClient = client.dataset(run.defaultDatasetId);
    const { items } = await datasetClient.listItems({ limit: limit * maxPages });

    if (!items.length) {
      return res.status(404).json({ error: `No profiles found for query: ${query}.` });
    }


    let profiles = items.map((item) => ({
      id: item.id || item.username,
      username: item.username || '', // fallback to empty string
      bio: item.bio || '',
      profilePicture: item.profilePicUrlHD || item.profilePicUrl || '/no-profile-pic-img.png',
    }));
    

    profiles.sort((a, b) => {
      const q = query.toLowerCase();
      const aUser = (a.username || '').toLowerCase();
      const bUser = (b.username || '').toLowerCase();
    
      // Exact match check
      const exactMatchExists = profiles.some((profile) => profile.username.toLowerCase() === q);
    
      if (exactMatchExists) {
        // If an exact match exists, sort normally (exact match first)
        if (aUser === q && bUser !== q) return -1;
        if (bUser === q && aUser !== q) return 1;
      }
    
      // If no exact match, just sort by relevance (startsWith first)
      const aStarts = aUser.startsWith(q);
      const bStarts = bUser.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
    
      // Otherwise, sort alphabetically (or by length)
      return aUser.length - bUser.length;
    });
    

    // Pagination logic
    const startIndex = (pageInt - 1) * limit;
    const endIndex = startIndex + limit;
    const pagedProfiles = profiles.slice(startIndex, endIndex);

    if (!pagedProfiles.length) {
      return res.status(404).json({ error: `No profiles found for page ${pageInt}.` });
    }

    return res.status(200).json({
      profiles: pagedProfiles,
      totalPages: maxPages,
      currentPage: pageInt,
    });
  } catch (error) {
    console.error('Error fetching Instagram profiles:', error.message || error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

