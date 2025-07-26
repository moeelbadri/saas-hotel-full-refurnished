/*eslint-disable*/
import { apiRequest, getToday } from "../utils/helpers";
import {supabase} from "./supabase";
import { PAGE_SIZE } from "@/utils/constants";
// import { socket } from "./redis";
export async function getBookings({
    filter,
    sort,
    order,
    pageid,
    limit,
}: {
    filter?: any;
    sort?: any;
    order?: any;
    pageid?: any;
    limit?: any;
}) {
    return apiRequest<{ bookings: any[], count: string, oldcount: string }>("/user/bookings/getBookings", "GET", { filter, sort, order,pageid,limit });
}

export async function getBooking(id: any) {
    return apiRequest<{ bookings: any }>("/user/bookings/getBooking", "GET", { id });
}
export async function updatePoliceCase(guestId:any,id:any,ids:any){
    if(!id) throw new Error("Empty ")
    // if(!ids.includes(parseInt(id))) throw new Error(`Value '${id}' is out of the allowed range. Expected one of: ${ids.join(', ')}`);
    const {data, error} = await supabase
    .from("bookingGuests")
    .update({"police_case_id":id})
    .eq("id",guestId);

    console.log(data)
     if(error) throw new Error(error.message)
     return data
}
// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date: ISOString

export async function getBookingsAfterDate(date: any) {
   return apiRequest<{ bookings: any[] }>("/user/bookings/getBookingsAfterDate", "GET", { date }); 
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: any) {
    return apiRequest<{ bookings: any[] }>("/user/bookings/getStaysAfterDate", "GET", { date }); 
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
   return apiRequest<{ bookings: any[] }>("/user/bookings/getStaysTodayActivity", "GET", {});
}

export async function updateBooking(dataV: any, obj: any) {
    const {hotelId,profile} = await getHotelID();

    const {bookingId,guestsids,total_paid_price} = dataV;
    if(obj.check_in){
        const {data,error} = await supabase.rpc(
            'update_police_case_ids',
            {
                hotel_id: hotelId,
                ids: guestsids
            }
        );
        
        if (error) {
            console.error(error);
            return new Error("Booking could not be updated");
        }
    }
    if(obj.check_out){
        const {data , error} = await supabase
        .from("bookingGuests")
        .update({left_at:obj.check_out,is_inside:false})
        .eq("bookingId", bookingId??dataV)
        .is("left_at",null)
        if(error) console.error(error)
    }
    const { data: { user } } = await supabase.auth.getUser();

    const updatedObj = {
        ...obj,
        is_paid:obj.is_paid,
        last_edit_user: user?.id,
        last_edit_time: new Date().toISOString(),
      };
      console.log(updatedObj)

    const { data, error } = await supabase
        .from("booking")
        .update(updatedObj)
        .eq("id", bookingId??dataV)
        .select()
        .single();

        if (error) {
        console.error(error);
        throw new Error("Booking could not be updated");
       }
       if(obj.total_paid_price > 0){
        const { error: error2 } = await supabase.from("bookingActivity").insert({
            booking_id: bookingId??dataV,
            info:"Payment",
            amount:obj.total_paid_price,
            user_id:user?.id
        });
    
        if (error2) {
            console.error(error2);
            throw new Error("Booking could not be updated");
        }
       }
    return data;
}
export async function checkInOut(action: any,bookingId?:any) {
    return apiRequest<{ bookings: any }>("/user/bookings/checkInOut","GET",{action,bookingId});
}
export async function payment(amount: any,bookingId:any, info: any) {
    return apiRequest<{ bookings: any }>("/user/bookings/payment","GET",{amount,bookingId,info});
}
export async function extendBooking(obj: any) {
    console.log(obj)
    const { data: profile } = await supabase.auth.getUser();
    const { data, error } = await supabase
    .from("booking")
    .update({end_date:obj.date,total_price:obj.TotalPrice})
    .eq("id", obj.id)
    .select()
    .single();
    if (error)  throw new Error("Booking could not be updated");
    const { error: error2 } = await supabase.from("bookingActivity").insert({
        booking_id:obj.id,
        info:"Extended booking to "+ obj.date,
        amount:(-1*obj.ExtensionCost),
        staff_id:profile?.user?.id
    })

    if (error2) throw new Error("Booking could not be updated");
    return data;
}
export async function GuestLeftEnters({guestId,bookingId,action}: any) {
    return apiRequest<{ bookings: any }>("/user/bookings/guestLeftEnters","GET",{guestId,bookingId,action});
}
export async function createEditBooking(
    familyMembers: any,
    familyKids: any,
    orderSummary: any,
    booking_activity: any[],
) {
    orderSummary.totalPrice=parseInt(orderSummary.totalPrice);
    familyMembers.forEach((element: any) => {
        try{
            element.countryFlag = element.countryFlag?.includes("http")?element.countryFlag: `https://flagcdn.com/${element.countryFlag.toLowerCase()}.svg`;
        }catch(e){
            element.countryFlag = `https://flagcdn.com/${element.countryFlag.value.toLowerCase()}.svg`;
        }
        element.gender= element.gender.label?element.gender.label:element.gender
        element.nationality= element.nationality.label?element.nationality.label:element.nationality;
    });
    console.log(familyMembers);
    familyKids.forEach((element: any) => {
        try{
            element.countryFlag = element.countryFlag?.includes("http")?element.countryFlag: `https://flagcdn.com/${element.countryFlag.toLowerCase()}.svg`;
        }catch(e){
            element.countryFlag = `https://flagcdn.com/${element.countryFlag.value.toLowerCase()}.svg`;
        }
        element.gender= element.gender.label?element.gender.label:element.gender;
        element.nationality= element.nationality.label?element.nationality.label:element.nationality;
    });
    console.log(familyKids);
   return apiRequest<{ bookings: any }>("/user/bookings/createEditBooking", "POST", { familyMembers, familyKids, orderSummary ,booking_activity});
}
export async function deleteBooking(id: any) {
    return apiRequest<{ bookings: any }>("/user/bookings/deleteBooking", "DELETE", { id });
}

export async function getBookingsStats(Global: any, city: boolean) {
    const {hotelId,profile} = await getHotelID();

    const { data, error } = await supabase.rpc("get_booking_seo", {
        hotelid: Global == 0 ? null : hotelId,
        group_by: city ? "city" : "country",
    });

    if (error) {
        console.error(error);
        throw new Error("Bookings could not get loaded");
    }
    if (Global === 0 && data) {
        let totalPrice = 0;
        data.forEach((element: any) => {
            totalPrice += element.total_revenue;
        });
        data.forEach((element: any) => {
            element.total_revenue = parseFloat((element.total_revenue/totalPrice).toFixed(2) )* 100 + "%";
        });
    }
    return data;
}
export async function CreateBookingActivity(bookingId: number, activity: string, price: number) {
    const { data, error } = await supabase.from("bookingOrders").insert({
        bookingId: bookingId,
        info: activity,
        amount: price,
    });
    if(error) throw new Error(error.message);
    return data;
}
export async function deleteBookingActivity(id: number) {
    return apiRequest<{ bookings: any }>("/user/bookings/deleteBookingActivity", "DELETE", { id });
}
export async function getBookingCalender(from: any, to: any) {
    return apiRequest<{ bookings: any[] }>("/user/bookings/getBookingCalender", "GET", { from, to }); 
}