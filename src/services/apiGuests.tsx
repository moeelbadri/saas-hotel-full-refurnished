/*eslint-disable*/
import { apiRequest, getToday } from "../utils/helpers";
import { supabase } from "./supabase";
import { PAGE_SIZE } from "@/utils/constants";

export async function getGuests({
    search,
    sort,
    order,
    page,
    limit,
}: {
    search?: any;
    sort?: any;
    order?: any;
    page?: number;
    limit?: number;
}) {
    return apiRequest<{ guests: any[] }>("/user/guests/getGuests", "GET", { search, sort,order, page, limit });
}

export async function getGuestById(id: any) {
    return apiRequest<{ guest: any }>("/user/guests/getGuest", "GET", { id });
}

export async function getGuestsByQuery(q?: string) {
   return apiRequest<{ guests: any[] }>("/user/guests/getGuestByQuery", "GET", { q });
}


export async function getGuestsById(id?: string) {
    const { data: profile } = await supabase.auth.getUser();
    let hotelId = profile?.user?.user_metadata?.hotel;
    if (!hotelId) {
        const { data: userProfile } = await supabase
            .from("profile")
            .select("hotelId,default_hotelid")
            .eq("userId", profile?.user?.id);
        hotelId = userProfile?.[0].default_hotelid || userProfile?.[0].hotelId;
    }

    const { data, error } = await supabase
        .from("guests")
        .select("id,fullName,nationalID,BirthDate,Gender,nationality,city")
        .like("nationalID", `${id}%`)
        .is("GuestP", null)
        .eq("hotelId", hotelId)
        .limit(10);

    if (error) {
        console.error(error);
        throw new Error("Guest not found");
    }
    return data;
}
export async function getGuestsByGuestP(id: any, adult: boolean) {
    const adulter = new Date();
    adulter.setFullYear(adulter.getFullYear() - 16);
    const currentDate = new Date();
return apiRequest<{ guests: any[] }>("/user/guests/getGuestsByGuestP", "GET", { id, adult }).then((res)=>{
    return res?.data?.guests?.map((item: any) => ({
        label: item.full_name,
        fullName: item.full_name,
        color: "#FFFFFF",
        value: item.id,
        isFixed: false,
        birth_date: item.birth_date.split("T")[0],
        national_id: item.national_id,
        passport_image : item.passport_image,
        nationality: item.nationality,
        country_flag: item.country_flag,
        gender: item.gender,
        city: item.city,
        ...((!adult) && {
            kidWentOverDate: new Date(item.birth_date) < adulter
        })
    }));
   })
}

export async function createEditGuest(newGuest: any, id?: number) {
    // 1. Create/edit cabin
    let query: any = supabase.from("guests");

    // A) CREATE
    if (!id) query = query.insert([{ ...newGuest }]);

    // B) EDIT
    if (id) query = query.update({ ...newGuest }).eq("id", id);

    const { data, error } = await query.select().single();
    if (error) {
        console.error(error);
        throw new Error("Guest could not be created");
    }
    return data;
}
export async function uploadGuests(Guests: any) {
    const { data: profile } = await supabase.auth.getUser();
    let hotelId = profile?.user?.user_metadata?.hotel;
    if (!hotelId) {const { data: userProfile } = await supabase.from("profile").select("hotelId,default_hotelid").eq("userId", profile?.user?.id);hotelId = userProfile?.[0].default_hotelid || userProfile?.[0].hotelId;}
    let convertedData: any[]=[];
    Guests?.map((item: any) => {
        let keys:any={fullName:"",nationalID:"",nationality:null,countryFlag:null,phoneNumber:0,hotelId:hotelId,uploaded:true};
        keys.fullName=item["اسم النزيل"];
        keys.nationalID=parseInt(item["الرقم القومي او جواز سفر"]);
        keys.phoneNumber=parseInt(item["رقم التليفون"])??"";
        keys.nationality=((keys.nationalID)?.toString()?.length===14)?"Egypt":"";
        keys.countryFlag=((keys.nationalID)?.toString()?.length===14)?"https://flagcdn.com/eg.svg":"";
        (convertedData.findIndex((i:any)=>i.nationalID===keys.nationalID)===-1)&&keys.fullName?convertedData.push(keys):null;
    });
    console.log(convertedData)
    const { data, error } = await supabase
        .from("guests")
        .upsert(convertedData)
        .select();
        if (error) {
            console.error(error);
            throw new Error("Guest could not be created");
        }
    console.log(data)
    return data;
}
