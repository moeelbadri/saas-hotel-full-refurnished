"use client";
import styled from "styled-components";
import { HiBell, HiInbox, HiOutlineUser } from "react-icons/hi2";
import { ButtonIcon, NotificationMenu } from "@/components/ui";
import { DarkModeToggle, LanguageToggle } from "@/components/utils";
import { Logout } from "@/features/authentication";
import Link from "next/link";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useState, useEffect } from "react";
import { HiMenu, HiOutlineMail } from "react-icons/hi";
import { HiOutlineCloud } from "react-icons/hi2";
const StyledHeaderMenu = styled.ul`
  display: flex;
  grid-row: 1;
  grid-column: 1;
  padding: 0.4rem 2rem;
  width: 100%;
  min-width: 100%;
  justify-content: space-between; // 👈 now this will work
  list-style: none;
`;
const MenuToggleButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  position: fixed;
  transition: all 0.3s ease-in-out;
    /* Create a new stacking context */
  transform: translateZ(0);

  /* hide on devices with a fine pointer (mouse) */
  @media (pointer: fine) {
    display: none;
  }

  /* show on devices with a coarse pointer (touch) */
  @media (pointer: coarse) {
    display: block;
    /* 💥 kill border *only* while it's pressed */
    &:active {
      border: none;
    }

    /* 💥 kill the blue focus ring on click, 
     but keep it for keyboard users */
    &:focus {
      outline: none;
    }
  }
`;
// ServerStatusIndicator component
const ServerStatusIndicator = () => {
  const isServerLoading = useSettingsStore((state) => state.isServerLoading); 
  const serverState = useSettingsStore((state) => state.serverState);
  const Language = useSettingsStore((state) => state.Language);
  const [color , setColor] = useState('#d1d5db');
  useEffect(() => {
    if (serverState === 'online') setColor('#22c55e'); // green
    if (serverState !== 'online') setColor('#ef4444'); // red
    if (isServerLoading) setColor('#f59e0b'); // orange
  }, [serverState, isServerLoading]);
  
  return (
    <span style={{ display: 'flex', alignItems: 'center', marginRight:Language === 'en' ? 12 : 0,marginLeft: Language === 'en' ? 0 : 12,cursor: 'pointer', position: 'relative' }} 
    title={serverState}>
      <HiOutlineCloud size={22} style={{color}} />
      <span style={{
        position: 'absolute',
        left: 18,
        top: 2,
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        border: '1px solid #fff',
        boxShadow: '0 0 2px #0002',
      }} />
    </span>
  );
};
const TimeDisplay = () => {
  const Language = useSettingsStore((state) => state.Language);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p style={{ fontSize: "1.2rem" }}>
      {time.toLocaleTimeString(Language === "en" ? "en-US" : "ar")}
    </p>
  );
};
function HeaderMenu() {
  const SidebarOpen = useSettingsStore((state) => state.SidebarOpen);
  const Language = useSettingsStore((state) => state.Language);
  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between",width:"100%" }}>
      <MenuToggleButton
        onClick={() => useSettingsStore.setState({ SidebarOpen: !SidebarOpen })}
        style={{
          marginLeft: SidebarOpen && Language === "en" ? "21rem" : undefined,
          marginRight: SidebarOpen && Language !== "en" ? "21rem" : undefined,
        }}
      >
        <HiMenu size={40} />
      </MenuToggleButton>
      <StyledHeaderMenu>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifyItems: "center",
            marginRight: Language === "en" ? "0" : "5rem",
            marginLeft: Language !== "en" ? "0" : "5rem",
          }}
        >
          <ServerStatusIndicator />
          <TimeDisplay />
        </li>

        <div style={{ display: "flex", gap: "1rem", position: "relative" }}>
          <li>
            <Link href="/account">
              <ButtonIcon>
                <HiOutlineUser />
              </ButtonIcon>
            </Link>
          </li>
          <li>
            <NotificationMenu />
          </li>
          <li>
            <DarkModeToggle />
          </li>
          <li>
            <LanguageToggle />
          </li>
          <li>
            <Logout />
          </li>
        </div>
      </StyledHeaderMenu>
    </div>
  );
}

export default HeaderMenu;
