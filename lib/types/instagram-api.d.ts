declare module "@jerrycoder/instagram-api" {
  interface InstagramResult {
    type: string;
    url: string;
    thumbnail?: string;
    message?: string;
    status?: string;
  }

  export function instagram(
    url: string
  ): Promise<InstagramResult>;
}