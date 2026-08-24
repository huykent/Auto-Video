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

  // Bambu Lab REST Login API (Bambuddy Strategy - Direct, Fast, Zero Cloudflare Challenge)
  try {
    console.log(`[Bambu REST Login API] Attempting login for ${email}...`);
    const apiUrl = 'https://api.bambulab.com/v1/user-service/user/login';
    const payload: Record<string, string> = {
      account: email.trim(),
      password: password.trim(),
    };
    if (verificationCode) {
      payload.verifyCode = verificationCode.trim();
      payload.code = verificationCode.trim();
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BambuStudio/01.09.03.50',
        'Accept': 'application/json',
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
        console.log('[Bambu REST Login API] Login successful! Saved Auth Token.');
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
      const code = json.code;

      if (code === 1002 || errorMsg.includes('verification') || errorMsg.includes('code') || errorMsg.includes('2fa') || errorMsg.includes('mfa')) {
        return {
          success: false,
          requiresVerificationCode: true,
          error: 'MakerWorld yêu cầu nhập Mã Xác Thực 2FA (Verification Code) từ Email của bạn.',
        };
      } else if (errorMsg.includes('incorrect') || errorMsg.includes('account') || errorMsg.includes('password') || code === 1 || code === 2) {
        return {
          success: false,
          error: 'Mật khẩu hoặc Email MakerWorld/Bambu Lab không chính xác. Vui lòng kiểm tra lại.',
        };
      } else if (json.error || json.message) {
        return {
          success: false,
          error: `Đăng nhập thất bại: ${json.error || json.message}`,
        };
      }
    }

    return {
      success: false,
      error: `Phản hồi từ máy chủ MakerWorld không hợp lệ (HTTP ${res.status}).`,
    };

  } catch (err: any) {
    console.error('[Bambu REST Login API Error]:', err);
    return {
      success: false,
      error: err.message || 'Lỗi kết nối khi gửi yêu cầu đăng nhập.',
    };
  }
}
