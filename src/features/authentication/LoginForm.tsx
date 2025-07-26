/* ======================================================================== *
 *  components/AuthBox.tsx                                                  *
 *  Modern auth card (light & dark, glass-morphism)                         *
 *  Built to work with the palette in GlobalStyles                          *
 *  Dependencies: styled-components, react-icons                            *
 * ======================================================================== */

"use client";

import { useState } from "react";
import styled from "styled-components";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiLogIn, FiUserPlus } from "react-icons/fi";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { Logo } from "@/components/ui";
import { useLogin, useSignup } from "@/hooks/authentication";
import { useTranslation } from "react-i18next";

/* ---------------------------- styled helpers ---------------------------- */
const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 3rem 3.2rem 2.5rem;
  border-radius: var(--border-radius-lg);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--color-grey-200);
  @media (prefers-color-scheme: dark) {
    background: rgba(17, 24, 39, 0.75);
    color: var(--color-grey-200);
  }
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  font-weight: var(--fw-medium);
  color: ${({ active }) =>
    active ? "var(--color-brand-200)" : "var(--color-grey-600)"};
  background: ${({ active }) =>
    active ? "var(--color-brand-700)" : "transparent"};

  &:hover {
    background: var(--color-brand-600);
    color: var(--color-brand-200);
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.4rem;
  font-weight: var(--fw-semibold);
  color: var(--color-grey-600);
  margin: 1.6rem 0 0.6rem;
`;

const Field = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--color-grey-100);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding-inline: 1.2rem;
  margin-bottom: 1.6rem;
  cursor: text;

  @media (prefers-color-scheme: dark) {
    background: var(--color-grey-900);
    border-color: var(--color-grey-700);
  }

  svg:first-child {
    flex-shrink: 0;
    font-size: 1.6rem;
    color: var(--color-grey-400);
  }

  input {
    all: unset;
    flex: 1;
    padding: 1.2rem 1rem;
    font-size: 1.4rem;
    color: inherit;
    &::placeholder {
      color: var(--color-grey-400);
    }
  }
`;

const TogglePw = styled.button`
  all: unset;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  color: var(--color-grey-400);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.4rem;
  font-size: 1.2rem;
  color: var(--color-brand-200);

  a {
    color: var(--color-brand-200);
    font-weight: var(--fw-medium);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  input[type="checkbox"] {
    accent-color: var(--color-brand-600);
    margin-right: 0.6rem;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 1.4rem 2rem;
  border-radius: var(--border-radius-md);
  background: var(--color-brand-700);
  color: var(--color-brand-200);
  font-weight: var(--fw-semibold);
  font-size: 1.5rem;
  border: none;
  margin-bottom: 2.8rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-grey-400);
  margin-bottom: 2rem;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: var(--color-grey-200);
  }
  &::before { left: 0; }
  &::after  { right: 0; }
`;

const Providers = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: center;

  button {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 1rem 0;
    background: var(--color-grey-100);
    border: 1px solid var(--color-grey-200);
    border-radius: var(--border-radius-md);
    font-size: 1.8rem;
    transition: background 0.2s;

    @media (prefers-color-scheme: dark) {
      background: var(--color-grey-800);
      border-color: var(--color-grey-700);
    }

    &:hover { background: var(--color-grey-50); }
  }

  button[data-brand="facebook"] svg { color: #1877f2; }
  button[data-brand="apple"]    svg { color: #000000; }
`;

/* ---------------------------- component ---------------------------- */
export default function AuthBox() {
  const { t }      = useTranslation();
  const { login }  = useLogin();
  const { signup } = useSignup();

  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw]     = useState(false);
  const [mode, setMode]         = useState<"login" | "signup">("login");

  return (
    <Wrapper>
      <Card
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${mode === "signup" ? 0.9 : 1})`,
          transformOrigin: "center center",
        }}
      >
        <ToggleRow>
          <ToggleButton active={mode === "login"} onClick={() => setMode("login")}>  
            <FiLogIn /> {t("Login")}
          </ToggleButton>
          <ToggleButton active={mode === "signup"} onClick={() => setMode("signup")}>  
            <FiUserPlus /> {t("Sign Up")}
          </ToggleButton>
        </ToggleRow>

        <Logo />
        <Title>
          {mode === "login"
            ? t("Sign in with email")
            : t("Create your account")}...
        </Title>

        <form
          onSubmit={e => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);

            const values = {
              name: data.get("name") as string,
              email: data.get("email") as string,
              password: data.get("password") as string,
              confirmPassword: data.get("confirmPassword") as string,
              phone: data.get("phone") as string,
            };

            if (mode === "signup") {
              if (values.password !== values.confirmPassword) {
                alert(t("Passwords do not match"));
                return;
              }
            }

            if (mode === "login") {
              login({ email: values.email, password: values.password });
            } else {
              signup({ full_name: values.name, email: values.email, password: values.password, phone: values.phone });
            }
          }}
        >
          {mode === "signup" && (
            <Field>
              <FiUser />
              <input
                name="name"
                type="text"
                placeholder={t("Full name")}
                required
              />
            </Field>
          )}

          <Field>
            <FiMail />
            <input name="email" type="email" placeholder={t("Email")} required />
          </Field>

          {mode === "signup" && (
          <Field>
                <FiPhone />
                <input name="phone" type="tel" placeholder={t("Phone")} required />
          </Field>
          )}

          <Field>
            <FiLock />
            <input
              name="password"
              type={showPw ? "text" : "password"}
              placeholder={t("Password")} 
              required
            />
            <TogglePw
              type="button"
              onClick={() => setShowPw(prev => !prev)}
              aria-label={showPw ? t("Hide password") : t("Show password")}
            >
              {showPw ? <FiEyeOff /> : <FiEye />}
            </TogglePw>
          </Field>

          {mode === "signup" && (
            <Field>
              <FiLock />
              <input
                name="confirmPassword"
                type={showPw ? "text" : "password"}
                placeholder={t("Confirm password")}
                required
              />
            </Field>
          )}

          <Row>
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              {t("Remember me")}
            </label>
            <a href="#">{t("Forgot password?")}</a>
          </Row>

          <Button type="submit">{mode === "login" ? t("Login") : t("Sign Up")}</Button>
        </form>

        <Divider>{t("Or sign in with")}</Divider>
        <Providers>
          <button aria-label="Sign in with Google">
            <GoogleIcon />
          </button>
          <button data-brand="facebook" aria-label="Sign in with Facebook">
            <FaFacebookF />
          </button>
          <button data-brand="apple" aria-label="Sign in with Apple">
            <FaApple />
          </button>
        </Providers>
      </Card>
    </Wrapper>
  );
}
