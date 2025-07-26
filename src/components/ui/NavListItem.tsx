"use client"; // This file must be a Client Component to use usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import React from "react";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const StyledNextLink = styled(Link)<{ $isActive?: boolean; language?: string }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  color: var(--color-grey-600);
  font-size: 1.6rem;
  font-weight: 600;
  padding: 1.3rem 1.25rem;
  @media (max-width: 1200px) {
    padding: 1.3rem 0.90rem;
  }
  transition: all 0.3s ease;
    @media (pointer: fine) {
     &:hover {
      // transform: ${(props) => props.language === "en" ? "translateX(1rem)" : "translateX(-1rem)"};
    }
  }
   @media (pointer: coarse) {
     & svg {
          // margin-left:  ${({ $isActive, language }) => $isActive ? (language === "en" ? "0.5rem" : "0rem") : "0rem"};
          // margin-right: ${({ $isActive, language }) => $isActive ? (language === "en" ? "0rem" : "0.5rem") : "0rem"};
     }
   }
  /* Hover/active styles */
  &:hover {
    color: var(--color-grey-800);
    background-color: var(--color-grey-300);
     border-radius: var(--border-radius-sm);
    @media (pointer: fine) {
      border-radius: 30px;
    }
  }
  &:active {
    color: var(--color-grey-800);
    background-color: var(--color-grey-300);
  }

  /* Conditionally apply "active" styles based on the $isActive prop */
  ${({ $isActive }) => $isActive &&
    ` color: var(--color-grey-800);
      background-color: var(--color-grey-300);
      border-radius: var(--border-radius-sm);
    `}
  & span {
    white-space: nowrap;      /* no wrapping */
    overflow: hidden;         /* hide overflow */
    text-overflow: ellipsis;  /* show ... if text too long */
    flex-shrink: 1;           /* allow shrinking */
  }
  /* SVG styling */
  & svg {
    // width: 3.5rem;
    // height: auto;
    flex-shrink:0;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg {
    color: var(--color-brand-600);
  }

  /* If it's active, also style the SVG */
  ${({ $isActive }) => $isActive &&
    `
      & svg {
        color: var(--color-brand-600);
      }
    `}
`;

type NavListItemProps = {
  href: string;                 // Next.js uses "href" instead of "to"
  label: string;
  icon: React.ReactElement;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function NavListItem({
  href,
  label,
  icon,
  onMouseEnter,
  onMouseLeave,
}: NavListItemProps) {
  // Get the current path from Next.js
  const pathname = usePathname();
  const Language = useSettingsStore(state => state.Language);
  
  // Determine if this link is "active"
  // You can customize this logic depending on whether you want
  // exact matches or partial (like startsWith)
  const isActive = pathname === href;

  return (
    <li>
      <StyledNextLink
        href={href}
        $isActive={isActive}
        language={Language}
        onMouseLeave={onMouseLeave}
      >
        {icon}
        <span>{label}</span>
      </StyledNextLink>
    </li>
  );
}
