module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  exportPathMap: async function (defaultPathMap) {
    return {
      "/": { page: "/[[...runId]]" },
    };
  },
};
