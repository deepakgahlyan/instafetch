import { instagram } from "@jerrycoder/instagram-api";

export async function extractInstagramMedia(url: string) {
  console.log("Calling Instagram API...");

  const result = await instagram(url);

  console.log("RAW INSTAGRAM RESULT:", result);

  if (!result || !result.url) {
    throw new Error("No downloadable media found.");
  }

  return [
    {
      url: result.url,
      thumbnail: result.thumbnail,
      type: result.type,
    },
  ];
}