import { chromium } from 'playwright';
import { updateSystemSettings } from '../settings';

export interface AutoLoginResult {
  success: boolean;
  token?: string;
  cookie?: string;
  requiresVerificationCode?: boolean;
  error?: string;
}

export async function autoLoginMakerWorld(email?: string, password?: string, verificationCode?: string): Promise<AutoLoginResult> {
  if (!email || !password) {
    return { success: false, error: 'Email và Mật khẩu MakerWorld không được để trống.' };
  }

  // Strategy 1: Direct Bambu Lab REST Login API (Bambuddy Method - Fast & No Cloudflare Turnstile Block)
  try {
    console.log(`[Bambu REST Login API] Attempting login for ${email}...`);
    const apiUrl = 'https://api.bambulab.com/v1/user-service/user/login';
    const payload: Record<string, string> = {
      account: email,
      password: password,
    };
    if (verificationCode) {
      payload.verifyCode = verificationCode;
      payload.code = verificationCode;
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Origin': 'https://makerworld.com',
        'Referer': 'https://makerworld.com/'
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json().catch(() => null);

    if (res.ok && json) {
      const token = json.token || json.accessToken || json.data?.token || json.jwt;
      if (token) {
        const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        console.log('[Bambu REST Login API] Login successful! Extracted Auth Token.');
        await updateSystemSettings({
          makerworld_email: email,
          makerworld_password: password,
          makerworld_token: authHeader,
        });
        return {
          success: true,
          token: authHeader,
        };
      }
    }

    if (json) {
      const errorMsg = (json.error || json.message || '').toLowerCase();
      if (errorMsg.includes('verification') || errorMsg.includes('code') || errorMsg.includes('mfa') || errorMsg.includes('2fa') || json.code === 1002) {
        return {
          success: false,
          requiresVerificationCode: true,
          error: 'MakerWorld yêu cầu nhập Mã Xác Thực 2FA (Verification Code) từ Email của bạn.',
        };
      } else if (json.error || json.message) {
        return {
          success: false,
          error: `Đăng nhập thất bại: ${json.error || json.message}`,
        };
      }
    }
  } catch (err: any) {
    console.error('[Bambu REST Login API Error]:', err);
  }

  // Strategy 2: Fallback Playwright Headless Browser Login
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

  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/v1/user-service') || url.includes('/login') || url.includes('/token') || url.includes('/verify')) {
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
        // Ignore
      }
    }
  });

  try {
    console.log(`[Playwright Login Engine] Fallback navigating for ${email}...`);
    await page.goto('https://makerworld.com/en/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const emailSelector = 'input[type="email"], input[name="email"], input[placeholder*="email" i], input[name="account"]';
    await page.waitForSelector(emailSelector, { timeout: 10000 });
    await page.fill(emailSelector, email);

    const passwordSelector = 'input[type="password"], input[name="password"]';
    await page.fill(passwordSelector, password);

    const submitSelector = 'button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")';
    await page.click(submitSelector);

    await page.waitForTimeout(3000);

    const codeInputSelector = 'input[placeholder*="code" i], input[placeholder*="verification" i], input[name*="code" i]';
    const isCodeInputVisible = await page.$(codeInputSelector).then((el) => el?.isVisible()).catch(() => false);

    if (isCodeInputVisible || (await page.content()).includes('verification code')) {
      if (verificationCode) {
        await page.fill(codeInputSelector, verificationCode);
        const confirmBtn = 'button:has-text("Verify"), button:has-text("Confirm"), button[type="submit"]';
        await page.click(confirmBtn);
        await page.waitForTimeout(4000);
      } else {
        await browser.close();
        return {
          success: false,
          requiresVerificationCode: true,
          error: 'MakerWorld yêu cầu nhập Mã Xác Thực (Verification Code) từ Email của bạn!',
        };
      }
    }

    const cookies = await context.cookies();
    const cookieHeaderString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    if (extractedToken || cookieHeaderString) {
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
        error: 'Không tìm thấy Auth Token sau khi đăng nhập. Vui lòng kiểm tra lại Email/Mật khẩu.',
      };
    }
  } catch (err: any) {
    console.error('[Playwright Login Engine Error]:', err);
    await browser.close().catch(() => {});
    return {
      success: false,
      error: err.message || 'Lỗi hệ thống khi đăng nhập tự động.',
    };
  }
}
