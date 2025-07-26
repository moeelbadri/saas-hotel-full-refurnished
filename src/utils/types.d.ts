import { AnySoaRecord } from "dns";

export type Cabin = {
    id: any;
    name: any;
    roomtype:number;
    // maxCapacity: number;
    regular_price: number;
    // discounts: number;
    image: string;
    description: string;
    // discounted:number
    [key: string]: any;
};
export type Hotel = {
    id: number;
    hotelName:string
}
export type Booking = {
    id: number;
    guestId: number;
    cabinId: number;
    startDate: string;
    endDate: string;
    numGuests: number;
    IncludeBreakfast: boolean;
    numNights: number;
    totalPrice: number;
    status: "unconfirmed" | "checked-in" | "checked-out";
    [key: string]: any;
};
export type Guest = {
    id:number;
    GuestP:number;
    nationalID: number;
    fullName:string;
    BirthDate: string;
    countryFlag: string;
    nationality:string;
    phoneNumber:number;
    address: string;
    email:string;
    Gender:string;
    city:string;
    Child:?string;
}
export type Alert = {
    id:number;
    created_at: string;
    message: string;
    type: string;
    Permanent: boolean;
    hotel_id: number;
    end_date: string;
    priority_level: number;
    explain: string;
    profiles :{
        FullName: string;
    }
    [key: string]: any;
}
export type StorageItem={
id: number;
name: string;
img: string;
cost: number;
location: string;
category: string;
hotel: number;
criticality: number;
}
export type discounts={
  id: number;
  created_at: string;
  start_date: string;
  end_date: string;
  discount:number;
  description: string;
  hotel_id: number;
  cabin_ids: (string | number)[];
  amenities_ids:(string | number)[];
  guest_p_ids:(string | number)[];
  [key: string]: any;
}
export { Cabin, Booking,Guest,StorageItem};

