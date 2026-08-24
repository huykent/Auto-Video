document.addEventListener('DOMContentLoaded', () => {
  const serverInput = document.getElementById('serverUrl');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('statusMsg');

  chrome.storage.local.get(['serverUrl'], (res) => {
    if (res.serverUrl) {
      serverInput.value = res.serverUrl;
    }
    checkStatus(serverInput.value);
  });

  saveBtn.addEventListener('click', () => {
    const url = serverInput.value.trim().replace(/\/$/, '');
    chrome.storage.local.set({ serverUrl: url }, () => {
      statusMsg.textContent = '✅ Đã lưu cấu hình!';
      checkStatus(url);
    });
  });

  async function checkStatus(url) {
    statusMsg.textContent = '⏳ Đang kiểm tra kết nối...';
    try {
      const res = await fetch(`${url}/api/extension?action=status`);
      if (res.ok) {
        statusMsg.style.color = '#34d399';
        statusMsg.textContent = '🟢 Đã kết nối máy chủ Auto-Video!';
      } else {
        statusMsg.style.color = '#f87171';
        statusMsg.textContent = '🔴 Không thể kết nối tới máy chủ.';
      }
    } catch (e) {
      statusMsg.style.color = '#f87171';
      statusMsg.textContent = '🔴 Lỗi kết nối mạng hoặc máy chủ tắt.';
    }
  }
});
