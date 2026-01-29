"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

interface VerificationCodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function VerificationCodeInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const digits = value.padEnd(length, " ").split("").slice(0, length);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Only allow digits
    const sanitized = digit.replace(/\D/g, "");
    if (sanitized.length === 0 && digit !== "") return;

    const newDigits = [...digits];
    newDigits[index] = sanitized[0] || " ";
    const newValue = newDigits.join("").trim();
    onChange(newValue);

    // Auto-focus next input
    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (!digits[index] || digits[index] === " ") {
        // Move to previous input if current is empty
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current input
        const newDigits = [...digits];
        newDigits[index] = " ";
        onChange(newDigits.join("").trim());
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const sanitized = pastedData.replace(/\D/g, "").slice(0, length);

    if (sanitized) {
      onChange(sanitized);
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(sanitized.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el) as any}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit === " " ? "" : digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-2xl font-semibold",
            error && "border-destructive",
            focusedIndex === index && "ring-2 ring-primary",
          )}
        />
      ))}
    </div>
  );
}
