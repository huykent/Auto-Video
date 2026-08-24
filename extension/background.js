// Auto-Video Chrome Extension Service Worker (V1.4.0 Header-Authenticated Engine)

let SERVER_URL = 'http://192.168.11.11:3008';

chrome.storage.local.get(['serverUrl'], (res) => {
  if (res.serverUrl) SERVER_URL = res.serverUrl;
});

// Listen for message from Content Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrapeJob' && message.job) {
    console.log('[Background] Received scrapeJob from content script:', message.job);
    executeScrapeJob(message.job).then(() => {
      sendResponse({ status: 'started' });
    });
    return true;
  }
});

// Polling alarm every 3 seconds
chrome.alarms.create('pollServer', { periodInMinutes: 0.05 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pollServer') {
    pollForJobs();
  }
});

async function pollForJobs() {
  try {
    const res = await fetch(`${SERVER_URL}/api/extension?action=poll`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) return;
    const data = await res.json();

    if (data && data.job) {
      console.log('[Auto-Video Bridge] Received job to scrape via Alarm:', data.job);
      await executeScrapeJob(data.job);
    }
  } catch (err) {
    // Quietly catch connectivity errors
  }
}

async function executeScrapeJob(job) {
  const { jobId, keyword, maxResults } = job;
  console.log(`[Auto-Video Bridge] Executing browser scrape for "${keyword}" (max: ${maxResults})...`);

  let hitsFound = [];

  const bblHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Origin': 'https://makerworld.com',
    'Referer': `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(keyword)}`,
    'x-bbl-app-source': 'makerworld',
    'x-bbl-client-name': 'MakerWorld',
    'x-bbl-client-type': 'web',
    'x-bbl-client-version': '00.00.00.01'
  };

  // STRATEGY A1: Direct POST Search Select Endpoint with x-bbl headers
  try {
    const apiUrl = `https://makerworld.com/api/v1/search-service/select/design`;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: bblHeaders,
      body: JSON.stringify({
        keyword: keyword,
        offset: 0,
        limit: maxResults || 10
      })
    });

    if (res.ok) {
      const json = await res.json();
      const rawHits = json.hits || json.data?.hits || json.designs || json.data?.designs || json.items || json.data?.items || (Array.isArray(json) ? json : []);
      if (Array.isArray(rawHits) && rawHits.length > 0) {
        console.log(`[Auto-Video Bridge] Strategy A1 (POST Select) found ${rawHits.length} items!`);
        hitsFound = rawHits;
      }
    }
  } catch (e) {
    console.warn('[Auto-Video Bridge] Strategy A1 POST error:', e);
  }

  // STRATEGY A2: Direct GET Search Select Endpoint
  if (hitsFound.length === 0) {
    try {
      const apiUrl = `https://makerworld.com/api/v1/search-service/select/design?keyword=${encodeURIComponent(keyword)}&offset=0&limit=${maxResults || 10}`;
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: bblHeaders
      });

      if (res.ok) {
        const json = await res.json();
        const rawHits = json.hits || json.data?.hits || json.designs || json.data?.designs || json.items || json.data?.items || (Array.isArray(json) ? json : []);
        if (Array.isArray(rawHits) && rawHits.length > 0) {
          console.log(`[Auto-Video Bridge] Strategy A2 (GET Select) found ${rawHits.length} items!`);
          hitsFound = rawHits;
        }
      }
    } catch (e) {
      console.warn('[Auto-Video Bridge] Strategy A2 GET error:', e);
    }
  }

  // STRATEGY B: HTML Next.js __NEXT_DATA__ Page Props Parsing
  if (hitsFound.length === 0) {
    console.log('[Auto-Video Bridge] Executing Strategy B (__NEXT_DATA__ parsing)...');
    try {
      const searchPageUrl = `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(keyword)}`;
      const htmlRes = await fetch(searchPageUrl);
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
        if (nextDataMatch) {
          try {
            const nextJson = JSON.parse(nextDataMatch[1]);
            const pageProps = nextJson.props?.pageProps || {};
            
            const findHits = (obj) => {
              if (!obj || typeof obj !== 'object') return null;
              if (Array.isArray(obj.hits) && obj.hits.length > 0) return obj.hits;
              if (Array.isArray(obj.designs) && obj.designs.length > 0) return obj.designs;
              for (const k in obj) {
                if (typeof obj[k] === 'object') {
                  const res = findHits(obj[k]);
                  if (res) return res;
                }
              }
              return null;
            };

            const extractedHits = findHits(pageProps);
            if (extractedHits && extractedHits.length > 0) {
              console.log(`[Auto-Video Bridge] Strategy B (__NEXT_DATA__ recursive) found ${extractedHits.length} items!`);
              hitsFound = extractedHits;
            }
          } catch (err) {
            console.warn('[Auto-Video Bridge] __NEXT_DATA__ JSON parse error:', err);
          }
        }
      }
    } catch (e) {
      console.error('[Auto-Video Bridge] Strategy B error:', e);
    }
  }

  // Process and enrich matched models
  try {
    const processedHits = [];
    for (const hit of hitsFound) {
      const modelId = String(hit.id || hit.designId || hit.modelId);
      if (!modelId || modelId === 'undefined') continue;

      let fullDetail = null;
      try {
        const detailRes = await fetch(`https://api.bambulab.com/v1/design-service/design/${modelId}`);
        if (detailRes.ok) {
          fullDetail = await detailRes.json();
        }
      } catch (e) {}

      processedHits.push({
        makerworldId: modelId,
        title: fullDetail?.title || hit.title || hit.name || `${keyword} Model #${modelId}`,
        coverUrl: fullDetail?.coverUrl || hit.coverUrl || hit.cover || '',
        url: `https://makerworld.com/en/models/${modelId}`,
        author: fullDetail?.user?.name || hit.authorName || hit.creator || 'MakerWorld Creator',
        likeCount: fullDetail?.likeCount || hit.likeCount || 0,
        downloadCount: fullDetail?.downloadCount || hit.downloadCount || 0,
        printTimeMinutes: hit.printTime || 120,
        weightGrams: hit.weight || 50,
      });
    }

    console.log(`[Auto-Video Bridge] Final keyword-matched hits: ${processedHits.length} items for "${keyword}".`);

    // Send results back to server
    await fetch(`${SERVER_URL}/api/extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'completeJob',
        jobId,
        hits: processedHits
      })
    });
    console.log(`[Auto-Video Bridge] Job ${jobId} reported COMPLETED to server.`);

  } catch (err) {
    console.error('[Auto-Video Bridge Error]:', err);
    await fetch(`${SERVER_URL}/api/extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'failJob',
        jobId,
        error: err.message
      })
    });
  }
}
