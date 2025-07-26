"use client"; // ✅ Force this component to be a Client Component

import { ReactNode } from "react";
// import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

// import { I18nextProvider } from "react-i18next"; 
import dynamic from "next/dynamic";
// Dynamically import *just* the I18nextProvider named export
const DynamicI18nextProvider = dynamic(
  () =>
    import("react-i18next").then((mod) => {
      // Return the named export as a default
      return mod.I18nextProvider;
    }),
  {
    ssr: false, // Disable SSR for i18n
  }
);
export default function I18nProvider({ children }: { children: ReactNode }) {
    return <DynamicI18nextProvider i18n={i18n}>{children}</DynamicI18nextProvider>;
}
