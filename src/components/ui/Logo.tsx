"use client";
import styled from "styled-components";
import { useDarkMode } from "@/hooks";
import { useSettingsStore } from "@/components/WizardForm/useStore";

// adjust to the exact duration of your sidebar's width transition
const SIDEBAR_ANIM_MS = 100; // 0.1 s

const StyledLogo = styled.div<{ $open: boolean }>`
  text-align: center;
  justify-items: center;
  margin-bottom: 2.4rem;
  /* keeps space in the layout */
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};

  /* actual fade / scale animation */
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? "scale(1)" : "scale(0.9)")};

  /* wait until the sidebar animation is over, then fade in */
  transition:
    opacity 0.25s ease ${SIDEBAR_ANIM_MS}ms,
    transform 0.25s ease ${SIDEBAR_ANIM_MS}ms,
    visibility 0s linear ${SIDEBAR_ANIM_MS}ms;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();
  const SidebarOpen = useSettingsStore(state => state.SidebarOpen); // make sure this is a boolean
  const src = isDarkMode ? "/logo-dark.png" : "/logo-light.png";

  return (
    <StyledLogo $open={SidebarOpen}>
      <Img src={src} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
