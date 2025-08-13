interface ApiConfig {
  API_URL: string;
  version: string;
}

interface Config {
  api: ApiConfig;
}

const config: Config = {
  api: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    version: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  },
};

export default config;
