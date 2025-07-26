"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Users } from "lucide-react";

/* ── Styled UI parts ─────────────────────────────────────── */
const Wrapper = styled.nav<{ rtl: string }>`
  width: 100%;
  padding: 1rem 0;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  direction: ${({ rtl }) => (rtl === "true" ? "rtl" : "ltr")};
  top: 1px;
  z-index: 45;
`;

const CrumbLink = styled(Link)<{ rtl: string }>`
  color: var(--color-primary-700);
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  ${({ rtl }) =>
    rtl === "true" &&
    css`
      margin-left: 0.4rem;
    `}
`;

const CrumbText = styled.span<{ rtl: string }>`
  color: var(--color-grey-600);
  font-weight: 600;
  ${({ rtl }) =>
    rtl === "true" &&
    css`
      margin-left: 0.4rem;
    `}
`;

const SeparatorLtr = styled(HiChevronRight)`
  flex-shrink: 0;
  font-size: 1.6rem;
  color: var(--color-grey-400);
`;

const SeparatorRtl = styled(HiChevronLeft)`
  flex-shrink: 0;
  font-size: 1.6rem;
  color: var(--color-grey-400);
`;

/* ── Map raw URL segments to translated labels ───────────── */
const LABEL_MAP: Record<string, { en: string; ar: string }> = {
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  rooms: { en: "Rooms", ar: "الغرف" },
  settings: { en: "Settings", ar: "الإعدادات" },
  bookings: { en: "Bookings", ar: "الحجوزات" },
  alerts: { en: "Alerts", ar: "التنبيهات" },
  users: { en: "Users", ar: "المستخدمون" },
  discounts: { en: "Discounts", ar: "الخصومات" },
  storage: { en: "Storage", ar: "المخزن" },
  // …add more as needed
};

/* ── Helper: prettify and translate a segment ─────────────── */
function prettify(segment: string, locale: "en" | "ar") {
  if (LABEL_MAP[segment]) {
    return LABEL_MAP[segment][locale];
  }
  // fallback: turn "user-profile" → "User Profile"
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Breadcrumb component ─────────────────────────────────── */
export default function BreadcrumbAuto() {
  const locale = useSettingsStore((s) => s.Language) as "en" | "ar";
  const isRtl = locale === "ar";
  const pathname = usePathname();           // e.g. "/dashboard/rooms/123"
  const segments = pathname.split("/").filter(Boolean);

  // always start with Home/الرئيسية
  const crumbs = [
    { label: locale === "en" ? "Home" : "الرئيسية", href: "/" },
    ...segments.map((seg, idx) => ({
      label: prettify(seg, locale),
      // last segment gets no link
      href:
        idx === segments.length - 1
          ? ""
          : "/" + segments.slice(0, idx + 1).join("/"),
    })),
  ];

  const Separator = isRtl ? SeparatorRtl : SeparatorLtr;

  return (
    <Wrapper aria-label="Breadcrumb" rtl={isRtl.toString()}>
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={idx} style={{ display: "flex", alignItems: "center" }}>
            {crumb.href ? (
              <CrumbLink href={crumb.href} rtl={isRtl.toString()}>
                {crumb.label}
              </CrumbLink>
            ) : (
              <CrumbText rtl={isRtl.toString()}>{crumb.label}</CrumbText>
            )}
            {!isLast && <Separator aria-hidden="true" />}
          </span>
        );
      })}
    </Wrapper>
  );
}
