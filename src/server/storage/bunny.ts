const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const ACCESS_KEY = process.env.BUNNY_STORAGE_PASSWORD!;
const REGION = process.env.BUNNY_REGION!;
const CDN_URL = process.env.BUNNY_CDN_URL!;

export class BunnyStorageProvider {
  async upload(file: File, filename: string) {
    const arrayBuffer = await file.arrayBuffer();

    const endpoint =
      REGION === "de"
        ? `https://storage.bunnycdn.com/${STORAGE_ZONE}/${filename}`
        : `https://${REGION}.storage.bunnycdn.com/${STORAGE_ZONE}/${filename}`;

    await fetch(endpoint, {
      method: "PUT",
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": file.type,
      },
      body: Buffer.from(arrayBuffer),
    });

    return `${CDN_URL}/${filename}`;
  }

  getUrl(filename: string) {
    return `${CDN_URL}/${filename}`;
  }

  async delete(filename: string) {
    const endpoint =
      REGION === "de"
        ? `https://storage.bunnycdn.com/${STORAGE_ZONE}/${filename}`
        : `https://${REGION}.storage.bunnycdn.com/${STORAGE_ZONE}/${filename}`;

    await fetch(endpoint, {
      method: "DELETE",
      headers: {
        AccessKey: ACCESS_KEY,
      },
    });
  }
}