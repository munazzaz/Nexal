import { ApifyClient } from 'apify-client';


const fullSearchCache = {};

const MAX_PAGES = 7;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Only GET is supported.' });
  }

  try {
    const { query, platform, page = 1, limit = 5 } = req.query;

    if (!query || query === '*') {
      return res.status(400).json({ error: 'Invalid query parameter. Provide a search term.' });
    }
    if (platform && platform.toLowerCase() !== 'instagram') {
      return res.status(400).json({ error: 'Please select the correct platform. Only Instagram is supported.' });
    }

    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    if (isNaN(pageInt) || pageInt < 1) {
      return res.status(400).json({ error: 'Invalid "page" parameter. Must be a positive integer.' });
    }
    if (isNaN(limitInt) || limitInt < 1) {
      return res.status(400).json({ error: 'Invalid "limit" parameter. Must be a positive integer.' });
    }
    if (pageInt > MAX_PAGES) {
      return res.status(400).json({ error: `Page ${pageInt} exceeds the maximum of ${MAX_PAGES} pages.` });
    }

    const cacheKey = query.toLowerCase();

    let fullData;
    if (fullSearchCache[cacheKey]) {
      fullData = fullSearchCache[cacheKey];
    } else {
      const totalFetchLimit = MAX_PAGES * limitInt; 
      const client = new ApifyClient({
        token: 'apify_api_GP5LAo7dzbzZyGkj4Lu8i0tuJlI4G90qJLX0',
      });

      const input = {
        search: query,
        searchType: 'user',
        searchLimit: totalFetchLimit,
        offset: 0, 
      };

      const run = await client.actor('apify/instagram-search-scraper').call(input);
      if (!run || !run.defaultDatasetId) {
        return res.status(502).json({
          error: 'Apify actor did not return a valid dataset. Possibly a scraping failure.',
        });
      }
      const datasetClient = client.dataset(run.defaultDatasetId);
      const { items } = await datasetClient.listItems({ limit: totalFetchLimit, offset: 0 });
      if (!items || !items.length) {
        return res.status(404).json({ error: 'No related profiles found.' });
      }
      fullData = items;
      fullSearchCache[cacheKey] = fullData;
    }

    const q = query.toLowerCase();
    let orderedData;
    const exactMatchIndex = fullData.findIndex(item => (item.username || '').toLowerCase() === q);
    if (exactMatchIndex !== -1) {
      const exactMatches = fullData.filter(item => (item.username || '').toLowerCase() === q);
      const remainingProfiles = fullData.filter(item => (item.username || '').toLowerCase() !== q);

      remainingProfiles.sort((a, b) => {
        const aUser = (a.username || '').toLowerCase();
        const bUser = (b.username || '').toLowerCase();
        const aStarts = aUser.startsWith(q);
        const bStarts = bUser.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aUser.length - bUser.length;
      });
      orderedData = [exactMatches[0], ...remainingProfiles];
    } else {
      orderedData = [...fullData];
      orderedData.sort((a, b) => {
        const aUser = (a.username || '').toLowerCase();
        const bUser = (b.username || '').toLowerCase();
        const aStarts = aUser.startsWith(q);
        const bStarts = bUser.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aUser.length - bUser.length;
      });
    }

    const startIndex = (pageInt - 1) * limitInt;
    const endIndex = startIndex + limitInt;
    const paginatedItems = orderedData.slice(startIndex, endIndex);
    if (!paginatedItems.length) {
      return res.status(404).json({
        error: `No related profiles found for page ${pageInt}.`
      });
    }

    const profiles = paginatedItems.map(item => ({
      id: item.id || item.username,
      username: item.username,
      bio: item.bio || '',
      profilePicture: item.profilePicUrlHD || item.profilePicUrl || '/no-profile-pic-img.png',
    }));


    const responseData = {
      profiles,
      total: fullData.length,
      currentPage: pageInt,
      totalPages: MAX_PAGES,
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error fetching Instagram profiles:', error);
    if (error.message?.includes('TIMEOUT')) {
      return res.status(504).json({ error: 'Scraper timed out. Please try again later.' });
    }
    if (error.message?.includes('invalid token')) {
      return res.status(401).json({ error: 'Invalid Apify token.' });
    }
    return res.status(500).json({ error: 'Internal Server Error. ' + (error.message || 'Unknown error') });
  }
}

