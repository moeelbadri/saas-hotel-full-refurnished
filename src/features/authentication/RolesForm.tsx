"use client";

import { useState } from "react";

import { useLogin, useGetHotels, useGetHotelUsers ,useUpdateUserRoles} from "@/hooks/authentication";

import { Button, Select, SpinnerMini } from "@/components/ui";
import { Form, Input, FormRow } from "@/components/form";
import { useDarkMode } from "@/hooks";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Heading } from "@/components/typography";
import styled from "styled-components";
const Th = styled.th`
    border: 1px solid;
    padding: '10px';
    borderRadius:'4px';
    `
const Td = styled.td`
    text-align: center;
    justify-content: center;
    border: 1px solid;
    padding: '10px';
    borderRadius:'4px';
    width: 100px;
    `
const Checkbox = styled.input`
        margin-top: 0.4rem;
        height: 2.4rem;
        width: 2.4rem;
        outline-offset: 2px;
        transform-origin: 0;
        accent-color: var(--color-brand-600);
        cursor: pointer;  
    & :disabled {
        accent-color: var(--color-brand-600);
        cursor: not-allowed;
    }
`
const RolesForm = (data:any) => {
    const {isDarkMode}=useDarkMode();
    const [ Hotel,setHotel ] = useState(data.hotel_id??0);
    const { isLoading: isLoadingHotels, hotels, error } = useGetHotels();
    const {isLoading: isLoadingUsers, hotelUsers, error: errorhotels} = useGetHotelUsers();
    const Language = useSettingsStore(state => state.Language);
    const [ userId, setUserId ] = useState(data.User_id??0);
    const [ Userroles,setUserroles ]=useState({});
    const { updateRoles, isLoading }= useUpdateUserRoles();
    const [fakeLoading, setFakeLoading] = useState(false);
    const PermissionsEn = ["Booking","Guests","Storage","Cabins","Statistics","Users","Reports"];
    const PermissionsAr = ["الحجوزات","الزوار","المخزن","الغرف","الاحصائيات","المستخدمين","التقارير"];
    return (
        <Form onSubmit={(event) => {event.preventDefault();updateRoles({rolesData:Userroles,id:data.User_id});console.log(Userroles)}} iswidestring="true" type="modal" >
             <Heading as="h1" style={{ marginTop: "2rem",marginBottom:"4rem" ,textAlign:"center"}}>{Language==="en"?"Edit roles for users":"تعديل الصلاحيات للمستخدمين"}</Heading>
            <FormRow label={Language==="en"?"Hotel":"الفندق"}>
               {!isLoadingHotels&& <Select
                 isDarkMode={isDarkMode}
                 data={hotels} 
                 defaultValue={hotels?.[0]}
                 disabled={true}
                 onChange={(e: any) => setHotel(e.value)}
                 placeholder={Language==="en"?"Select Hotel":"اختر الفندق"}
                 ></Select>
               }
            </FormRow>
            <FormRow label={Language==="en"?"User":"المستخدم"}>
                {isLoadingUsers && Hotel>0 ? <SpinnerMini/> : 
                <Select
                isDarkMode={isDarkMode}
                data={hotelUsers}
                defaultValue={()=>{
                   const user=hotelUsers?.filter((u: { value: any; })=>u.value===userId);
                    setFakeLoading(true);
                    setTimeout(() => {
                        setFakeLoading(false);
                    }, 0); // Delay to allow the state to update
                    return user
                }}
                disabled={true}
                placeholder={Language==="en"?"Select User":"اختر المستخدم"}
                onChange={(e: any) => {
                    setUserId(e.value);         
                    setFakeLoading(true);
                    setTimeout(() => {
                        setFakeLoading(false);
                    }, 0); // Delay to allow the state to update
                }}
                ></Select>
                }
            </FormRow>
            <FormRow label={Language==="en"?"User Permissions":"الصلاحيات"}>
                <>
                 <table>
                    <thead>
                        <Th>{Language==="en"?"Permissions":"الصلاحيات"}</Th>
                        <Th>{Language==="en"?"Show":"عرض"}</Th>
                        <Th>{Language==="en"?"Create":"انشاء"}</Th>
                        <Th>{Language==="en"?"Edit":"تعديل"}</Th>
                        <Th>{Language==="en"?"Delete":"حذف"}</Th>                
                    </thead>
                    <tbody>
                        {(Language==="en"?PermissionsEn:PermissionsAr).map((permission,index)=>{
                            return (
                            <tr key={permission}>
                            <Td>{permission}</Td>
                            <Td><Checkbox type="checkbox" defaultChecked={data.User_Permissions[PermissionsEn[index]+"Read"]} onChange={(e)=>setUserroles({...Userroles,[PermissionsEn[index]+"Read"]:e.target.checked})}></Checkbox></Td>
                            <Td><Checkbox type="checkbox" defaultChecked={data.User_Permissions[PermissionsEn[index]+"Write"]} onChange={(e)=>setUserroles({...Userroles,[PermissionsEn[index]+"Write"]:e.target.checked})}></Checkbox></Td>
                            <Td><Checkbox type="checkbox" defaultChecked={data.User_Permissions[PermissionsEn[index]+"Edit"]} onChange={(e)=>setUserroles({...Userroles,[PermissionsEn[index]+"Edit"]:e.target.checked})}></Checkbox></Td>
                            <Td><Checkbox type="checkbox" defaultChecked={data.User_Permissions[PermissionsEn[index]+"Delete"]} onChange={(e)=>setUserroles({...Userroles,[PermissionsEn[index]+"Delete"]:e.target.checked})}></Checkbox></Td>
                            </tr>
                          )})}
                    </tbody>
                 </table>
                </>
                </FormRow>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Button size="large">
                    {isLoading ? <SpinnerMini /> : (Language==="en"?"Update Roles":"تحديث الصلاحيات") }
                </Button>
            </div>

        </Form>
    );
};

export default RolesForm;












                
 {/* <div className="tooltip" style={{ textAlign: "center" }}>?
     {Language==="en"?
  <span className="tooltiptext">*Reception : allows Reservation and payments<br/>*Co_Owner : allows Everything , but have no power over the owner<br/>*Storage : allows Adding,Editing items to the Storage<br/>*SEO : allows Access to SEO Statistics<br/>*Statistics : allows Access to financial Reports about the hotel</span>
    :<span className="tooltiptext">*Reception : السماح بالقيام بالحجوزات و تاكيد الدفع <br/>*Co_Owner : يسمح بكل شيء، ولكن ليس له سلطة على المالك <br/>*Storage : يسمح بتعديل واضافة العناصر للمخزن <br/>*SEO : يسمح بالوصول للتحليلات SEO <br/>*Statistics : يسمح بالوصول لتقارير المالية</span>}
  </div> */}