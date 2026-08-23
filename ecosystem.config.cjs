module.exports = {
  apps: [
    {
      name: 'auto-video-web',
      script: './node_modules/next/dist/bin/next',
      args: 'start -p 3008',
      cwd: '/var/www/Auto-Video',
      env: {
        NODE_ENV: 'production',
        PORT: 3008,
      },
    },
    {
      name: 'auto-video-worker',
      script: './node_modules/tsx/dist/cli.js',
      args: 'lib/worker/index.ts',
      cwd: '/var/www/Auto-Video',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
