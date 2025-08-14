import axios from "axios";

export const detectUserLanguage = async (): Promise<string> => {
  const response = (await axios.get("https://geo.myip.link/")) as {
    languages: string;
  };
  return response?.languages || "en";
};
