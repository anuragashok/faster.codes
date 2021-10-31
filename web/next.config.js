module.exports = {
  reactStrictMode: true,
  exportPathMap: async function (defaultPathMap) {
    return {
      "/": { page: "/" },
    };
  },
};
