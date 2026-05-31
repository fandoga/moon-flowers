module.exports = {
  apps: [
    {
      name: "moon-flowers",
      script: "server.js",
      cwd: "/var/www/moon-flowers",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
