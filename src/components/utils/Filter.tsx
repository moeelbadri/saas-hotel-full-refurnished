// /components/Filter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);        /* container border */
  padding: 0.3rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  gap: 0.4rem;
`;

type FilterButtonProps = { $active?: boolean };

const FilterButton = styled.button<FilterButtonProps>`
  position: relative;
  padding: 0.5rem 0.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  border: 1px solid transparent;                  /* base border */
  border-radius: 7.5px;
  background: transparent;
  color: var(--color-grey-700);
  transition:
    background 0.35s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.25s ease,
    color 0.35s ease;

  /* active state: filled + matching border */
  ${({ $active }) => $active && css`
    background: var(--color-brand-600);
    color: var(--color-brand-50);
    border-color: var(--color-brand-600);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `}

  /* hover (only if not disabled) */
  &:hover:not(:disabled) {
    background: var(--color-brand-50);
    color: var(--color-brand-600);
    border-color: var(--color-brand-600);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  }

  &:focus-visible {
    outline: 2px solid var(--color-brand-600);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.85;
  }
`;

type FilterProps = {
  filterField: string;
  options: Array<{ value: string; label: string }>;
};

export default function Filter({ filterField, options }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(filterField) || options[0].value;

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filterField, value);
    if (params.has("page")) params.set("page", "1");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <StyledFilter>
      {options.map(opt => (
        <FilterButton
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          $active={opt.value === current}
          disabled={opt.value === current}
        >
          {opt.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}
