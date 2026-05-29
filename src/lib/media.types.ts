export type MediaStorageProviderName =
  | "local"
  | "bunny"
  | "cloudflare-r2"
  | "aws-s3"
  | "backblaze-b2"
  | "wasabi";

export interface VideoSource {
  label: string;
  url: string;
  mimeType: string;
  provider: MediaStorageProviderName;
}

export interface VideoRecord {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  storageProvider: MediaStorageProviderName;
  category: string;
  tags: string[];
  featured?: boolean;
  subtitleUrl?: string;
  sources?: VideoSource[];
  createdAt: string;
  updatedAt: string;
}
