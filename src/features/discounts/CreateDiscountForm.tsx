"use client";
import { Input, Form, FileInput, Textarea, FormRow } from "@/components/form";
import { Button, Select, Spinner } from "@/components/ui";

import { useForm } from "react-hook-form";

import { discounts } from "@/utils/types";
import { useCreateDiscount, useEditDiscount } from "@/hooks/discounts";
import { useGetPickedAmenities } from "@/hooks/settings";
import { useCabins } from "@/hooks/cabins";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useDarkMode } from "@/hooks";
export default function CreateDiscountForm({
    DiscountToEdit,
    onCloseModal,
}: {
    DiscountToEdit?: { DiscountData: discounts };
    onCloseModal?: () => void;
}) {
    const Language = useSettingsStore(state => state.Language);
    const { isDarkMode } = useDarkMode();
    const { isCreating, createDiscount } = useCreateDiscount();
    const { isEditing, editDiscount } = useEditDiscount();
    const { GetPickedAmenities, error, isgettingPicked } = useGetPickedAmenities();
    const { cabins, error: error1, isLoading: isLoading1 } = useCabins();
    const isWorking = isCreating || isEditing;
    const formattedDefaults = {
        ...DiscountToEdit?.DiscountData,
        start_date: DiscountToEdit?.DiscountData?.start_date.split("T")[0],
        end_date: DiscountToEdit?.DiscountData?.end_date.split("T")[0],
      };
      
    const { register, handleSubmit, reset, getValues, setValue, formState } = useForm<discounts>({
            defaultValues: formattedDefaults
        });
    const { errors } = formState;
    function onSubmit(data: discounts) {
        if (DiscountToEdit)
            editDiscount({...data},
                {
                    onSuccess: () => {
                        reset();
                        onCloseModal?.();
                    },
                }
            );
        else
            createDiscount(
                { ...data },
                {
                    onSuccess: () => {
                        reset();
                        onCloseModal?.();
                    },
                }
            );
    }
    function onError(errors: any) {
        errors;
    }
    return (
        <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            type={onCloseModal ? "modal" : "regular"}
            iswidestring="true"
        >
            {/* <FormRow label="Hotel" error={errors?.hotelName?.message as string}>
                <Input
                    type="text"
                    id="hotelName"
                    disabled={true}
                    {...register("hotelName", {
                        // required: "This field is required",
                    })}
                />
            </FormRow> */}
            <FormRow
                label={Language==="en"?"Start date":"تاريخ البدء"}
                error={errors?.start_date?.message as string}
            >
                <Input
                    type="date"
                    id="start_date"
                    disabled={false}
                    {...register("start_date", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language==="en"?"End date":"تاريخ الانتهاء"}
                error={errors?.end_date?.message as string}
            >
                <Input
                    type="date"
                    id="end_date"
                    disabled={false}
                    {...register("end_date", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label={Language==="en"?"Discount %":"نسبة الخصم%"}
                error={errors?.discount?.message as string}
            >
                <Input
                    type="number"
                    id="discount"
                    disabled={isWorking}
                    defaultValue={0}
                    {...register("discount", {
                        // required: "This field is required",
                        min: {
                            value: 1,
                            message: "Discount should be at least 1%",
                        },
                        // validate: (discountValue) =>
                        //     discountValue <= getValues().regularPrice ||
                        //     "Discount should be less than regular price",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language==="en"?"Description":"الوصف"}
                error={errors?.description?.message as string}
            >
                <Input
                    type="text"
                    id="description"
                    disabled={isWorking}
                    {...register("description", {
                        // required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow label={Language==="en"?"Rooms":"الغرف"} >
                {!isLoading1 && (
                    <Select
                        isDarkMode={isDarkMode}
                        isMulti={true}
                        menuClose={false}
                        data={cabins?.data.cabins.map((cabin) => {
                            const labelz = `Room ${cabin.name} - ${cabin.type_name_en}`;
                            return { label: labelz, value: cabin.id };
                        })}
                        defaultValue={(()=>{
                            const selectedCabins = cabins?.data.cabins.filter(
                                (cabin: any) => getValues().cabin_ids?.map(Number).includes(cabin.id)
                              ) ?? [];
                            return selectedCabins?.map((cabin:any) => {
                                const labelz = `Room ${cabin.name} - ${cabin.type_name_en}`;
                                return { label: labelz, value: cabin.id };
                            });
                        })()}
                        onChange={(values: any) => {
                            const temparr = values.map((value: any) => {
                                return value.value;
                            });
                            setValue("cabin_ids", temparr);
                        }}
                    ></Select>
                )}
            </FormRow>
            <FormRow label={Language==="en"?"Amenities":"المميزات"} >
                {!isgettingPicked && (
                    <Select
                        isDarkMode={isDarkMode}
                        isMulti={true}
                        menuClose={false}
                        data={GetPickedAmenities}
                        defaultValue={GetPickedAmenities?.filter((amenity:any)=>getValues().amenities_ids?.includes(amenity.id))}
                        onChange={(values: any) => {
                            const temparr = values.map((value: any) => {
                                return value.id;
                            });
                            setValue("amenities_ids", temparr);
                        }}
                    ></Select>
                )}
            </FormRow>
            <p style={{marginBottom:"8rem"}}></p>
            <FormRow>
                <> 
                    <Button
                        variant="secondary"
                        type="reset"
                        onClick={() => onCloseModal?.()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isWorking}>
                        {DiscountToEdit ? "Edit Discount" : "Add Discount"}
                    </Button>
                </>
            </FormRow>
        </Form>
    );
}
