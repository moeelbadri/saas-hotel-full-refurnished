"use client";
import { useEffect, useState } from "react";

import {Button} from "@/components/ui";
import { Input, Form, FileInput, Textarea, FormRow } from "@/components/form";
import { Select, SpinnerMini } from "@/components/ui";
import { useUpdateUser } from "./useUpdateUser";
import { useGetHotels,useUser } from "@/hooks/authentication";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useDarkMode } from "@/hooks";
function UpdateUserDataForm() {
    const { isLoading,data,error,isAuthenticated } = useUser();
    // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
    const { isLoading: isLoadingHotels, hotels, error: errorHotels } = useGetHotels();

    const { updateUser, isUpdating } = useUpdateUser();
    const Language = useSettingsStore(state => state.Language);
    const { isDarkMode } = useDarkMode();
    if (!isAuthenticated) return null;

    const [email, setEmail] = useState();
    const [fullName, setFullName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [avatar, setAvatar] = useState(null);
    const [hotel, setHotel] = useState();
    useEffect(() => {
        setEmail(data?.user?.email);
        setFullName(data?.user?.user_metadata?.fullName);
        setPhoneNumber(data?.user?.user_metadata?.phone);
        setAvatar(data?.user?.user_metadata?.avatar);
        setHotel(data?.user?.user_metadata?.hotel);
   }, [data]); 
    if (isLoading||isLoadingHotels) return <SpinnerMini />;
    const {
        email: Currentemail = null,
        user_metadata: {
            fullName: currentFullName = null,
            phone: currentPhoneNumber = null,
            hotel: currentHotel = null,
        },
    } = data?.user || {};
        function handleSubmit(e) {
        e.preventDefault();
        if (!fullName) return;

        updateUser(
            { fullName, avatar, phoneNumber, hotel },
            {
                onSuccess: () => {
                    setAvatar(null);
                    // e.target.reset();
                },
            }
        );
    }

    function handleCancel() {
        setEmail(Currentemail);
        setFullName(currentFullName);
        setPhoneNumber(currentPhoneNumber);
        setAvatar(null);
        setHotel(currentHotel);
    }

    return (
        <Form onSubmit={handleSubmit} type="modal" style={{marginRight: "25%",marginTop: "2rem" }}>
            <FormRow
                label={
                    Language === "en" ? "Email address" : "البريد الالكتروني"
                }
            >
                <Input value={email} disabled />
            </FormRow>
            <FormRow label={Language === "en" ? "Full name" : "الاسم الكامل"}>
                <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    id="fullName"
                    disabled={isUpdating}
                />
            </FormRow>
            <FormRow
                label={Language === "en" ? "Phone number" : "رقم الموبايل"}
            >
                <Input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    id="PhoneNumber"
                    disabled={isUpdating}
                />
            </FormRow>
            <FormRow
                label={Language === "en" ? "Profile image" : "صورة الحساب"}
            >
                <FileInput
                    id="avatar"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    disabled={isUpdating}
                />
            </FormRow>
            <FormRow label={Language === "en" ? "Hotel" : "الفندق"}>
                {isLoadingHotels ? (
                    <SpinnerMini />
                ) : (
                    <Select
                        isDarkMode={isDarkMode}
                        id="DefaultHotel"
                        data={hotels}
                        defaultValue={
                            hotels.filter((hotelS) => hotelS.value === hotel)[0]
                        }
                        onChange={(e) => setHotel(e.value)}
                    ></Select>
                )}
            </FormRow>
            <FormRow>
                <Button
                    type="reset"
                    variation="secondary"
                    disabled={isUpdating}
                    onClick={handleCancel}
                >
                    {Language === "en" ? "Cancel" : "الغاء"}
                </Button>
                <Button disabled={isUpdating}>
                    {Language === "en" ? "Update account" : "تحديث الحساب"}
                </Button>
            </FormRow>
        </Form>
    );
}

export default UpdateUserDataForm;
