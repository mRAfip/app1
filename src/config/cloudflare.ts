// Cloudflare R2 Configuration
export const CLOUDFLARE_R2_CONFIG = {
  // Your R2 bucket public URL (replace with your actual bucket URL)
  BUCKET_URL: 'https://pub-2d62457c15f24c3cba63561b98fd1b94.r2.dev',
  
  // Alternative: If you have a custom domain for your R2 bucket
  // BUCKET_URL: 'https://music.yourdomain.com',
  
  // R2 API credentials (for uploads - optional for now)
  ACCOUNT_ID: process.env.EXPO_PUBLIC_R2_ACCOUNT_ID || '',
  ACCESS_KEY_ID: process.env.EXPO_PUBLIC_R2_ACCESS_KEY_ID || '',
  SECRET_ACCESS_KEY: process.env.EXPO_PUBLIC_R2_SECRET_ACCESS_KEY || '',
  BUCKET_NAME: process.env.EXPO_PUBLIC_R2_BUCKET_NAME || '',
};

// Helper function to construct full URLs for your MP3 files
export const getR2Url = (fileName: string): string => {
  return `${CLOUDFLARE_R2_CONFIG.BUCKET_URL}/${fileName}`;
};

// Example usage:
// const mp3Url = getR2Url('songs/bag-feat-yung-bans.mp3');
// const albumArtUrl = getR2Url('covers/chance-the-rapper-bag.jpg');
