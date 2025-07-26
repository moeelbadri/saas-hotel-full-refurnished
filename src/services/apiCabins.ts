import { apiRequest, formatCurrency } from "@/utils/helpers";
import  { supabase,imageBucketName, supabaseUrl } from "./supabase";
import { isArray } from "util";
import { PAGE_SIZE } from "@/utils/constants";

export async function getCabins(pageid?:any,limit?:any,sort?:any,order?:any,filter?:any) {
    return apiRequest<{ cabins: any[], count : string, oldcount : string }>("/user/cabins/getCabins", "GET", { pageid,limit,sort,order,filter });
}

const getIntersectionDays = (
    startDate: Date,
    endDate: Date,
    discountStartDate: Date,
    discountEndDate: Date
): number => {
    // Ensure the dates are in the correct order
    const start = new Date(Math.max(new Date(startDate).getTime(),new Date(discountStartDate).getTime()));
    const end = new Date(Math.min(new Date(endDate).getTime(), new Date(discountEndDate).getTime()));

    // Calculate the difference in days
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    // If the difference is negative, it means there is no intersection
    return diffDays >= 0 ? diffDays  : 0; // +1 to include both start and end dates in the count
};

export async function getAvailableCabins(startDate: Date|string, endDate: Date|string,discount:any,Categoryid:any) {
    const {hotelId,profile} = await getHotelID();

    const diffDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))+1;
    const intersectedDays = Math.ceil(getIntersectionDays(new Date(startDate), new Date(endDate), new Date(discount?.[0]?.start_date), new Date(discount?.[0]?.end_date)))
    
    const { data: availableCabins, error } = await supabase.rpc('get_available_cabins_date', {
        v_end_date: endDate,
        v_start_date: startDate,
        v_category_id :Categoryid,
        v_hotel_id:hotelId,

    });
    console.log(availableCabins)
    if (error) {
        console.error(error);
        throw new Error('Failed to fetch available cabins');
    }
    const groupCabinsByTypename = () => {
        const groups:any = {};
        // console.log(availableCabins)
        availableCabins.forEach((cabin:any) => {
            discount?.forEach((discounted:any) => {
                if(discounted.discountsThings[0].Cabin_ids.includes(cabin.cabinId)){
                    cabin.discount=discounted.discount;
                }
            })

            const discounted =  Boolean(cabin.discount)||discount?.[0]?.discountsThings?.[0].Cabin_ids===null;
            const typename = `${cabin.typeNameEn} - ${cabin.typeNameAr}`;
            if (!groups[typename]) {
                groups[typename] = [];
            }
           const finalCost =  ((diffDays - intersectedDays) * cabin.regularPrice) + 
            (intersectedDays ?? 0) * (cabin.regularPrice * (( discounted===true?(100-(cabin.discount ?? 0)):100) / 100));
              
            groups[typename].push({
                value: cabin.cabinId,
                label: `Room ${cabin.name} - ${formatCurrency(finalCost)} ${ discounted===true?` - ${cabin.discount}% Discounted`:``}`,
                name : `${cabin.name} - ${typename}`,
                cost : (cabin.regularPrice),
                totalCost:finalCost,
                days : diffDays,
                type : typename,
                // color: "#FFFFFF",
                isFixed: false,
            });
        });
    
        return groups;
    };
    const groupedCabins = groupCabinsByTypename();

    const groupedOptions = Object.keys(groupedCabins).map((typename) => ({
        label: typename,
        options: groupedCabins[typename],
    }));
