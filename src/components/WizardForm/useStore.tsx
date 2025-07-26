// import { useState } from 'react';
import React from "react";
import { create, useStore } from "zustand";
export interface Roles {
    isOwner: boolean;
    BookingRead: boolean;
    BookingWrite: boolean;
    BookingEdit: boolean;
    BookingDelete: boolean;
    CabinsRead: boolean;
    CabinsWrite: boolean;
    CabinsEdit: boolean;
    CabinsDelete: boolean;
    StorageRead: boolean;
    StorageWrite: boolean;
    StorageEdit: boolean;
    StorageDelete: boolean;
    StatisticsRead: boolean;
    StatisticsWrite: boolean;
    StatisticsEdit: boolean;
    StatisticsDelete: boolean;
    GuestsRead: boolean;
    GuestsWrite: boolean;
    GuestsEdit: boolean;
    GuestsDelete: boolean;
    ReportsRead: boolean;
    ReportsWrite: boolean;
    ReportsEdit: boolean;
    ReportsDelete: boolean;
    UsersRead: boolean;
    UsersWrite: boolean;
    UsersEdit: boolean;
    UsersDelete: boolean;
}
// Initialize Roles as an object of type Roles
let Roles: Roles = {
    isOwner: false,
    BookingRead: false,
    BookingWrite: false,
    BookingEdit: false,
    BookingDelete: false,
    CabinsRead: false,
    CabinsWrite: false,
    CabinsEdit: false,
    CabinsDelete: false,
    StorageRead: false,
    StorageWrite: false,
    StorageEdit: false,
    StorageDelete: false,
    StatisticsRead: false,
    StatisticsWrite: false,
    StatisticsEdit: false,
    StatisticsDelete: false,
    GuestsRead: false,
    GuestsWrite: false,
    GuestsEdit: false,
    GuestsDelete: false,
    ReportsRead: false,
    ReportsWrite: false,
    ReportsEdit: false,
    ReportsDelete: false,
    UsersRead: false,
    UsersWrite: false,
    UsersEdit: false,
    UsersDelete: false,
};

export function getRolesVar(): Roles {
    return Roles;
}
export function setRolesVar(roles: Roles): void {
    Roles = roles;
}
type SelectedDay = { year: number; month: number; day: number };
type Range = { start: SelectedDay; end: SelectedDay };

