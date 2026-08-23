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
      instances: 1,
      exec_mode: 'fork',
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
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
    },
  ],
};
