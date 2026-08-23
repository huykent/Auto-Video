module.exports = {
  apps: [
    {
      name: 'auto-video-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      cwd: '/var/www/Auto-Video',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
    },
    {
      name: 'auto-video-worker',
      script: 'npx',
      args: 'tsx lib/worker/index.ts',
      cwd: '/var/www/Auto-Video',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
