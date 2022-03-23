module.exports = {
  apps: [
    {
      name: "Vision_ERP",
      script: "src/index.ts",
      watch: true,
      ignore_watch: ["Example.xlsx"],
      restart_delay: 3000,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
