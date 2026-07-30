"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AuthInputProps } from "@/types";
import { useField } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const AuthInput = ({ label, name, type = "text", placeholder, rightElement, leftIcon }: AuthInputProps) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <Label htmlFor={name} className="block text-md font-semibold text-title">
          {label}
        </Label>
        {rightElement}
      </div>
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-[#64748b] pointer-events-none w-5 h-5 flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <Input
          {...field}
          type={inputType}
          id={name}
          className={cn(
            "block h-11 w-full bg-input-color border outline-none transition-all duration-200 placeholder:text-subtitle-color text-title focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#107e86] focus:ring-1 focus:ring-[#107e86]/20",
            leftIcon ? "pl-11" : "pl-4",
            isPasswordField ? "pr-11" : "pr-4",
            meta.touched && meta.error
              ? "border-destructive focus:border-destructive focus:ring-destructive/10"
              : "border-input-border-color"
          )}
          placeholder={placeholder}
        />
        
        {isPasswordField && (
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute p-0! w-8 h-8 right-3 top-1 flex items-center justify-center cursor-pointer text-subtitle-color transition-colors bg-transparent hover:bg-transparent shadow-none border-none focus:outline-none focus:ring-0 active:translate-y-0!"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        )}
      </div>
      {meta.touched && meta.error ? (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default AuthInput;
