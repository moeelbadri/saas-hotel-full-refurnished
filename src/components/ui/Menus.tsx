"use client";
import {
    ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from "react";
import { createPortal } from "react-dom";
import {
    HiChevronLeft,
    HiChevronRight,
    HiEllipsisVertical,
} from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "@/hooks";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import React from "react";
import { shallow } from 'zustand/shallow';
const Menu = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledToggle = styled.button`
    background: none;
    border: none;
    padding: 0.1rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-grey-300);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-700);
    }

    @media (max-width: 1200px) {
        padding: 0.8rem;
        transform: translateX(0);
        
        & svg {
            width: 2.2rem;
            height: 2.2rem;
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;
        min-height: 4.4rem;
        min-width: 4.4rem;
        
        & svg {
            width: 2rem;
            height: 2rem;
        }
    }

    @media (max-width: 480px) {
        padding: 1.2rem;
        min-height: 4.8rem;
        min-width: 4.8rem;
        
        & svg {
            width: 1.8rem;
            height: 1.8rem;
        }
    }
`;
const StyledButtonWrapper = styled.div`
    position: relative;

    &:hover > ul.submenu {
        display: block;
    }
`;
type StyledListProps = {
    x ?: string;
    y ?: string
    lang?: string;
    hide?: string;
    overflow?: string;
    count?: string
};
const StyledList = styled.ol<StyledListProps>`
    position: absolute;

    background-color: var(--color-grey-100);
    // box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);
    // right: ${(props: StyledListProps) => props.x}px;

    // right: ${(props) => props.lang === "en" ? `${Number(props.x)}px` : "auto"};

    // top: ${(props: StyledListProps) => props.y}px;
    ${(props: StyledListProps) => props.lang === "en" ? "right : 3em" : "left : 3em"};


    // Number(count)*40
    //   top: ${(props) =>  props.overflow === "true" ? `${Number(props.y) }px` : `${Number(props.y) }px`};

    ${(props: StyledListProps) => props.overflow === "true"  ? `bottom : 4em` : `top : 4em`};

    min-width: 200px;
    z-index: 9999;
    white-space: nowrap;
    // display: ${(props: StyledListProps) => props.hide ? "none" : "block"};
    &.submenu {
        position: absolute;
        bottom: 0; /* Position the menu above */
        top: auto;
        right: ${(props: StyledListProps) => props.lang === "en" ? "100" : "-100"}%;
        display: none;
       
    }
    ${StyledButtonWrapper}:hover & {
        display: block;
    }

    @media (max-width: 1200px) {
        min-width: 220px;
        ${(props: StyledListProps) => props.lang === "en" ? "right : 2em" : "left : 2em"};
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
    }

    @media (max-width: 768px) {
        min-width: 250px;
        ${(props: StyledListProps) => props.lang === "en" ? "right : 1em" : "left : 1em"};
        ${(props: StyledListProps) => props.overflow === "true"  ? `bottom : 5em` : `top : 5em`};
        box-shadow: var(--shadow-lg);
    }

    @media (max-width: 480px) {
        min-width: 280px;
        ${(props: StyledListProps) => props.lang === "en" ? "right : 0.5em" : "left : 0.5em"};
        ${(props: StyledListProps) => props.overflow === "true"  ? `bottom : 6em` : `top : 6em`};
    }
`;

const StyledButton = styled.button`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.2rem 2.4rem;
    font-size: 1.6rem;
    transition: all 0.2s;
    max-height: 40px;
    display: flex;
    align-items: center;

    gap: 1.6rem;
    &:hover {
        background-color: var(--color-grey-50);

        & > ul {
            display: block;
        }
    }
    & span {
        min-width: auto;
        word-wrap: break-word;
        white-space: nowrap;
    }

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }

    @media (max-width: 1200px) {
        padding: 1.4rem 2.6rem;
        font-size: 1.5rem;
        min-height: 4.4rem;
        max-height: none;
    }

    @media (max-width: 768px) {
        padding: 1.6rem 3rem;
        font-size: 1.6rem;
        min-height: 4.8rem;
        
        & svg {
            width: 1.8rem;
            height: 1.8rem;
        }
    }

    @media (max-width: 480px) {
        padding: 1.8rem 3.2rem;
        font-size: 1.7rem;
        min-height: 5.2rem;
    }
`;
const ChevronLeft = styled(HiChevronLeft)`
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
`;

const ChevronRight = styled(HiChevronRight)`
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
`;
type MenusCtxProps = {
    openId: string;
    position: any;
    hidden?: boolean;
    ClosestButton: any;
    menuContainerRef ?: any
    row?:any,
    close: () => void;
    open: (val: string) => void;
    setPosition: (val: any) => void;
    setHidden: (val: any) => void;
    setClosestButton: (val: any) => void;
};

const MenusContext = createContext<MenusCtxProps>({
    openId: "",
    position: null,
    hidden: true,
    ClosestButton: null,
    menuContainerRef: null,
    row:null,
    setHidden: (val: any) => {
        val;
        return;
    },

    close: () => {
        return;
    },
    open: (val: string) => {
        val;
        return;
    },
    setPosition: (val: any) => {
        val;
        return;
    },
    setClosestButton: (val: any) => {
        val;
        return;
    },
});
function SubMenu({ id, children }: { id: string; children: ReactNode }) {
    const { openId, position, close } = useContext(MenusContext);
    const ref: any = useOutsideClick(close, false);
    const Language = useSettingsStore(state => state.Language);

    return (
        <StyledList
            className={`submenu`}
            x="0"
            y="0"
            lang={Language}
            ref={ref}
        >
            {children}
        </StyledList>
    );
}
function Menus({ children }: { children: ReactNode }) {
    const [openId, setOpenId] = useState("");
    const [position, setPosition] = useState(null);
    const [ClosestButton, setClosestButton] = useState(null);
    const [hidden, setHidden] = useState(false);
    const close = () => setOpenId("");
    const open = setOpenId;
    const menuContainerRef = useRef<HTMLDivElement>(null);
    // const open = (id: string) => setOpenId(id);  // Open the submenu by setting openId
    return (
    <div ref={menuContainerRef}>
        <MenusContext.Provider
            value={{
                openId,
                close,
                open,
                position,
                setPosition,
                setClosestButton,
                ClosestButton,
                hidden,
                setHidden,
                menuContainerRef,
            }}
        >
            {children}
        </MenusContext.Provider>
    </div>
    );
}

function Toggle({ id, xpos = 0 }: { id: string; xpos?: number;}) {
    const Language = useSettingsStore(state => state.Language);
    const {
        openId,
        close,
        open,
        setPosition,
        setClosestButton,
    } = useContext(MenusContext);

    function handleClick(e: any) {
        e.stopPropagation();
        console.log(id,"xd",openId)

        const rect = e?.target?.closest("button").getBoundingClientRect();
        const rect1 = e.currentTarget.getBoundingClientRect();
        // setClosestButton(rect1);

        // alert(`${rect1.y} , ${rect.y}`)
        // setPosition({
        //     x:
        //         window.innerWidth -
        //         rect1.width -
        //         rect1.x -
        //         (xpos ? xpos : Language === "en" ? 0 : 200),
        //     y:  rect1.y - 100,
        // });
        (openId === "" || openId !== id) ? open(id) : close();
    }

    return (
        <StyledToggle onClick={handleClick}>
            <HiEllipsisVertical />
        </StyledToggle>
    );
}

function List({ id, children , row }: { id: string; children: any;row : any }) {
    const { openId, position, setPosition, close, hidden , ClosestButton , menuContainerRef} = useContext(MenusContext);
    const ref: any = useOutsideClick(close, false);
    const Language = useSettingsStore(state => state.Language);
    const rect = row?.current?.getBoundingClientRect() || menuContainerRef?.current?.getBoundingClientRect();
    const [computedPosition, setComputedPosition] = useState({ x: rect?.x || 0, y: rect?.y || 0 });
    const [count,setCount] = useState(String(React.Children.count(children)))
    if (openId) {
        // const newChildren = children?.filter((item: any) => item != false);
        // const rect1 = ClosestButton;
        // const menuHight: any = newChildren?.length * 40;
        // position.y = rect1.y - menuHight - 8
               }

     // Only update position if the menu is open and the element exists.
    useEffect(() => {
        const rect = row?.current?.getBoundingClientRect() || menuContainerRef?.current?.getBoundingClientRect();
        if(rect) setComputedPosition({ x: rect?.x || 0, y: rect?.y || 0 });
    },[row,menuContainerRef]);

    if (openId !== id) return null;

    // return (
    //     <StyledList position={position} ref={ref} id={openId}>
    //         {children}
    //     </StyledList>
    // );
    const overFlow = menuContainerRef?.current?.getBoundingClientRect().bottom-row?.current?.getBoundingClientRect().bottom < Number(count)*40;
    // setPosition({
    //     x:  rect1.x,
    //     y:  rect1.y,
    // });
    return createPortal(
        <StyledList x={`${computedPosition.x}px`} y={`${computedPosition.y}px`} ref={ref} id={openId} hide={hidden?.toString()} lang={Language} overflow={overFlow.toString()} count={count}>
            {children}
        </StyledList>,
        row?.current || menuContainerRef?.current || document.body, 
    );
}

function SubmenuIndicator() {
    const Language = useSettingsStore(state => state.Language);
    const Indicator = Language === "en" ? ChevronLeft : ChevronRight;

    return <Indicator />;
}
function Button({ children, icon, onClick, submenu }: any) {
    const { close, open, openId, setPosition,hidden } = useContext(MenusContext);
    const lastSubmenu = useSettingsStore(state => state.lastSubmenu);
    const setLastSubmenu = useSettingsStore(state => state.setLastSubmenu);
    function handleClick(e: any) {
        e.stopPropagation();
        onClick?.();
        close();
        // If submenu is already open, close it, else open it
    }
    return (
        <StyledButtonWrapper>
            <StyledButton
                onClick={handleClick}
                onMouseEnter={() => {
                    if (submenu?.id) {
                        setLastSubmenu((lastSubmenu: any) => ({
                            ...lastSubmenu,
                            [submenu?.id]: true
                        }));
                        if (submenu?.id.includes("alpha")) {
                            for (const key in lastSubmenu) {
                                if (key.includes("beta")) {
                                    setLastSubmenu((lastSubmenu: any) => ({
                                        ...lastSubmenu,
                                        [key]: false
                                    }));
                                }
                            }
                        } else if (submenu?.id.includes("beta")) {
                            for (const key in lastSubmenu) {
                                if (key.includes("beta")) {
                                    if (submenu?.id !== key) {
                                        setLastSubmenu((lastSubmenu: any) => ({
                                            ...lastSubmenu,
                                            [key]: false
                                        }));
                                    }
                                } else if (key.includes("gamma")) {
                                    if (submenu?.id !== key) {
                                        setLastSubmenu((lastSubmenu: any) => ({
                                            ...lastSubmenu,
                                            [key]: false
                                        }));
                                    }
                                }
                            }
                        } else if (submenu?.id.includes("gamma")) {
                            for (const key in lastSubmenu) {
                                if (key.includes("gamma")) {
                                    if (submenu?.id !== key) {
                                        setLastSubmenu((lastSubmenu: any) => ({
                                            ...lastSubmenu,
                                            [key]: false
                                        }));
                                    }
                                }
                            }
                        }
                    }
                }}
            >
                {submenu && <SubmenuIndicator />}
                {icon}
                <span>{children}</span>
            </StyledButton>
            {submenu && lastSubmenu[submenu?.id] && (
                <SubMenu id={submenu.id}>{submenu.children}</SubMenu>
            )}
        </StyledButtonWrapper>
    );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
Menus.SubMenu = SubMenu;

export default Menus;
