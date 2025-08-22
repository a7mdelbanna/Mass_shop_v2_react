import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url?: string): string | undefined {
  // Check if the URL contains 'drive.google.com'
  if (!url.includes("drive.google.com")) return null;

  let fileId: string | null = null;

  try {
    // Handle common formats like:
    // https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch && fileMatch[1]) {
      fileId = fileMatch[1];
    }

    // Handle uc?export=download&id=FILE_ID
    const idParamMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (!fileId && idParamMatch && idParamMatch[1]) {
      fileId = idParamMatch[1];
    }

    if (!fileId) return null;

    // Return the embeddable version
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch (err) {
    console.error("Error parsing Google Drive URL:", err);
    return null;
  }
}
