"use client";

import { Label } from "@/components/ui/label";
import { OtpInputProps } from "@/types/auth";
import { useField } from "formik";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";

export const OtpInput = ({ name, label }: OtpInputProps) => {
  const [field, meta, helpers] = useField(name);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (field.value && typeof field.value === "string") {
      const chars = field.value.split("").slice(0, 6);
      const timer = setTimeout(() => {
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          chars.forEach((char, index) => {
            newOtp[index] = char;
          });
          return newOtp;
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [field.value]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    helpers.setValue(newOtp.join(""));

    // Move to next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        helpers.setValue(newOtp.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    helpers.setValue(newOtp.join(""));
    
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <Label className="block text-md font-semibold text-title">
          {label}
        </Label>
      )}
      <div className="flex gap-2 justify-between">
        {otp.map((data, index) => {
          return (
            <Input
              className={`w-12 h-12 text-center text-xl font-bold bg-input-color border outline-none transition-all duration-200 text-title focus:border-[#107e86] focus:ring-1 focus:ring-[#107e86]/20 rounded-md
              ${
                meta.touched && meta.error
                  ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                  : "border-input-border-color"
              }`}
              type="text"
              name={name}
              maxLength={1}
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
            />
          );
        })}
      </div>
      {meta.touched && meta.error ? (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
};
