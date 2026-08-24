import { chromium } from 'playwright';
import { updateSystemSettings } from '../settings';

export interface AutoLoginResult {
  success: boolean;
  token?: string;
  cookie?: string;
  error?: string;
}

export async function autoLoginMakerWorld(email?: string, password?: string): Promise<AutoLoginResult> {
  if (!email || !password) {
    return { success: false, error: 'Email và Mật khẩu MakerWorld không được để trống.' };
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();
  let extractedToken = '';

  // Intercept authentication API response to capture JWT token
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/v1/user-service') || url.includes('/login') || url.includes('/token')) {
      try {
        const headers = res.headers();
        const authHeader = headers['authorization'] || headers['Authorization'];
        if (authHeader && authHeader.includes('Bearer ')) {
          extractedToken = authHeader;
        }

        const json = await res.json().catch(() => null);
        if (json && json.token) {
          extractedToken = json.token;
        } else if (json && json.data && json.data.token) {
          extractedToken = json.data.token;
        }
      } catch (e) {
        // Ignore non-json responses
      }
    }
  });

  try {
    console.log(`[Auto-Login Engine] Attempting login for ${email}...`);
    await page.goto('https://makerworld.com/en/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Fill Email / Account input
    const emailSelector = 'input[type="email"], input[name="email"], input[placeholder*="email" i]';
    await page.waitForSelector(emailSelector, { timeout: 10000 });
    await page.fill(emailSelector, email);

    // Fill Password input
    const passwordSelector = 'input[type="password"], input[name="password"]';
    await page.fill(passwordSelector, password);

    // Click Submit / Login button
    const submitSelector = 'button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")';
    await page.click(submitSelector);

    // Wait for post-login redirection or auth response
    await page.waitForTimeout(5000);

    // Extract browser cookies
    const cookies = await context.cookies();
    const cookieHeaderString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    if (extractedToken || cookieHeaderString) {
      console.log('[Auto-Login Engine] Login successful! Saving auth settings...');
      await updateSystemSettings({
        makerworld_email: email,
        makerworld_password: password,
        makerworld_token: extractedToken,
        makerworld_cookie: cookieHeaderString,
      });

      await browser.close();
      return {
        success: true,
        token: extractedToken,
        cookie: cookieHeaderString,
      };
    } else {
      await browser.close();
      return {
        success: false,
        error: 'Không tìm thấy Auth Token sau khi bấm Đăng nhập. Có thể bị chặn bởi CAPTCHA hoặc 2FA.',
      };
    }
  } catch (err: any) {
    console.error('[Auto-Login Engine Error]:', err);
    await browser.close().catch(() => {});
    return {
      success: false,
      error: err.message || 'Lỗi hệ thống khi đăng nhập tự động.',
    };
  }
}
