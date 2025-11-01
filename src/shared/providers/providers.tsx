"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Toaster } from "@/shared/ui/sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}

      <Toaster richColors />
    </GoogleReCaptchaProvider>
  );
};

export { Providers };
