import { apiRequest, formateDate, generateDates, getIntersectionDays } from "@/utils/helpers";
import { supabase } from "./supabase";
interface StayDuration {
  stay_duration_days: number;
  frequency: number;
}

export interface DashboardStats {
  total_expenses: number | null;
  confirmed_bookings: number;
  unconfirmed_bookings: number;
  checkins: number;
  occupancy_percentage: number;
  stay_duration_distribution: StayDuration[] | null;
}

export async function getDashboardStats(days: number) {
  return apiRequest<{ statistics: [DashboardStats] }>("/user/statistics/getDashboardStats", "GET", { days });
}
export async function getSalesForCabins(id?: any, month?: any, date?: any,label?:any) {
    if(label != "Revenue") return [];
    const  { hotelId , profile } = await getHotelID();
    console.log(id, month, date)

    let query: any = supabase
        .from("bookingCabins")
        .select(
            "cabinID,price,created_at,cabins!inner(type,name,roomsCategories(typeNameEn,typeNameAr))"
        )
        .eq("cabins.hotelId", hotelId)
        // .eq("cabins.type", 3)
    if (id && id?.[0] !== "c") query = query.eq("cabinID", id);

    if (id && id?.[0] === "c") query = query.eq("cabins.type", id.split("c")[1]);
    
    const { data, error } = await query;
    if (error) {
        console.error(error);
        throw new Error("Data could not be Retrieved");
    }
    console.log(data)

    if (month == "month") {
        data.forEach((element: any) => {
            element.created_at =
                element.created_at.split("-")[0] +
                "-" +
                element.created_at.split("-")[1];
        });
    }else if(month=="day"){
        data.forEach((element: any) => {
            element.created_at = element.created_at.split("T")[0];
        })
    }else if (month == "hour" || month == undefined){
        data.forEach((element: any) => {
            element.created_at = element.created_at.split(":")[0];
        });
    }
    // console.log(data)
    const combineData = (data: any) => {
        const result = data.reduce((acc: any, current: any) => {
            // Create a unique key for each combination of cabinID and created_at
            const key = `${current.cabinID}-${current.created_at}`;

            // If the key already exists, update the sum
            if (acc[key]) {
                acc[key].sum += current.sum;
            } else {
                // Otherwise, add the current object to the accumulator
                acc[key] = { ...current };
            }

            return acc;
        }, {});

        // Convert the accumulated object back into an array
        return Object.values(result);
    };
    const combinedData = combineData(data);

    const simplifiedData: any = [];

    combinedData?.forEach((item: any) => {
        const {
            cabins: {
                name,
                roomsCategories: { typeNameEn,typeNameAr },
            },
            sum,
            price,
            created_at: date,
            ...newitem
        } = item;
        simplifiedData.push({ name, price, date, typeNameEn });
    });
    return simplifiedData;
}
export async function getRevenueByCabins(id?: any, month?: any, date?: any) {
    const  { hotelId , profile } = await getHotelID();
    
    const query: any = supabase
        .from("bookingActivity")
        .select(
            "id,created_at::date,amount.sum()"
        )
        .gte("amount",0);

    const { data, error } = await query;
    if (error) {
        console.error(error);
        throw new Error("Revenue could not be Retrieved");
    }
    // console.log(data)
    return data;
}
export async function getOccupancyForCabins(id?: any, month?: any, date?: any,label?:any) {
    console.log(label)
    if(label != "Occupancy") return [];
    const  { hotelId , profile } = await getHotelID();

    const Last = new Date(new Date());
    Last.setDate(new Date().getDate() - (date ?? 1));
    let query: any = supabase
        .from("cabins")
        .select(
            "id,bookingCabins(booking!inner(start_date,end_date)),name,roomsCategories!inner(typeNameEn,typeNameAr)"
        )
        .eq("hotelId", hotelId)
        .gte("bookingCabins.booking.end_date", Last.toISOString().split("T")[0])
        .lte(
            "bookingCabins.booking.start_date",
            new Date().toISOString().split("T")[0]
        );

    if (id && id?.[0] !== "c") query = query.eq("id", id);

    if (id && id?.[0] === "c") query = query.eq("type", id.split("c")[1]);

    const { data, error } = await query;
    data.forEach((element: any) => {
        element.Occupancy_Rate = 0;
        element.bookingCabins.forEach((element2: any) => {
            element.Occupancy_Rate += getIntersectionDays(
                element2.booking.start_date,
                element2.booking.end_date,
                Last,
                new Date()
            );
        });
        element.Occupancy_Rate =
            "%" + Math.round((element.Occupancy_Rate / (date ?? 1)) * 100);
    });
    if (error) {
        console.error(error);
        throw new Error("Data could not be Retrieved");
    }
    const simplifiedData: any = [];
    data?.forEach((item: any) => {
        const {
            name,
            Occupancy_Rate,
            roomsCategories: { typename },
            ...newitem
        } = item;
        simplifiedData.push({ name, Occupancy_Rate, typename });
    });
    return simplifiedData;
}
export async function getCabinsAndCategories() {
    const  { hotelId , profile } = await getHotelID();


    const { data, error } = await supabase
        .from("roomsCategories")
        .select("id,typeNameEn,typeNameAr,cabins!inner(name,id)")
        .eq("hotelId", hotelId);
    if (error) {
        console.error(error);
        throw new Error("Cabins Categories could not be Retrieved");
    }
    console.log(data);
    return data;
}

