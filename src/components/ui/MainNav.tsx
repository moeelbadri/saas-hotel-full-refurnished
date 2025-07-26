/* MODULE IMPORTS */
"use client";
import styled from "styled-components";
import { getRolesVar, Roles } from "@/components/WizardForm/useStore";
import { useLocalStorageState } from "@/hooks";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import {useGetProfile} from "@/hooks/authentication"
/* ICON IMPORTS */
import {
    HiMiniArchiveBox,
    HiOutlineBellAlert,
    HiOutlineCalendarDays,
    HiOutlineCog6Tooth,
    HiOutlineHome,
    HiOutlineHomeModern,
    HiOutlineUsers,
} from "react-icons/hi2";
import { GrAnalytics } from "react-icons/gr";
import { TbReportAnalytics, TbToolsKitchen } from "react-icons/tb";


/* COMPONENT IMPORTS */
import NavListItem from "./NavListItem";
// import { useState } from "react";
import { BiSolidOffer } from "react-icons/bi";
import { JSX } from "react";
// const Roles = getRolesVar();
const NavList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.1625rem;
    overflow-y: hidden;
    overflow-x: hidden;
    overscroll-behavior: contain;
`;
const Nav = styled.nav`
    display: flex;
    flex-direction: column;
    max-height: 75%;
    `;
type RoleKey = keyof Roles;

const NAV_LIST_DATA:{
    to: string;
    icon: JSX.Element;
    label: string;
    arlabel: string;
    requiredRoles: RoleKey[]; // ✅ Now type-safe
}[] = [
    {
        to: "/dashboard",
        icon: <HiOutlineHome  size={25}/>,
        label: "Home",
        arlabel: "الرئيسية",
        requiredRoles : []
    },
    {
        to: "/bookings",
        icon: <HiOutlineCalendarDays size={25}/>,
        label: "Bookings",
        arlabel: "الحجوزات",
        requiredRoles : ["BookingRead"],
    },
    {
        to: "/rooms",
        icon: <HiOutlineHomeModern size={25}/>,
        label: "Rooms",
        arlabel: "الغرف",
        requiredRoles : ["CabinsRead"]
    },
    // {
    //     to: "/kitchen",
    //     icon: <TbToolsKitchen  size={25}/>,
    //     label: "Kitchen",
    //     arlabel: "المطبخ",
    //     requiredRoles : ["CabinsRead"]
    // },
    {
      to : "/discounts",
      icon: <BiSolidOffer size={25}/>,
      label: "Discounts",
      arlabel: "الخصومات",
      requiredRoles : ["isOwner"]
    },
    {
        to : "/alerts",
        icon: <HiOutlineBellAlert size={25}/>,
        label: "Alerts/Notes",
        arlabel: "التنبيهات",
        requiredRoles : ["isOwner"],
      },
    {
        to: "/guests",
        icon: <HiOutlineUsers size={25}/>,
        label: "Guests",
        arlabel: "الضيوف",
        requiredRoles : ["GuestsRead"]
    },
    {
        to:"/storage",
        icon: <HiMiniArchiveBox size={25}/>,
        label: "Storage",
        arlabel: "المخزن",
        requiredRoles : ["StorageRead"]
    },
    {
        to: "/reports",
        icon: <TbReportAnalytics size={25}/>,
        label: "Storage Reports",
        arlabel: "تقارير المخزن",
        requiredRoles : ["ReportsRead"]
    },
    {
        to: "/statistics",
        icon: <GrAnalytics size={25}/>,
        label: "Statistics",
        arlabel: "احصائيات تفصيلية",
        requiredRoles : ["StatisticsRead"]
    },
    {
        to: "/users",
        icon: <HiOutlineUsers size={25}/>,
        label: "Users",
        arlabel: "اعضاء الفندق",
        requiredRoles : ["UsersRead"]
    },
    {
        to: "/settings",
        icon: <HiOutlineCog6Tooth size={25}/>,
        label: "Hotel Settings",
        arlabel: "اعدادات الفندق",
        requiredRoles : ["isOwner"]
    },
];
function RoleChecker(roles:any,owner:any){
    const RoledNav:any=[];
    NAV_LIST_DATA.forEach((item) => {
        if (item.requiredRoles.length === 0 || owner || item?.requiredRoles?.some((role) => roles?.[role])) RoledNav.push(item);
    })
   return RoledNav;

}
function MainNav() {
    const Language = useSettingsStore(state => state.Language);
    const SidebarOpen = useSettingsStore(state => state.SidebarOpen);
    const  {owner,permissions} = useGetProfile();
    return (
        <Nav>
            <NavList className={SidebarOpen ? "scrollable" : ""}>
                {Language&&RoleChecker(permissions,owner).map((item:any) => (
                    <NavListItem
                        key={item.to}
                        href={item.to}
                        icon={item.icon}
                        label={Language === 'en' ? item.label : item.arlabel}
                    />
                ))}
            </NavList>
        </Nav>
    );
}

export default MainNav;
