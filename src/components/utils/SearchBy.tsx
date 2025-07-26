"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/form";
import { useSettingsStore } from "@/components/WizardForm/useStore";

export default function SortBy() {
    const Language = useSettingsStore(state => state.Language);

    const searchParams = useSearchParams();
    const router = useRouter();
    const searchBy = searchParams.get("SearchBy") || "";
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setTimeout(() => {
            console.log(e.target.value,searchBy);
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("SearchBy", e.target.value);
            router.replace(`${window.location.pathname}?${newParams.toString()}`);
        }, 300);
    }

    return (
       <Input
        defaultValue={searchBy}
        placeholder={Language==="en"?"Search":"بحث"}
        onInput={(e:any)=>handleChange(e)}
       ></Input>
    );
}