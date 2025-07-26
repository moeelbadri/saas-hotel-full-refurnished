"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";

interface SortByProps {
  sortBy: string;
}

export default function SortBy({ sortBy }: SortByProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSort = searchParams.get("sortBy");
  if(!sortBy) return null

  const handleClick = () => {
    const newSort = currentSort === sortBy + "-desc" ? sortBy + "-asc" : sortBy + "-desc";
    // Create new URLSearchParams based on current search parameters
    const newParams = new URLSearchParams(Array.from(searchParams.entries()));
    newParams.set("sortBy", newSort);
    // Update the URL with the new search parameters
    router.replace(`${window.location.pathname}?${newParams.toString()}`);
  };

  return (
    <button
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        alignItems: "center",
        verticalAlign: "middle",
        padding: 0,
        marginBottom: 4,
      }}
      onClick={handleClick}
    >
      {currentSort === sortBy + "-desc" ? (
        <HiArrowDown size={18} />
      ) : (
        <HiArrowUp size={18} />
      )}
    </button>
  );
}
