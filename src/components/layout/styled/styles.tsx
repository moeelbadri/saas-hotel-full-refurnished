"use client";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import styled from "styled-components";

export const StyledAppLayout = styled.div`
  display: flex;
  height: 100vh;
  min-width: 90vw;
  flex-direction: column;
  position: relative;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    height: auto;
  }
`;

export const Main = styled.main`
background-color: var(--color-grey-50);
padding: 0rem 2.5rem 1.4rem;
overflow: auto;
//  min-height: 94.5%;
 height: 100vh;
 width : auto;  


 @media (max-width: 1200px) {
   width: auto;
   min-height: 95.5vh;
   height: 100%;
   padding: 0rem 2.5rem 1.4rem;
   overflow: auto;
 }

 @media (max-width: 768px) {
   padding: 0rem 2.5rem 1.4rem;
   width: auto;
   min-height: 95.5vh;
   height: 100%;
   height: auto;
   overflow-x: auto;
 }

 @media (max-width: 480px) {
   padding: 0rem 2.5rem 1.4rem;
   width: 100%;
   min-width: 100%;
   overflow-x: hidden;
 }
`;

// Mobile overlay for sidebar
export const MobileOverlay = styled.div<{ isvisible: String }>`
  display: none;
  

    display: ${props => props.isvisible === 'true' ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    backdrop-filter: blur(3px);
  
`;

export function AppLayout({ children }: any) {
  // Now we use the store hook INSIDE a component
   const SidebarOpen = useSettingsStore(state => state.SidebarOpen);
   const isOpenned = useSettingsStore(state => state.isOpenned);
    const Language = useSettingsStore(state => state.Language);
    const setSidebarOpen = useSettingsStore(state => state.setSidebarOpen);
    const invisible = isOpenned || SidebarOpen;
  return (
    <StyledAppLayout
      style={{
        marginLeft: `${Language === "en" ? "5rem" : "0rem"}`,
        marginRight: `${Language !== "en" ? "5rem" : "0rem"}`,
      }}
    >
      <MobileOverlay 
        isvisible={invisible.toString()} 
        onClick={() => setSidebarOpen(false)}
      />
      {children}
    </StyledAppLayout>
  );
}

