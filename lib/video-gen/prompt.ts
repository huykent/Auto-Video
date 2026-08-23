export function buildVideoPrompt(title: string, types: string[], colors: string[]): string {
  const typeStr = types.length > 0 ? types.join(' and ') : 'PLA';
  const colorStr = colors.length > 0 ? colors.join(' and ') : 'Standard';

  return `A 3D printed ${title} made of premium ${typeStr} plastic filament in ${colorStr} color, cinematic studio lighting, rotating product display 360 degree showcase camera spin, high detail photorealistic 4k.`;
}

export function formatPromptForECommerce(prompt: string): string {
  return prompt.replace(/[\/!\?\*\#]/g, '').replace(/\s+/g, ' ').trim();
}
