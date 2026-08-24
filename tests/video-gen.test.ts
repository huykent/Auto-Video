import { describe, it, expect } from 'vitest';
import { buildVideoPrompt, formatPromptForECommerce } from '../lib/video-gen/prompt';
import { generateVeoVideo } from '../lib/video-gen/veo';

describe('AI Video Prompt Engineering & Veo 3 Pipeline', () => {
  it('should build cinematic studio 3D product prompt', () => {
    const prompt = buildVideoPrompt('Articulated Dragon', ['PLA'], ['Silk Gold']);
    expect(prompt).toContain('Articulated Dragon');
    expect(prompt).toContain('PLA');
    expect(prompt).toContain('Silk Gold');
    expect(prompt).toContain('360 degree');
    expect(prompt).toContain('photorealistic 4k');
  });

  it('should sanitize prompt special characters', () => {
    const raw = buildVideoPrompt('Dragon / 3D!', ['TPU'], ['Black']);
    const formatted = formatPromptForECommerce(raw);
    expect(formatted).not.toContain('!');
    expect(formatted).not.toContain('/');
  });

  it('should generate simulated Veo 3 video payload in mock mode', async () => {
    const result = await generateVeoVideo('prod-123', '/storage/raw_images/test.jpg', 'Test Prompt', { mock: true });
    expect(result.jobId).toContain('veo-demo-');
    expect(result.videoPath).toContain('prod-123');
  });
});
