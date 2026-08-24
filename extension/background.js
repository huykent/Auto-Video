// Auto-Video Chrome Extension Service Worker (V1.2.0 Robust Dual Strategy)

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

// Polling alarm every 3 seconds as fallback
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

  // STRATEGY A: Direct Search API Call inside Chrome
  try {
    const apiUrl = `https://makerworld.com/api/v1/search-service/select/design?keyword=${encodeURIComponent(keyword)}&offset=0&limit=${maxResults || 10}`;
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json, text/plain, */*' }
    });

    if (res.ok) {
      const json = await res.json();
      const rawHits = json.hits || json.data?.hits || json.designs || json.data?.designs || json.items || json.data?.items || (Array.isArray(json) ? json : []);
      if (Array.isArray(rawHits) && rawHits.length > 0) {
        console.log(`[Auto-Video Bridge] Strategy A found ${rawHits.length} items!`);
        hitsFound = rawHits;
      }
    }
  } catch (e) {
    console.warn('[Auto-Video Bridge] Strategy A error:', e);
  }

  // STRATEGY B: HTML & __NEXT_DATA__ & Model ID Regex Scanning Fallback
  if (hitsFound.length === 0) {
    console.log('[Auto-Video Bridge] Strategy A returned 0 items. Executing Strategy B (HTML/Model ID extraction)...');
    try {
      const searchPageUrl = `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(keyword)}`;
      const htmlRes = await fetch(searchPageUrl);
      if (htmlRes.ok) {
        const html = await htmlRes.text();

        // 1. Try extracting __NEXT_DATA__
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
        if (nextDataMatch) {
          try {
            const nextJson = JSON.parse(nextDataMatch[1]);
            const pageHits = nextJson.props?.pageProps?.initialData?.hits || nextJson.props?.pageProps?.designs || [];
            if (Array.isArray(pageHits) && pageHits.length > 0) {
              console.log(`[Auto-Video Bridge] Strategy B (__NEXT_DATA__) found ${pageHits.length} items!`);
              hitsFound = pageHits;
            }
          } catch (err) {}
        }

        // 2. If still empty, regex extract model IDs from HTML links (/models/12345)
        if (hitsFound.length === 0) {
          const modelIdMatches = [...html.matchAll(/\/models\/(\d+)/g)].map(m => m[1]);
          const uniqueIds = [...new Set(modelIdMatches)].slice(0, maxResults || 10);
          console.log(`[Auto-Video Bridge] Strategy B (Regex IDs) found ${uniqueIds.length} IDs:`, uniqueIds);

          for (const id of uniqueIds) {
            hitsFound.push({ id });
          }
        }
      }
    } catch (e) {
      console.error('[Auto-Video Bridge] Strategy B error:', e);
    }
  }

  // Process found items and enrich via Bambu REST API
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

    console.log(`[Auto-Video Bridge] Final processed hits: ${processedHits.length} items.`);

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
    console.log(`[Auto-Video Bridge] Job ${jobId} reported COMPLETED to server with ${processedHits.length} items.`);

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
