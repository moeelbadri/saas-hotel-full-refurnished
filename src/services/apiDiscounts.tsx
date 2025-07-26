import { apiRequest } from "@/utils/helpers";
import  { supabase,imageBucketName, supabaseUrl } from "./supabase";

export async function getDiscounts(){
    return apiRequest<{ discounts: any[] }>("/user/discounts/getActiveDiscounts", "GET");
//     const { data:profile } = await supabase.auth.getUser();
//     let hotelId = profile?.user?.user_metadata?.hotel;
//     if(!hotelId) {const {data: userProfile} = await supabase.from("profile").select("hotelId,default_hotelid").eq("userId",profile?.user?.id);hotelId=userProfile?.[0].default_hotelid||userProfile?.[0].hotelId}
    
// const { data, error } = await supabase.from("discounts")
//     .select("*,discountsThings(*)")
//     .eq("hotel_id", hotelId)
//     .lte("start_date", new Date().toISOString().split("T")[0])
//     .gte("end_date", new Date().toISOString().split("T")[0])
    
// console.log(data)
// if (error) {
//     console.error(error);
//     throw new Error("Discounts could not be fetched");
// }

// return data;
}
export async function getAllDiscounts(sortBy?:any) {
    return apiRequest<{ discounts: any[] }>("/user/discounts/getAllDiscounts", "GET", {sort:sortBy.field,by:sortBy.direction });
    // const { data:profile } = await supabase.auth.getUser();
    // let hotelId = profile?.user?.user_metadata?.hotel;
    // if(!hotelId) {const {data: userProfile} = await supabase.from("profile").select("hotelId,default_hotelid").eq("userId",profile?.user?.id);hotelId=userProfile?.[0].default_hotelid||userProfile?.[0].hotelId}
    // let query:any = supabase.from("discounts")
    // .select("*,discountsThings(*)")
    // .eq("hotel_id", hotelId)
    //  // SORT
    //  if (sortBy)
    //     query = query.order(sortBy.field, {
    //         ascending: sortBy.direction === "asc",
    //     });

    // const { data, error } = await query;
    // if (error) {
    //     console.error(error);
    //     throw new Error("Discounts could not be fetched");
    // }
    
    // return data;
}
export async function createEditDiscount(newDiscount: any) {
    return apiRequest<{ discounts: any[] }>("/user/discounts/putDiscounts", "PUT", newDiscount);
}