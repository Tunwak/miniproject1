module.exports = {
  apps: [
    {
      name: 'mini-backend-api',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
      log_file: './logs/pm2.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log'
    }
  ]
};
