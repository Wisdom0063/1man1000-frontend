export default {
  api: {
    input: "http://localhost:6004/api/docs.json",
    output: {
      target: "./src/api/generated.ts",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts",
          name: "axiosInstance",
        },
      },
    },
  },
};
