"use client";

import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { Suspense } from "react";

const VerifyOtpPage = () => {
  return (
    <AuthPageWrapper>
      <Suspense fallback={null}>
        <VerifyOtpForm />
      </Suspense>
    </AuthPageWrapper>
  );
};

export default VerifyOtpPage;
