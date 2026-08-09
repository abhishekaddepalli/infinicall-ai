"use client";

import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <AuthPageWrapper>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthPageWrapper>
  );
};

export default ResetPasswordPage;