export async function getAverageBookingLength() {
    const  { hotelId , profile } = await getHotelID();


}
export async function getRepeatedGuests(){
    const  { hotelId , profile } = await getHotelID();

    const { data, error } = await supabase
        .from("booking")
        .select("booking_count:count(),guests!booking_guest_p_fkey(fullName)")
        .eq("hotel_id", hotelId);
        const simplifiedData: any = [];

        data?.forEach((element: any) => {
            const {booking_count,guests:{fullName}}=element;
            simplifiedData.push({fullName,booking_count});
        })
    if (error) {
        console.error(error);
        throw new Error("Data could not be Retrieved");
    }
    return simplifiedData;
}

export async function getRevenueByGuests(){
    const  { hotelId , profile } = await getHotelID();
    const { data, error } = await supabase
        .from("booking")
        .select("booking_Revenue:total_price.sum(),guests!booking_guest_p_fkey(fullName)")
        .eq("hotel_id", hotelId);
        const simplifiedData: any = [];

        data?.forEach((element: any) => {
            const {booking_Revenue,guests:{fullName}}=element;
            simplifiedData.push({fullName,booking_Revenue});
        })
    if (error) {
        console.error(error);
        throw new Error("Data could not be Retrieved");
    }
    return simplifiedData;
}
export async function getBookings(){
    const  { hotelId , profile } = await getHotelID();
    const { data, error } = await supabase
        .from("booking")
        .select("id,guests!guest_p(fullName)")
        .eq("hotel_id", hotelId);
    const RefinedData: { value: any; label: string; }[] =[];
    data?.forEach((element:any) => {
         const {
            id,
            guests : {
                fullName
            }
         } = element
         RefinedData.push({ value: id, label: `${id} - ${fullName}` })
    });
    if (error) {
        console.error(error);
        throw new Error("Data could not be Retrieved");
    }
    return RefinedData;
}
export async function getRevenuePerBookings(id?:any,month?:any,last?:any,label?:any) {
    if(label != "Revenue Per Bookings") return [];
    const  { hotelId , profile } = await getHotelID();
    let query: any = supabase
        .from("bookingActivity")
        .select("booking_id,amount.sum(),booking(hotel_id)")
        .gte("amount",0)
        .eq("booking.hotel_id", hotelId);
    const lastDays = new Date(new Date().setDate(new Date().getDate() - last));
    lastDays.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    if(last) query = query.gte("created_at", lastDays.toISOString().split("Z")[0]);
    
    if(id) query = query.eq("booking_id",id)

    const { data, error } = await query;
    if (error) {
        console.error(error);
        throw new Error("Data could not be Retrieved");
    }
    const RefinedData = data?.map((item: any) => ({
        name: item.booking_id,
        amount: item.sum,
    }));

return RefinedData;
}