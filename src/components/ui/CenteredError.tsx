// components/CenteredError.tsx
"use client";
import styled from "styled-components";
import { Button, Spinner } from "@/components/ui";

const ErrorContainer = styled.div`
  /* fill its parent */
  width: 100%;
  height: 100%;
  /* center content */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* styling */
  background-color: var(--color-grey-50);
  color: var(--color-red-700);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-md);
  // border: 1px solid var(--color-grey-400);
  gap: 1rem;
`;
const LoadingContainer = styled.div`
/* fill its parent */
  width: 100%;
  height: 100%;
  /* center content */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
   padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-md);
  gap: 1rem;
`
const ErrorIcon = styled.div`
  font-size: 4rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.6rem;
`;

type Props = {
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
  children?: React.ReactNode;
};

export default function CenteredError({ error, onRetry, children, isLoading }: Props) {
 
  return (
    <>
     {isLoading && (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
     )}
     {error && (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>{error.message}</ErrorMessage>
          {onRetry && <Button onClick={onRetry}>Try Again</Button>}
        </ErrorContainer>
      )}
      {(!isLoading && !error) && children}
    </>
  );
}
