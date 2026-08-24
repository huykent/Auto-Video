// Auto-Video Chrome Extension Service Worker

let SERVER_URL = 'http://192.168.11.11:3008';

chrome.storage.local.get(['serverUrl'], (res) => {
  if (res.serverUrl) SERVER_URL = res.serverUrl;
});

console.log('[Auto-Video Bridge] Background script started. Server:', SERVER_URL);

// Set up polling alarm every 3 seconds
chrome.alarms.create('pollServer', { periodInMinutes: 0.1 });

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
      console.log('[Auto-Video Bridge] Received job to scrape:', data.job);
      await executeScrapeJob(data.job);
    }
  } catch (err) {
    // Quietly catch connectivity errors
  }
}

async function executeScrapeJob(job) {
  const { jobId, keyword, maxResults } = job;
  console.log(`[Auto-Video Bridge] Executing browser scrape for "${keyword}" (max: ${maxResults})...`);

  try {
    // Query MakerWorld Search API directly within Chrome context
    const apiUrl = `https://makerworld.com/api/v1/search-service/select/design?keyword=${encodeURIComponent(keyword)}&offset=0&limit=${maxResults || 10}`;
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
      }
    });

    if (res.ok) {
      const json = await res.json();
      const hits = json.hits || json.data?.hits || [];
      console.log(`[Auto-Video Bridge] Successfully fetched ${hits.length} models for "${keyword}"!`);

      const processedHits = [];
      for (const hit of hits) {
        const modelId = String(hit.id || hit.designId);
        
        // Fetch full authentic details from Bambu API
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

    } else {
      console.warn(`[Auto-Video Bridge] MakerWorld API returned status ${res.status}`);
      await fetch(`${SERVER_URL}/api/extension`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'failJob',
          jobId,
          error: `MakerWorld returned HTTP ${res.status}`
        })
      });
    }

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
