"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  padding: 0.3rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  gap: 0.4rem;
`;

type FilterButtonProps = { $active?: boolean };

const FilterLink = styled(Link)<FilterButtonProps>`
  position: relative;
  padding: 0.5rem 0.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 7.5px;
  background: transparent;
  color: var(--color-grey-700);
  text-decoration: none;
  transition:
    background 0.35s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.25s ease,
    color 0.35s ease;

  ${({ $active }) => $active && css`
    background: var(--color-brand-600);
    color: var(--color-brand-50);
    border-color: var(--color-brand-600);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    pointer-events: none;
  `}

  &:hover {
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
`;

type FilterProps = {
  filterField: string;
  options: Array<{ value: string; label: string }>;
};

export default function Filter({ filterField, options }: FilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(filterField) || options[0].value;

  return (
    <StyledFilter>
      {options.map((opt) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(filterField, opt.value);
        if (params.has("page")) params.set("page", "1");

        const href = `${pathname}?${params.toString()}`;

        return (
          <FilterLink
            key={opt.value}
            href={href}
            $active={opt.value === current}
          >
            {opt.label}
          </FilterLink>
        );
      })}
    </StyledFilter>
  );
}
