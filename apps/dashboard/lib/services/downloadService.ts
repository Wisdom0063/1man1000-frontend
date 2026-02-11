import { useAuthStore } from "@/lib/auth-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface DownloadOptions {
  filename?: string;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

/**
 * Download a campaign asset from storage with authentication
 * @param assetUrl - The Google Storage URL of the asset
 * @param campaignName - Name for the downloaded file
 * @param options - Optional callbacks and filename override
 */
export async function downloadCampaignAsset(
  assetUrl: string,
  campaignName: string,
  options: DownloadOptions = {}
): Promise<void> {
  const { filename, onError, onSuccess } = options;

  // Get token from auth store
  const token = useAuthStore.getState().token;

  if (!token) {
    const error = new Error("Authentication required");
    onError?.(error);
    throw error;
  }

  const downloadUrl = `${API_BASE_URL}/api/campaigns/download/asset?url=${encodeURIComponent(assetUrl)}`;

  try {
    const response = await fetch(downloadUrl, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication expired. Please log in again.");
      }
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || `${campaignName}-asset`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    onSuccess?.();
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Download failed");
    onError?.(err);
    throw err;
  }
}

/**
 * Hook-compatible version that can be used in React components
 * Returns a handler function
 */
export function useCampaignAssetDownload() {
  return {
    download: downloadCampaignAsset,
  };
}
