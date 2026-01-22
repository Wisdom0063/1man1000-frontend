import { createWorker, Worker } from "tesseract.js";
import { Platform } from "./imageValidationService";

let workerInstance: Worker | null = null;
let workerTimeout: NodeJS.Timeout | null = null;

const getWorker = async (): Promise<Worker> => {
  if (workerTimeout) {
    clearTimeout(workerTimeout);
    workerTimeout = null;
  }

  if (!workerInstance) {
    console.log("🔧 Initializing OCR worker...");
    workerInstance = await createWorker("eng");
  }
  return workerInstance;
};

const scheduleWorkerTermination = () => {
  if (workerTimeout) clearTimeout(workerTimeout);

  workerTimeout = setTimeout(async () => {
    if (workerInstance) {
      console.log("💤 Terminating idle OCR worker...");
      await workerInstance.terminate();
      workerInstance = null;
    }
  }, 30000);
};

export const extractViewCount = async (
  imageFile: File,
  platform: Platform,
): Promise<number> => {
  console.log(`🔍 Starting OCR for ${platform} screenshot...`);

  try {
    const worker = await getWorker();
    const {
      data: { text },
    } = await worker.recognize(imageFile);
    scheduleWorkerTermination();

    console.log("📝 OCR Raw Text:", text);

    const cleanText = text.toLowerCase();

    const viewsRegex = /([\d,.]+[km]?)\s*views?/i;
    const viewsMatch = cleanText.match(viewsRegex);

    if (viewsMatch) {
      const count = parseNumberString(viewsMatch[1]!);
      if (count > 0) return count;
    }

    if (platform === "whatsapp") {
      const timeRegex = /\d{1,2}:\d{2}/g;
      const textWithoutTime = text.replace(timeRegex, "");

      const numbers = textWithoutTime.match(/\b\d+\b/g);
      if (numbers) {
        const candidates = numbers
          .map((n) => parseInt(n, 10))
          .filter((n) => !isNaN(n) && n > 5);

        if (candidates.length > 0) {
          return Math.max(...candidates);
        }
      }
    } else if (platform === "instagram") {
      const numbers = text.match(/\b\d+\b/g);
      if (numbers) {
        const candidates = numbers
          .map((n) => parseInt(n, 10))
          .filter((n) => !isNaN(n) && n > 10);

        if (candidates.length > 0) {
          return Math.max(...candidates);
        }
      }
    } else if (platform === "tiktok") {
      const numbers = text.match(/\b\d+\b/g);
      if (numbers) {
        const candidates = numbers
          .map((n) => parseInt(n, 10))
          .filter((n) => !isNaN(n) && n > 10);

        if (candidates.length > 0) {
          return Math.max(...candidates);
        }
      }
    } else if (platform === "facebook") {
      const numbers = text.match(/\b\d+\b/g);
      if (numbers) {
        const candidates = numbers
          .map((n) => parseInt(n, 10))
          .filter((n) => !isNaN(n) && n > 5);

        if (candidates.length > 0) {
          return Math.max(...candidates);
        }
      }
    }

    console.warn("⚠️ No view count found in OCR text");
    return 0;
  } catch (error) {
    console.error("❌ OCR Failed:", error);
    return 0;
  }
};

const parseNumberString = (str: string): number => {
  let clean = str.replace(/,/g, "").toLowerCase();

  let multiplier = 1;
  if (clean.endsWith("k")) {
    multiplier = 1000;
    clean = clean.slice(0, -1);
  } else if (clean.endsWith("m")) {
    multiplier = 1000000;
    clean = clean.slice(0, -1);
  }

  const num = parseFloat(clean);
  return Math.round(num * multiplier);
};
