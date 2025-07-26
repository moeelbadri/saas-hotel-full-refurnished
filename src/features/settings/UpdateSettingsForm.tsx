"use client";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useDarkMode } from "@/hooks";
import { Checkbox, Form, FormRow, Input } from "@/components/form";
import { Select, SpinnerMini } from "@/components/ui";
import Spinner from "@/components/ui/Spinner";
import {
    useSettings,
    useUpdateSetting,
    useGetAmenitiesSetting,
    useGetPickedAmenities,
    useUpdateHotel,
    usePutAmenities,
} from "@/hooks/settings";
import { useEffect, useState } from "react";
import { Heading } from "@/components/typography";

function UpdateSettingsForm() {
    const { isLoading, settings } = useSettings();
    const {
        min_booking_length = 0,
        max_booking_length = 0,
        max_guests_per_booking = 0,
        breakfast_price = 0,
        hotel_name = "",
        address1 = "",
        address2 = "",
        vat = 0,
        starting_police_case_id = 0,
        id_scan = false,
    } = (settings?.data?.settings) || {};
    const { isDarkMode } = useDarkMode();
    const Language = useSettingsStore(state => state.Language);
    const { isUpdating, updateSettings } = useUpdateSetting();
    const { isGetting, GetAmenities } = useGetAmenitiesSetting();
    const { isgettingPicked, GetPickedAmenities, error } = useGetPickedAmenities(0);
    const {isUpdatingAmenities, updateAmenities} = usePutAmenities();
    const [Amenities, setAmenities] = useState(GetPickedAmenities);

    if (isLoading ||isGetting ||isgettingPicked ) return <Spinner />;

    function handleUpdate(e: any, field: string) {
        const { value, checked } = e.target;
        if (!value) return;
        field == "id_scan" ? updateSettings({ [field]: checked }) : updateSettings({ [field]: value })
    }
    function handleUpdateAmenities(amenities?: any) {
        const sanitzedAmenities = (amenities || Amenities).map((amenity: any) => ({
            amenity_id: amenity.value,
            // name: amenity.label,
            price: amenity.price,
            included: amenity.included
        }))
        updateAmenities({ Amenities : sanitzedAmenities }); 
    }
    return (
        <Form style={{marginBottom:"200px"}}>
            <FormRow label={Language === "en" ? "Hotel name" : "اسم الفندق"}>
                <Input
                    type="text"
                    id="hotel_name"
                    defaultValue={hotel_name}
                    disabled={true}
                    onBlur={(e) => handleUpdate(e, "hotel_name")}
                />
            </FormRow>
            <FormRow
                label={Language === "en" ? "Hotel Address 1" : "عنوان 1 الفندق"}
            >
                <Input
                    type="text"
                    id="address1"
                    placeholder={Language === "en" ? "Street Name,Building No.,Apartment No." : "اسم الشارع,رقم المبنى,رقم الشقة"}
                    defaultValue={address1}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "address1")}
                />
            </FormRow>
            <FormRow
                label={Language === "en" ? "Hotel Address 2" : "عنوان 2 الفندق"}
            >
                <Input
                    type="text"
                    id="address2"
                    placeholder={Language === "en" ? "Destrict,City" : "المنطقة,المدينة"}
                    defaultValue={address2}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "address2")}
                />
            </FormRow>
            <FormRow label={Language === "en" ? "VAT" : "الضريبة"}>
                <Input
                    type="text"
                    id="vat"
                    defaultValue={vat}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "vat")}
                />
            </FormRow>
            <FormRow
                label={
                    Language === "en"
                        ? "starting police case number"
                        : "بداية تتابع رقم ملف الشرطة"
                }
            >
                <Input
                    type="number"
                    id="starting_police_case_id"
                    defaultValue={starting_police_case_id}
                    disabled={isUpdating}
                    onBlur={(e) =>
                        handleUpdate(e, "starting_police_case_id")
                    }
                />
            </FormRow>
            <FormRow
                label={
                    Language === "en"
                        ? "ID Scan Mandatory?"
                        : "هل صورة عن الوثيقة الشخصية مطلوب؟"
                }
            >
                <Checkbox
                    id="id_scan"
                    onChange={(e: any) => handleUpdate(e, "id_scan")}
                    disabled={isUpdating}
                    checked={id_scan}
                />
            </FormRow>
            <Heading style={{ textAlign: "center" }}>
                {Language === "en" ? "Bookings" : "الحجوزات"}
            </Heading>

            <FormRow
                label={
                    Language === "en"
                        ? "Minimum nights/booking"
                        : "الحد الادنى لعدد الايام / الحجوزات"
                }
            >
                <Input
                    type="number"
                    id="min-nights"
                    defaultValue={min_booking_length}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "min_booking_length")}
                />
            </FormRow>

            <FormRow
                label={
                    Language === "en"
                        ? "Maximum nights/booking"
                        : "الحد الاعلى لعدد الايام / الحجوزات"
                }
            >
                <Input
                    type="number"
                    id="max-nights"
                    defaultValue={max_booking_length}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "max_booking_length")}
                />
            </FormRow>

            <FormRow
                label={
                    Language === "en"
                        ? "Maximum guests/booking"
                        : "الحد الاعلى لعدد الافراد / الحجوزات"
                }
            >
                <Input
                    type="number"
                    id="max-guests"
                    defaultValue={max_guests_per_booking}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "max_guests_per_booking")}
                />
            </FormRow>

            <FormRow
                label={
                    Language === "en"
                        ? "Breakfast price/day"
                        : "سعر وجبة الافطر اليومي"
                }
            >
                <Input
                    type="number"
                    id="breakfast_price"
                    defaultValue={breakfast_price}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "breakfast_price")}
                />
            </FormRow>
            <Heading style={{ textAlign: "center" }}>
                {Language === "en" ? "Amenities" : "الخدمات"}
            </Heading>

            <FormRow
                label={
                    Language === "en"
                        ? "Currently Available Amenities"
                        : "الخدمات المتاحة"
                }
            >
                {isgettingPicked ? (
                    <SpinnerMini />
                ) : (
                    <Select
                        data={GetAmenities}
                        defaultValue={GetPickedAmenities}
                        placeholder="Select Available Amenities"
                        isDarkMode={isDarkMode}
                        onChange={(e: any) => setAmenities(e)}
                        onBlur={(e:any)=>{handleUpdateAmenities()}}
                        menuClose={false}
                        isMulti={true}
                    ></Select>
                )}
            </FormRow>
          {isgettingPicked ? (
                    <SpinnerMini />
                ) : (
                GetPickedAmenities.map((Amenity: any, index: any) => (
                    <FormRow label={`${Amenity.label} - Price/day`} key={index}>
                        <Input
                            type="number"
                            placeholder="Price"
                            defaultValue={Amenity.price || 0}
                            onBlur={(e: any) => {
                                const copyAmenities = GetPickedAmenities.map((item: any) => ({ ...item }));
                                copyAmenities.find((item: any) => item.value === Amenity.value).price = e.target.value;
                                setAmenities(copyAmenities)
                                handleUpdateAmenities(copyAmenities);
                            }}
                            disabled={isUpdating}
                        ></Input>
                        <FormRow
                            label={Language === "en" ? "Included?" : "مضمن؟"}
                        >
                            <Checkbox
                                id={`${Amenity.label}-Included`}
                                onChange={(e: any) => {
                                    const copyAmenities = GetPickedAmenities.map((item: any) => ({ ...item }));
                                    copyAmenities.find((item: any) => item.value === Amenity.value).included = e.target.checked;
                                    setAmenities(copyAmenities)
                                    handleUpdateAmenities(copyAmenities);
                                }}
                                disabled={isUpdating}
                                checked={GetPickedAmenities.find((item: any) => item.value === Amenity.value)?.included}     
                            />
                        </FormRow>
                    </FormRow>
                ))
            )}
        </Form>
    );
}

export default UpdateSettingsForm;
