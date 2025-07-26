"use client";
import React, {
    cloneElement,
    createContext,
    useContext,
    useState,
} from "react";

import styled from "styled-components";
import { HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "@/hooks";
import { createPortal } from "react-dom";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const StyledModal = styled.div<{ info: string }>`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 3.22rem 4rem;
    transition: all 0.5s;
    max-height: 90vh;
    width: auto;  // Ensuring the modal is responsive on smaller screens
    overflow: auto;

    @media (max-width: 1200px) {
        max-width: 60rem;
        padding: 5rem 5rem;
        max-height: 85vh;
    }

    @media (max-width: 768px) {
        max-width: none;
        padding: 4rem;
        max-height: 90vh;
        border-radius: var(--border-radius-md);
    }
    @media (max-width: 480px) {
        max-height: 100%;
        padding: 4rem;
        border-radius: 0;
        ${props => props.info == "add-Booking" ? 
        `
        padding: 1rem;
        transform: none;
        top:0;
        left:0;
        `:
        ``
        }
        border-radius: var(--border-radius-md);
    }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  /* solid colour fallback for older browsers */
  background: rgba(0, 0, 0, 0.35);

  /* nice blur where it’s supported */
  @supports ((backdrop-filter: blur(5px)) or (-webkit-backdrop-filter: blur(5px))) {
    // backdrop-filter: blur(5px);
    // -webkit-backdrop-filter: blur(5px);
    /* keep the dark tint but a bit lighter */
    background: rgba(0, 0, 0, 0.70);
  }

  z-index: 9999;
  transition: backdrop-filter 0.3s, background 0.3s;
`;

const ButtonCloseModal = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;
    position: absolute;
    top: 1.2rem;
    right: 1.9rem;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 3rem;
        height: 3rem;
        color: var(--color-grey-500);
    }

    @media (max-width: 768px) {
        top: 1rem;
        right: 1rem;
        padding: 0.6rem;
        
        & svg {
            width: 3rem;
            height: 3rem;
        }
    }

    @media (max-width: 480px) {
        top: 1rem;
        right: 1rem;
        padding: 1rem;
        
        & svg {
            width: 4rem;
            height: 4rem;
        }
    }
`;

type ModalContextType = {
    open: (value: string) => void;
    openName: string;
    close: () => void;
    info?: string;
};

const ModalContext = createContext<ModalContextType>({
    open: (a: string) => {
        a;
        return;
    },
    openName: "",
    info: "true",
    close: () => {
        return;
    },
});

function Modal({ children }: { children: React.ReactNode }) {
    const setIsOpenned = useSettingsStore((state) => state.setIsOpenned);
    const [openName, setOpenName] = useState("");
    const open = (val: string) => {
        setOpenName(val);
        setIsOpenned(true);
    }
    const close = () => {
        setOpenName("");
        setIsOpenned(false);
    }
    return (
        <ModalContext.Provider value={{ open, openName, close }}>
            {children}
        </ModalContext.Provider>
    );
}

function Open({
    children,
    opens: opensWindowName,
}: {
    children: React.ReactElement<{ onClick: () => void }>;
    opens: string;
}) {
    const { open } = useContext(ModalContext);

    if (React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: () => open(opensWindowName),
        });
    }

    return children;
}

function Window({
    children,
    name: windowName,
}: {
    children: React.ReactElement<{ onCloseModal: () => void }>;
    name: string;
}) {
    const { openName, close } = useContext(ModalContext);
    const ref: any = useOutsideClick(close);

    if (openName != windowName) return null;

    return createPortal(
        <Overlay>
            <StyledModal info={windowName} ref={ref}>
            <ButtonCloseModal onClick={close}>
                    <HiXMark />
                </ButtonCloseModal>
                <div>{cloneElement(children, { onCloseModal: close })}</div>
            </StyledModal>
        </Overlay>,
        document.body
    );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
