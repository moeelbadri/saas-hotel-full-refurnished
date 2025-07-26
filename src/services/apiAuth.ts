import { apiRequest } from "@/utils/helpers";
import  { supabase,supabase2,supabaseUrl } from "./supabase";
import { useAccountStore , setRolesVar, Roles} from "@/components/WizardForm/useStore";
import { UUID } from "crypto";
// import { Guests, Reports, Users } from "@/pages";
let onetime = false;
export async function Signup({
    full_name,
    email,
    password,
    phone,
}:{
    full_name: string;
    email: string;
    password: string;
    phone: string;
}){
    return apiRequest<{ token: string; user: any }>("/users/register", "POST", { full_name, email, password, phone });
}
export async function createEditUser({
    full_name,
    email,
    password,
    phone,
    job,
    permissions
}: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    job:any;
    permissions:any
}) {
  return apiRequest<{ token: string; user: any }>("/user/createEditUser", "POST", { full_name, email, password, phone,job,permissions });
}
export async function deleteUser(id: string) {
  return apiRequest<{ token: string; user: any }>("/user/deleteUser", "DELETE", { id });
}
export async function login({ email, password }: { email: string; password: string }) {
    localStorage.clear();
    return apiRequest<{ token: string; user: any }>("/users/login", "POST", { email, password });
}

export async function getUsers(){
    return apiRequest<{ users: any }>("/user/getUsers", "GET");
}
export async function getCurrentUser(){
    return apiRequest<{profile: {user_id:UUID;hotel_id:UUID;is_owner: boolean;full_name:string;default_hotelid:UUID;preferred_language:string;language:string; permissions: Roles }}>("/user/auth", "GET");
}
export async function getProfile(){
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return apiRequest<{profile: {user_id:UUID;hotel_id:UUID;is_owner: boolean;full_name:string;default_hotelid:UUID;preferred_language:string;language:string; permissions: Roles }}>("/user/profile", "GET");
}
export async function getHotels(){
    return (await apiRequest<{ hotels: any; }>("/users/getHotels", "GET"))?.data?.hotels.map((item: any) => ({ label: item.hotelName, value: item.id,name:item.id,owner:item.ownerId ,isFixed: false}));
}
export async function getHotelUsers() {
    return (await apiRequest<{ hotels: any; }>("/user/getHotels", "GET"))?.data?.hotels.map((item: any) => ({ label: item.hotelName, value: item.id,name:item.id,owner:item.ownerId ,isFixed: false}));
}
export async function updateUserRoles(rolesData:any, id: string) {
    console.log(rolesData,id)
    if(id=="0") throw new Error("0");
    const { data, error } = await supabase
        .from("profiles")
        .update(rolesData)
        .eq("userId", id);

    if (error) throw new Error(error.message);

    return data;
}
export async function logout() {
   return true;
}

export async function updateCurrentUser({ password, fullName,phoneNumber, avatar,hotel }: any) {
    // 1. Update password OR fullName
    if (!password && !fullName && !avatar && !phoneNumber && !hotel) throw new Error("Nothing to update");

    let updateData = {};
    if (password) updateData = { password };
    if (fullName) updateData = { data: { fullName,phone:phoneNumber,hotel } };

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) throw new Error(error.message);
    if (!avatar) return data;

    // 2. Upload the avatar image
    const fileName = `avatar-${data.user.id}-${Math.random()}`;

    const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar);

    if (storageError) throw new Error(storageError.message);

    // 3. Update avatar in the user
    const { data: updatedUser, error: error2 } = await supabase.auth.updateUser(
        {
            data: {
                avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
            },
        }
    );

    if (error2) throw new Error(error2.message);
    return updatedUser;
}
