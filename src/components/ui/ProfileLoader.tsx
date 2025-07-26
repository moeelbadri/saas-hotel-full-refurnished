// components/ProfileLoader.tsx
"use client";

import styled from "styled-components";
import { Spinner } from "@/components/ui";
import { useGetProfile } from "@/hooks/authentication";
import { Skeleton } from "@/components/ui/skeleton"


const FullPageLoader = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;

  /* overlay color + allow the blur to show through */
  background-color: var(--color-grey-0);

  /* the magic: blur whatever is behind this element */
//   backdrop-filter: blur(5px);
//   -webkit-backdrop-filter: blur(5px);
`;
const ErrorIcon = styled.div`
  font-size: 4rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.6rem;
  color: red;
`;
export default function ProfileLoader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, error } = useGetProfile();

  if (!isLoading && !error) return children;

  return (
    <FullPageLoader>
      {isLoading && <Spinner/>}
      {error && (
        <>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>{error.message}</ErrorMessage>
        </>
      )}
    </FullPageLoader>
  );
}