return groupedOptions
}
export async function getCabinsCategories(active:boolean) {
    return apiRequest<{ cabins: any[] }>("/user/cabins/getCategories", "GET", {active});
}
export async function getAvailableCabinsByCategory(id?: number) {
    return apiRequest<{ bookings: any[] }>("/user/bookings/getBookedDaysByCategory", "GET", {id});
    // const {hotelId,profile} = await getHotelID();

    // const {data,error}= await supabase.from("booking").select("bookingCabins!inner(cabins!inner(type)),start_date,end_date").filter("is_paid","eq",true).order("start_date").eq("hotel_id",hotelId).eq("bookingCabins.cabins.type",id??0)
    // if(error) throw new Error(error.message)
    // console.log(data,error,id)
    // const today = new Date();

    // function generateDates(from:any, to:any,dates:any) {
    //     const currentDate = new Date(from);
      
    //     while (currentDate <= to) {
    //         today.toISOString().split("T")[0] <= currentDate.toISOString().split("T")[0] && dates.push(new Date(currentDate).toISOString().split("T")[0]);
    //       currentDate.setDate(currentDate.getDate() + 1);
    //     }
      
    //     return dates;
    //   }
      
    // function mergeIntervals(intervals:any) {
    //     if (!intervals.length) return [];
    
    //     let merged:any = [intervals[0]];
    //     for (let i = 1; i < intervals.length; i++) {
    //       let prev = merged[merged.length - 1];
    //       let current = intervals[i];
    //       if (new Date(current.start_date) <= new Date(prev.end_date)) {
    //         // Merge intervals
    //         prev.end_date = new Date(Math.max(new Date(prev.end_date).getTime(), new Date(current.end_date).getTime()));
    //       } else {
    //         merged.push(current);
    //       }
    //     }
    //     return merged.reduce((dates:any,Booking:any)=>{
    //         generateDates(new Date(Booking.start_date),new Date(Booking.end_date),dates)
    //         // dates.push(new Date(Booking.start_date).toISOString().split("T")[0])
    //         // dates.push(new Date(Booking.end_date).toISOString().split("T")[0])
    //         return dates
    //     },[])
    //   }
    //   return(mergeIntervals(data))
}
export async function getCabinAvailability(id: number,start_date:string,end_date:string,discount:any) {
    const discountOffer = discount?.find((discount:any) => discount.discountsThings[0].Cabin_ids.includes(id));
    const { data, error } = await supabase.rpc("get_unbooked_days_until_booked", {
        cabin_id: id,
        start_date: start_date,
        end_date: end_date
    });
    if (error) throw new Error(error.message);
    const conxecutiveDays = [];
    for ( const day of data) {
        if(day.status==="not booked"){
            if(day.date >= discountOffer.start_date && day.date <= discountOffer.end_date){
                day.regularprice = day.regularprice-(day.regularprice*discountOffer.discount)/100
            }
            conxecutiveDays.push(day);
        }else if(day.status==="booked"){
            break;
        }
    }
    return conxecutiveDays;
}
export async function deleteCabin(id: number) {
    return apiRequest<{ cabins: any[] }>("/user/cabins/deleteCabin", "DELETE", { id });
}

// https://mduiaridvnmrzoyjpofz.supabase.co/storage/v1/object/public/wild-oasis-images/cabin-001.jpg
export async function createEditCabin(newCabin: any, id?: any) {
    return apiRequest<{ cabins: any[] }>("/user/cabins/createEditRooms", "PUT", newCabin);
    const {hotelId,profile} = await getHotelID();

    const {hotels,hotelName,maxCapacity,roomsCategories,name,...cabin_no_hotel} = newCabin;
    const hasImagePath = cabin_no_hotel.image?.startsWith?.(supabaseUrl);
    const imageName = `${Math.random()}-${
        cabin_no_hotel.image?.name as string
    }`.replaceAll("/", "");
    const imagePath = hasImagePath
        ? cabin_no_hotel.image
        : `${supabaseUrl}/storage/v1/object/public/${imageBucketName}/${imageName}`;

    // 1. Create/edit cabin
    let query: any = supabase.from("cabins");
    const CabinNames:any=[];
    isArray(name)?name.map((name:any)=>{
        CabinNames.push({ ...cabin_no_hotel,name:name.label,type:roomsCategories.id??roomsCategories,hotelId:hotelId })
    }):null
    
    // A) CREATE
    if (!id) query = query.insert(name?CabinNames: { ...cabin_no_hotel,name:name,type:roomsCategories.id??roomsCategories, image: cabin_no_hotel.image?.name?imagePath:null,hotelId:hotelId});

    // B) EDIT
    if (id) query = query.update({ ...cabin_no_hotel,type:roomsCategories.id??roomsCategories, image: hasImagePath?imagePath:null })

    if((id&&isArray(id))){query.in('id',id)}else{query.eq("id",id)}

    const { data, error } = await query.select('*');
    if (error) {
        console.error(error);
        throw new Error("Cabin could not be created");
    }
    // ||(cabin_no_hotel.image===undefined||cabin_no_hotel.image===null)
    // 2. Upload image
    if (hasImagePath) return data;
    if(hasImagePath!==undefined){
    const { error: storageError } = await supabase.storage
        .from(imageBucketName)
        .upload(imageName, cabin_no_hotel.image);

    // 3. Delete the cabin IF there was an error uploading image
    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id);
        console.error(storageError);
        throw new Error(
            "Cabin image could not be uploaded and the cabin was not created"
        );
    }
    }
    return data;
}
