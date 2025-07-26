"use client";
import styled from "styled-components";
import { LoginForm } from "@/features/authentication";
import { useTranslation } from "react-i18next";
const LoginLayout = styled.main`
    min-height: 100vh;
    min-width: 100vw;
    display: grid;
    grid-template-columns: 48rem;
    align-content: center;
    justify-content: center;
    gap: 2rem;
    /* sky illustration like reference #2 */
  background: radial-gradient(
      circle at top center,
      var(--color-brand-50) 0%,
      transparent 70%
    ),
    var(--color-grey-50);
`;
export default function LoginPage() {
    const { t } = useTranslation(); // Hook to use translations
    return (
        <LoginLayout>
            <LoginForm />
        </LoginLayout>
    );
}
