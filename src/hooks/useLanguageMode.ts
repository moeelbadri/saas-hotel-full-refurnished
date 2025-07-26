import { useContext } from "react";
import { DarkModeContext } from "@/context/DarkModeContext";

function useLanguageMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined)
        throw new Error("DarkModeContext was used outside of DarkModeProvider");
    return context;
}

export default useLanguageMode;

