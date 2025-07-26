import { apiRequest } from "@/utils/helpers";
import  { supabase,imageBucketName, supabaseUrl } from "./supabase";
import { PAGE_SIZE } from "@/utils/constants";

export async function getStorageActivities(id?:any,pageid?:any,limit:any = PAGE_SIZE) {
    return apiRequest<{ storage: any[] , count: number , oldcount: number }>("/user/storage/getStorageActivities", "GET", { id,pageid,limit });
    // const  { hotelId , profile } = await getHotelID();
    // let query: any = supabase
    //     .from("storage")
    //     .select("id,name,cost,location,img,category,criticality,storageActivity(quantity:quantity.sum())",{ count: "exact" })
    //     .eq("hotel",hotelId)
    //     .limit(pageSize);
    //     if(id) query.eq("id",id);
    //       // PAGINATION               
    // if (page) {
    //     const from = (page - 1) * (pageSize??PAGE_SIZE);
    //     const to = from + (pageSize??PAGE_SIZE) - 1;
    //     query = query.range(from, to);
    // }
    //     const { data, error } = await query;        
    // if (error) {
    //     console.error(error);
    //     throw new Error("storage activities could not be fetched");
    // }
    // return data;
}
export async function getStorageItemsCategories(){
    return apiRequest<{ storage: any[] }>("/user/storage/getStorageItemsCategories", "GET");
    // const  { hotelId , profile } = await getHotelID();

    // const {data,error}=await supabase.from("storageCategories").select("id,name,ar_name").or(`hotel_id.eq.${hotelId},hotel_id.is.null`);
    // if (error) {
    //     console.error(error);
    //     throw new Error("storage items categories could not be fetched");
    // }
    // return data;
}
export async function getDrinks(){
    return apiRequest<{ storage: any[] }>("/user/storage/getDrinks", "GET");
    // const  { hotelId , profile } = await getHotelID();

    // const {data,error}= await supabase.from("storageCategories")
    // .select("id,name,storage(id,name,cost,location,storageActivity(quantity.sum()))")
    // .eq("storage.hotel",hotelId)
    // .eq("id",1)
    // // console.log(data)
    // if (error) {
    //     console.error(error);
    //     throw new Error("storage Items could not be fetched");
    // }
    // return data;
}
export async function orderDrinks(item:any,quantity:number,bookingId:number){
    const  { hotelId , profile } = await getHotelID();

    const {data,error}= await supabase
    .from("storageActivity")
    .insert({
        item_id : item.id,
        quantity:-quantity,
        description:`Drinks Order for booking ${bookingId}`,
        user_id:profile.user?.id
    }).then(()=>{
        return supabase
        .from("bookingActivity")
        .insert({
            booking_id:bookingId,
            item_id : item.id,
            amount:-(quantity*item.cost),
            info:`Drinks`,
            user_id:profile.user?.id
        });
    })
    // if(ActivityError){
    //     const failedid:any = data?.[0];
    //     await supabase.from("storageActivity").delete().eq("id",failedid.id);
    //     console.error(error);
    //     throw new Error("Failed to Insert");
    // }
    return true;
}
export async function getStorageItemsAtCritical(){
    return apiRequest<{ storage: any[] }>("/user/storage/getStorageItemsAtCriticalLevel", "GET");
}
export async function getStorageItems(){
    const data = await apiRequest<{ storage: any[] }>("/user/storage/getStorageItems", "GET");
    let tempvar="";
    const tempCategory: any[]=[];
    data?.data.storage.forEach((item: any) => {
        if(tempvar!=item.category_id){
            tempCategory.push({
                label: `Cat. : ${item.category_name}`,
                arlabel: `الصنف : ${item.category_ar_name}`,
                value: "c"+item.category_id,
                isFixed: false,
            })
            tempvar=item.category_id;
        }
    
     tempCategory.push({
        label: item.name,
        value: item.id,
        isFixed: false,
    })
})
return [{label:"All items",arlabel:"كل العناصر",value:null,isFixed:false},...tempCategory];
}
export async function deleteStorageItem(newItemData:any) {
    const {data:imgdata,error:imgerror} = await supabase.storage.from(imageBucketName).remove([newItemData.img.split(`${imageBucketName}/`)[1]])
    if(imgerror){
        console.error(imgerror);
        throw new Error("img could not be deleted");
    }
    const { data, error } = await supabase.from("storage").delete().eq("id", newItemData.storage_id);
    if (error) {
        console.error(error);
        throw new Error("item could not be deleted");
    }

    return data;
}
export async function addStorageActivity(id:number,newActivty: any,isReplinching:boolean) {
    return apiRequest<{ storage: any[] }>("/user/storage/addStorageActivity", "POST",{id,newActivty,isReplinching});
}

// https://mduiaridvnmrzoyjpofz.supabase.co/storage/v1/object/public/wild-oasis-images/cabin-001.jpg
export async function EditCreateStorageItem(item: any) {
    return apiRequest<{ storage: any[] }>("/user/storage/EditCreateStorageItem", "POST",item,{id:item.id});
    // const {storageActivity,quantity,...newItem}=newItemOld.data;

    // const  { hotelId , profile } = await getHotelID();
    // const hasImagePath = newItem.img?.startsWith?.(supabaseUrl);
    // const imageName = `${Math.random()}`.replaceAll("/", "");
    // const imagePath = hasImagePath
    //     ? newItem.img
    //     : `${supabaseUrl}/storage/v1/object/public/${imageBucketName}/${imageName}`;

    // // 1. Create/edit cabin
    // let query: any = supabase.from("storage");

    // // A) CREATE
    // if (!newItem.id) query = query.insert([{ ...newItem, img: imagePath, hotel: hotelId }]);

    // // B) EDIT
    // if (newItem.id){
    //     const {img,net_quantity,...newEdit}=newItem;
    //     console.log(net_quantity)
    //     console.log(newEdit)
    //     query = query.update({ ...newEdit,img:imagePath}).eq("id", newEdit.id);
    // }

    // const { data, error } = await query;
    // if (error) {
    //     console.error(error);
    //     throw new Error("Cabin could not be created");
    // }
    // // 2. Upload image
    // if (hasImagePath) return data;

    // const { error: storageError } = await supabase.storage
    //     .from(imageBucketName)
    //     .upload(imageName, newItem.img[0]);

    // // 3. Delete the cabin IF there was an error uploading image
    // if (storageError) {
    //     await supabase.from("storage").delete().eq("id", data.id);
    //     console.error(storageError);
    //     throw new Error(
    //         "Cabin image could not be uploaded and the item was not created"
    //     );
    // }

    // return data;
}
