"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/form";

type SortByProps = {
    options: Array<{ value: string; label: string }>;
    sortByKey?: string;
};

function SortBy({ options ,sortByKey}: SortByProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sortBy = searchParams.get((sortByKey||"sortBy")) || "";
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set((sortByKey||"sortBy"), e.target.value);
        router.replace(`${window.location.pathname}?${newParams.toString()}`);
    }

    return (
        <Select
            options={options}
            type="white"
            value={sortBy}
            onChange={handleChange}
        />
    );
}

export default SortBy;
