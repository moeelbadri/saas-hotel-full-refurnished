"use client";
import styled from "styled-components";

import { Button, Logo, MainNav } from "@/components/ui";
// import Uploader from "@/data/Uploader";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const StyledSidebar = styled.aside<{ language: string }>`
  background-color: var(--color-grey-100);
  border-right: 1px solid var(--color-grey-100);
  padding: 1rem 0 0 0;
  display: flex;
  flex-direction: column;

  //  transition: width 0.5s ease-in-out;

  /* Key changes for overlay behavior */
  position: fixed;
  z-index: 1001;
  top: 0;
  left: ${(props) => (props.language === "en" ? "0" : "auto")};
  right: ${(props) => (props.language !== "en" ? "0" : "auto")};
  height: 100%;
  transition: all 0.3s ease-in-out;
  overflow-y: auto;
  @media (max-height: 768px) {
    overflow-y: auto;
  }
`;

function Sidebar() {
  const SidebarOpen = useSettingsStore(state => state.SidebarOpen);
  const Language = useSettingsStore(state => state.Language);
  const setSidebarOpen = useSettingsStore(state => state.setSidebarOpen);
  // const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <StyledSidebar
      language={Language}
      style={{
        width: SidebarOpen ? "26rem" : "5rem",
        // overflowY: SidebarOpen ? "hidden" : "hidden",
      }}
       onPointerEnter={(e) => {
        setSidebarOpen(true);
      }}
      onPointerLeave={(e) => {
       setSidebarOpen(false);
      }}
    >
      <Logo /> 
      <MainNav />
      {/* <Uploader /> */}
    </StyledSidebar>
  );
}

export default Sidebar;
