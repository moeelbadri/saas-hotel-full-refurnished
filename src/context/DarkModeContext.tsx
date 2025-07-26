"use client";

import { createContext, ReactNode, useEffect, forwardRef, Ref } from "react";
import { useLocalStorageState } from "@/hooks"; // your custom hook

type DarkModeCtxType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isRtl: boolean;
  toggleDirection: () => void;
};

export const DarkModeContext = createContext<DarkModeCtxType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  isRtl: false,
  toggleDirection: () => {},
});

type DarkModeProviderProps = {
  children: ReactNode;
};

const DarkModeProvider = forwardRef<HTMLDivElement, DarkModeProviderProps>(
  ({ children }, ref) => {
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(
      window.matchMedia("(prefers-color-scheme: dark)").matches,
      "isDarkMode"
    );
    const [isRtl, setIsRtl] = useLocalStorageState(false, "isRtl");

    useEffect(() => {
      const root = document.documentElement;
      if (isDarkMode) {
        root.classList.add("dark-mode");
        root.classList.remove("light-mode");
      } else {
        root.classList.add("light-mode");
        root.classList.remove("dark-mode");
      }

      if (isRtl) {
        root.setAttribute("dir", "rtl");
        root.setAttribute("lang", "ar");
      } else {
        root.setAttribute("dir", "ltr");
        root.setAttribute("lang", "en");
      }
    }, [isDarkMode, isRtl]);

    const toggleDarkMode = () => setIsDarkMode((prev: any) => !prev);
    const toggleDirection = () => setIsRtl((prev: any) => !prev);

    return (
      <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, isRtl, toggleDirection }}>
        <div ref={ref as Ref<HTMLDivElement>}>{children}</div>
      </DarkModeContext.Provider>
    );
  }
);

export default DarkModeProvider;




// "use client";

// import { LegacyRef, ReactNode, createContext, forwardRef, useEffect } from "react";
// import { useLocalStorageState } from "@/hooks";
// import { useUser } from "@/hooks/authentication";
// import { Spinner } from "@/components/ui";
// type DarkModeCtxType = {
//     isDarkMode: boolean;
//     toggleDarkMode: () => void;
//     isRtl: boolean;
//     toggleDirection: () => void;
// };

// export const DarkModeContext = createContext<DarkModeCtxType>({
//     isDarkMode: false,
//     toggleDarkMode: () => {},
//     isRtl: false,
//     toggleDirection: () => {},
// });

// type DarkModeProviderProps = {
//     children: ReactNode;
// };
// const DarkModeProvider = forwardRef(({ children }: DarkModeProviderProps, ref) => {
//     // const {data,isLoading}=useUser();
//     const [isDarkMode, setIsDarkMode] = useLocalStorageState(
//         window.matchMedia("(prefers-color-scheme: light)").matches,
//         "isDarkMode"
//     );
//     const [isRtl, setIsRtl] = useLocalStorageState(false, "isRtl");

//     useEffect(() => {
//         if (isDarkMode) {
//             document.documentElement.classList.add("dark-mode");
//             document.documentElement.classList.remove("light-mode");
//         } else {
//             document.documentElement.classList.add("light-mode");
//             document.documentElement.classList.remove("dark-mode");
//         }
    
//            if (isRtl) {
//                 document.documentElement.setAttribute("dir", "rtl");
//                 document.documentElement.setAttribute("lang", "ar");
//             } else {
//                 document.documentElement.setAttribute("dir", "ltr");
//             }
//     }, [isDarkMode, isRtl]);

//     function toggleDarkMode() {
//         setIsDarkMode((isDark: boolean) => !isDark);
//     }
//     function toggleDirection() {
//         setIsRtl((rtl: boolean) => !rtl);
//     }
//     return (
//         <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode,isRtl, toggleDirection  }}>
// <div ref={ref as LegacyRef<HTMLDivElement>}>{children}</div>
//         </DarkModeContext.Provider>
//     );
// });

// export default DarkModeProvider;
