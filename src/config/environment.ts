// Environment Configuration for Cloudflare R2
// Update these values with your actual R2 bucket details

export const ENV_CONFIG = {
  // Your Cloudflare R2 bucket public URL
  R2_BUCKET_URL: 'https://pub-2d62457c15f24c3cba63561b98fd1b94.r2.dev',
  
  // Alternative: If you have a custom domain for your R2 bucket
  // R2_BUCKET_URL: 'https://music.yourdomain.com',
  
  // R2 API credentials (for future upload functionality)
    R2_ACCOUNT_ID: '4842142376ec4be9e187834dd7e0d2fa',
    R2_ACCESS_KEY_ID: 'your_access_key_id_here', 
    R2_SECRET_ACCESS_KEY: 'your_secret_access_key_here',
    R2_BUCKET_NAME: 'quran',
};

// Helper function to construct full URLs for your MP3 files
export const getR2Url = (fileName: string): string => {
  return `${ENV_CONFIG.R2_BUCKET_URL}/${fileName}`;
};

// Example usage:
// const mp3Url = getR2Url('songs/bag-feat-yung-bans.mp3');
// const albumArtUrl = getR2Url('covers/chance-the-rapper-bag.jpg');
