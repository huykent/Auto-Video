// Content script running on Auto-Video web app pages
(function() {
  console.log('[Auto-Video Bridge] Content script loaded on page.');

  // Notify web page that extension is installed and active
  document.documentElement.setAttribute('data-auto-video-extension', 'active');
  window.dispatchEvent(new CustomEvent('AutoVideoExtReady'));

  let pollingInterval = null;

  function startPolling() {
    if (pollingInterval) return;
    pollingInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/extension?action=poll');
        if (!res.ok) return;
        const data = await res.json();

        if (data && data.job) {
          console.log('[Auto-Video Bridge] Found pending job via Content Script:', data.job);
          chrome.runtime.sendMessage({ action: 'scrapeJob', job: data.job }, (response) => {
            console.log('[Auto-Video Bridge] Background response:', response);
          });
        }
      } catch (err) {
        // Ignore fetch errors
      }
    }, 2000);
  }

  startPolling();
})();