interface BookingState {
    RoomCategory: any;
    numAdults: number;
    numChildren: number;
    choosenCabin: any[];
    selectedRanges: {[roomKey: string]: Range[]};
    startDate: any;
    endDate: any;
    guestName: any;
    phoneNumber: any;
    guestlistAdults: any[];
    guestlistKids: any[];
    familyMembers: {
        value: any;
        name: string;
        fullname: string;
        birthDate: string;
        role: string;
        gender: any;
        nationality: any;
        phoneNumber: any;
        countryFlag: any;
        city?: string;
        nationalID: string;
        passportImage: string;
    }[];
    familyKids: {
        value: any;
        name: string;
        fullname: string;
        birthDate: string;
        role: string;
        nationalID: string;
        nationality: any;
        phoneNumber: any;
        countryFlag: any;
        city?: string;
        passportImage: string;
        gender: any;
    }[];
    totalPrice: {rooms: number, breakfast: number, amenities: number};
    isLoading: boolean;
    breakfast: any;
    pickedAmenities: any[];
    observations: any;
    orderSummary: any;
    extras:any;
    booking_activity: any;
    isLastStep: boolean;
    setRoomCategory: (category: object) => void;
    setNumAdults: (num: number) => void;
    setNumChildren: (num: number) => void;
    setChoosenCabin: (cabin: any) => void;
    setSelectedRanges: (ranges: {[roomKey: string]: Range[]}) => void;
    setStartDate: (date: any) => void;
    setEndDate: (date: any) => void;
    setGuestName: (name: any) => void;
    setPhoneNumber: (phone: any) => void;
    setGuestListAdults: (list: any) => void;
    setGuestListKids: (list: any) => void;
    setFamilyMembers: (
        members: {
            value: any;
            name: string;
            fullname: string;
            birthDate: string;
            role: string;
            gender: string;
            nationality: string;
            countryFlag: any;
            city?: string;
            nationalID: string;
            passportImage: string;
            phoneNumber: any;
        }[]
    ) => void;
    setFamilyKids: (
        kids: {
            value: any;
            name: string;
            fullname: string;
            birthDate: string;
            role: string;
            nationalID: string;
            nationality: string;
            countryFlag: any;
            city?: string;
            passportImage: string;
            gender: any;
            phoneNumber: any;
        }[]
    ) => void;
    setTotalPrice: (price: { rooms: number, breakfast: number, amenities: number }) => void;
    setisLoading: (isLoading: boolean) => void;
    setBreakfast: (breakfast: any) => void;
    setPickedAmenities: (amenities: any[]) => void;
    setObservations: (observations: any) => void;
    setOrderSummary: (Orders: any) => void;
    setExtras: (extras: any) => void;
    setBookingActivity: (activity: any) => void;
    setIsLastStep: (isLastStep: boolean) => void;
    resetStore: () => void;
}
export const useBookingStore = create<BookingState>((set) => ({
    RoomCategory: {},
    numAdults: 1,
    numChildren: 0,
    choosenCabin: [],
    selectedRanges: {},
    startDate: null,
    endDate: null,
    guestName: [],
    phoneNumber: 0,
    guestlistAdults: [],
    guestlistKids: [],
    familyMembers: [],
    familyKids: [],
    totalPrice: {
        rooms: 0,
        breakfast: 0,
        amenities: 0
    },
    isLoading: false,
    breakfast: [],
    pickedAmenities: [],
    observations: "",
    orderSummary: [],
    extras : {},
    booking_activity: [],
    isLastStep: false,
    setRoomCategory: (category) => set({ RoomCategory: category }),
    setNumAdults: (num) => set({ numAdults: num }),
    setNumChildren: (num: any) => set({ numChildren: num }),
    setChoosenCabin: (cabin: any) => set({ choosenCabin: cabin }),
    setSelectedRanges: (ranges: any) => set({ selectedRanges: ranges }),
    setStartDate: (date: any) => set({ startDate: date }),
    setEndDate: (date: any) => set({ endDate: date }),
    setGuestName: (name) => set({ guestName: name }),
    setPhoneNumber: (phone) => set({ phoneNumber: phone }),
    setGuestListAdults: (list) => set({ guestlistAdults: list }),
    setGuestListKids: (list) => set({ guestlistKids: list }),
    setFamilyMembers: (members) => set({ familyMembers: members }),
    setFamilyKids: (kids) => set({ familyKids: kids }),
    setTotalPrice: (price:any) => set({ totalPrice : price }),
    setisLoading: (isLoading) => set({ isLoading: isLoading }),
    setBreakfast: (breakfast) => set({ breakfast: breakfast }),
    setPickedAmenities: (amenities) => set({ pickedAmenities: amenities }),
    setObservations: (observations) => set({ observations: observations }),
    setOrderSummary: (Orders) => set({ orderSummary: Orders }),
    setExtras: (extras) => set({ extras: extras }),
    setBookingActivity: (activity) => set({ booking_activity: activity }),
    setIsLastStep: (isLastStep) => set({ isLastStep: isLastStep }),
    resetStore: () =>
        set({
            numAdults: 1,
            numChildren: 0,
            choosenCabin: [],
            startDate: null,
            endDate: null,
            guestName: [],
            guestlistAdults: [],
            guestlistKids: [],
            familyMembers: [],
            familyKids: [],
            totalPrice: { rooms: 0,breakfast: 0, amenities: 0 },
            isLoading: false,
            breakfast: [],
            pickedAmenities: [],
            observations: "",
            orderSummary: {},
            extras: {},
            booking_activity: [],
            isLastStep: false,
        }),
}));
interface AccountState {
    FullName: string;
    Email: string;
    Roles: {
        isOwner: boolean;
        BookingRead: boolean;
        BookingWrite: boolean;
        BookingEdit: boolean;
        BookingDelete: boolean;
        CabinsRead: boolean;
        CabinsWrite: boolean;
        CabinsEdit: boolean;
        CabinsDelete: boolean;
        StorageRead: boolean;
        StorageWrite: boolean;
        StorageEdit: boolean;
        StorageDelete: boolean;
        StatisticsRead: boolean;
        StatisticsWrite: boolean;
        StatisticsEdit: boolean;
        StatisticsDelete: boolean;
        GuestsRead: boolean;
        GuestsWrite: boolean;
        GuestsEdit: boolean;
        GuestsDelete: boolean;
        ReportsRead: boolean;
        ReportsWrite: boolean;
        ReportsEdit: boolean;
        ReportsDelete: boolean;
        UsersRead: boolean;
        UsersWrite: boolean;
        UsersEdit: boolean;
        UsersDelete: boolean;
    };
    setFullName: (name: string) => void;
    setEmail: (email: string) => void;
    setRoles: (roles: {
        isOwner: boolean;
        BookingRead: boolean;
        BookingWrite: boolean;
        BookingEdit: boolean;
        BookingDelete: boolean;
        CabinsRead: boolean;
        CabinsWrite: boolean;
        CabinsEdit: boolean;
        CabinsDelete: boolean;
        StorageRead: boolean;
        StorageWrite: boolean;
        StorageEdit: boolean;
        StorageDelete: boolean;
        StatisticsRead: boolean;
        StatisticsWrite: boolean;
        StatisticsEdit: boolean;
        StatisticsDelete: boolean;
        GuestsRead: boolean;
        GuestsWrite: boolean;
        GuestsEdit: boolean;
        GuestsDelete: boolean;
        ReportsRead: boolean;
        ReportsWrite: boolean;
        ReportsEdit: boolean;
        ReportsDelete: boolean;
        UsersRead: boolean;
        UsersWrite: boolean;
        UsersEdit: boolean;
        UsersDelete: boolean;
    }) => void;
}
export const useAccountStore = create<AccountState>((set) => ({
    FullName: "",
    Email: "",
    Roles: {
        isOwner: false,
        BookingRead: false,
        BookingWrite: false,
        BookingEdit: false,
        BookingDelete: false,
        CabinsRead: false,
        CabinsWrite: false,
        CabinsEdit: false,
        CabinsDelete: false,
        StorageRead: false,
        StorageWrite: false,
        StorageEdit: false,
        StorageDelete: false,
        StatisticsRead: false,
        StatisticsWrite: false,
        StatisticsEdit: false,
        StatisticsDelete: false,
        GuestsRead: false,
        GuestsWrite: false,
        GuestsEdit: false,
        GuestsDelete: false,
        ReportsRead: false,
        ReportsWrite: false,
        ReportsEdit: false,
        ReportsDelete: false,
        UsersRead: false,
        UsersWrite: false,
        UsersEdit: false,
        UsersDelete: false,
    },
    setFullName: (name) => set({ FullName: name }),
    setEmail: (email) => set({ Email: email }),
    setRoles: (roles) => set({ Roles: roles }),
}));

