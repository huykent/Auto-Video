import { describe, it, expect } from 'vitest';
import { getSystemSettings, updateSystemSettings } from '../lib/settings';

describe('System Settings Module', () => {
  it('should save and retrieve system settings', async () => {
    await updateSystemSettings({
      veo_api_key: 'test_veo_key_123',
      gemini_api_key: 'test_gemini_key_456',
      ai_mode: 'mock',
      max_crawl_items: '15',
    });

    const settings = await getSystemSettings();
    expect(settings.veo_api_key).toBe('test_veo_key_123');
    expect(settings.gemini_api_key).toBe('test_gemini_key_456');
    expect(settings.ai_mode).toBe('mock');
    expect(settings.max_crawl_items).toBe('15');
  });
});
