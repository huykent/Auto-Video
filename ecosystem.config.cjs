module.exports = {
  apps: [
    {
      name: 'auto-video-web',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/Auto-Video',
      env: {
        NODE_ENV: 'production',
        PORT: 3008,
      },
    },
    {
      name: 'auto-video-worker',
      script: './node_modules/.bin/tsx',
      args: 'lib/worker/index.ts',
      cwd: '/var/www/Auto-Video',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