interface SettingsState {
    MinNightsPerBooking: number;
    MaxNightsPerBooking: number;
    MaxGuestsPerBooking: number;
    BreakfastPrice: number;
    Amenities: {
        AmenityId: number;
        name: string;
        price: number;
        included: boolean;
    }[];
    Language: string;
    TempObj: any;
    SidebarOpen: boolean;
    isOpenned: boolean;
    Count: number;
    lastSubmenu: any;
    isServerLoading: boolean;
    serverState: string;
    promise: { resolve: (value?: unknown) => void; reject: (value?: unknown) => void; };
    setMinNights: (num: number) => void;
    setMaxNights: (num: number) => void;
    setMaxGuests: (num: number) => void;
    setBreakfastPrice: (num: number) => void;
    setAmenities: (
        amenities: {
            AmenityId: number;
            name: string;
            price: number;
            included: boolean;
        }[]
    ) => void;
    setlanguage: (lang: string) => void;
    setTempObj: (tempObj: any) => void;
    setSidebarOpen: (state?: boolean) => void;
    setIsOpenned: (state: boolean) => void;
    setCount: (count: number) => void;
    setLastSubmenu: (submenu: any) => void;
    setIsServerLoading: (state: boolean) => void;
    setServerState: (state: string) => void;
    setPromise: (promise: { resolve: (value?: unknown) => void; reject: (value?: unknown) => void; }) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    MinNightsPerBooking: 1,
    MaxNightsPerBooking: 1,
    MaxGuestsPerBooking: 1,
    BreakfastPrice: 0,
    Amenities: [{ AmenityId: 0, name: "", price: 0, included: false }],
    Language: "ar",
    // SidebarOpen: window.innerWidth > 768 ? true : false,
    SidebarOpen: false,
    isOpenned: false,
    TempObj: "",
    Count: 0,
    lastSubmenu: {},
    isServerLoading: false,
    serverState: "",
    promise: { resolve: () => {}, reject: () => {} },
    setMinNights: (num) => set({ MinNightsPerBooking: num }),
    setMaxNights: (num) => set({ MaxNightsPerBooking: num }),
    setMaxGuests: (num) => set({ MaxGuestsPerBooking: num }),
    setBreakfastPrice: (num) => set({ BreakfastPrice: num }),
    setAmenities: (amenities) => set({ Amenities: amenities }),
    setlanguage: (lang) => set({ Language: lang }),
    setTempObj: (tempObj) => set({ TempObj: tempObj }),
    setSidebarOpen: (state) => set({ SidebarOpen: state || false }),
    setIsOpenned: (state) => set({ isOpenned: state }),
    setCount: (count) => set({ Count: count }),
    setLastSubmenu: (submenu) => set({ lastSubmenu: submenu }),
    setIsServerLoading: (state) => set({ isServerLoading: state }),
    setServerState: (state) => set({ serverState: state }),
    setPromise: (promise) => set({ promise: promise }),
}));
