import { parse } from "exifr";

export type Platform = "whatsapp" | "instagram" | "facebook" | "tiktok";

export interface ImageValidationResult {
  isValid: boolean;
  isFlagged: boolean;
  flags: string[];
  details: {
    software?: string;
    dimensions: { width: number; height: number };
    fileSize: number;
    hasExif: boolean;
    aspectRatio: number;
    fileHash?: string;
  };
}

const generateFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const MIN_FILE_SIZE = 50 * 1024; // 50KB

export const validateImage = async (
  file: File,
  platform: Platform,
): Promise<ImageValidationResult> => {
  console.log(`🔍 Validating image for ${platform}...`);

  const flags: string[] = [];

  const fileHash = await generateFileHash(file);
  console.log("🔐 File hash:", fileHash);

  const dimensions = await getImageDimensions(file);
  const fileSize = file.size;
  const aspectRatio = dimensions.width / dimensions.height;

  let hasExif = false;
  let software: string | undefined;

  try {
    const exif = await parse(file);
    hasExif = exif !== null && exif !== undefined;

    console.log("📸 EXIF Data Retrieved:", exif);

    if (hasExif && exif.Software) {
      software = exif.Software;

      console.log("🔧 Software detected:", software);

      const editingSoftware = [
        "Adobe Photoshop",
        "Photoshop",
        "GIMP",
        "Paint.NET",
        "Affinity Photo",
        "Pixlr",
        "Canva",
      ];

      const isEdited = editingSoftware.some((sw) =>
        software?.toLowerCase().includes(sw.toLowerCase()),
      );

      if (isEdited) {
        flags.push(`Edited in ${software}`);
      }
    } else if (!hasExif) {
      flags.push("Missing EXIF metadata");
    }
  } catch (error) {
    console.warn("Could not parse EXIF data:", error);
    flags.push("Missing EXIF metadata");
  }

  if (fileSize < MIN_FILE_SIZE) {
    flags.push(
      `Suspicious file size (${(fileSize / 1024).toFixed(1)}KB - too small)`,
    );
  }

  const isFlagged = flags.length > 0;

  console.log(`${isFlagged ? "🚩" : "✅"} Validation result:`, {
    isFlagged,
    flags,
    dimensions,
    fileSize: `${(fileSize / 1024).toFixed(1)}KB`,
  });

  return {
    isValid: true,
    isFlagged,
    flags,
    details: {
      software,
      dimensions,
      fileSize,
      hasExif,
      aspectRatio,
      fileHash,
    },
  };
};

const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = reject;

    reader.readAsDataURL(file);
  });
};
