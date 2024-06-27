import env from "../../env.json";

interface IEnvConfig {
  mongoURL: string;
  host: string;
  port: number;
  secretKey: string;
}

const envConfig = (): IEnvConfig => {
  const nodeEnv = (process.env.NODE_ENV as keyof typeof env) || "local";

  return env[nodeEnv];
};

export default envConfig;
