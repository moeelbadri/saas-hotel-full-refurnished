"use client";
import { Input, Form, FileInput, Textarea, FormRow } from "@/components/form";

import { Button, Select, SpinnerMini } from "@/components/ui";

import { useForm } from "react-hook-form";
import { Cabin,Hotel } from "@/utils/types";
import { useCreateCabin, useEditCabin ,useGetCabinsCategories} from "@/hooks/cabins";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useDarkMode } from "@/hooks";
function CreateCabinForm({
    cabinToEdit,
    onCloseModal,
}: {
    cabinToEdit?: { cabinData: Cabin;Cabins?:[] };
    onCloseModal?: () => void;
}) {
    const Language = useSettingsStore(state => state.Language);
    const {isDarkMode}=useDarkMode();
    const { isLoading : isCreating, createCabin } = useCreateCabin();
    const { isEditing, editCabin } = useEditCabin();

    const {isLoading,CabinsCategories,error} = useGetCabinsCategories(true);

    const isWorking = isCreating || isEditing;
    const { id: editId, ...editValues } = (cabinToEdit?.cabinData || {}) as Cabin;
    editValues.hotelName=editValues.hotels?.hotelName;
    const isEditSession = Boolean(editId);
    const editIds = cabinToEdit?.Cabins?.filter((cabin,index) => index%2==1);

    const { register, handleSubmit, reset, getValues,setValue, formState } =
        useForm<Cabin>({
            defaultValues: isEditSession ? editValues : {},
        });
    const { errors } = formState;
    function onSubmit(data: Cabin) {
        const image = typeof data.image === "string" ? data.image : data.image?.[0];
            console.log( data)
        if (isEditSession)
            editCabin( 
                { cabinData: { ...data, image }, cabinId: editIds||editId },
                {
                    onSuccess: () => {
                        reset();
                        onCloseModal?.();
                    },
                }
            );
        else{
            createCabin(
                { ...data, image: image },
                {
                    onSuccess: () => {
                        reset();
                        onCloseModal?.();
                    },
                }
            );
        }
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
            {/* <FormRow label={Language==="en"?"Hotel":"الفندق"} error={errors?.Hotel?.message as string}>
            <Input
                    type="text"
                    id="hotelName"
                    disabled={true}
                    // {...register("hotelName", {
                    //     required: "This field is required",
                    // })}
                />
            </FormRow> */}
            <h1 style={{textAlign:"center",marginBottom:"2rem"}}>{Language==="en"?`${isEditSession?"Edit":"Create"} Cabin : ${cabinToEdit?.cabinData?.name}`:`${isEditSession?"تعديل":"اضافة"} غرفة : ${cabinToEdit?.cabinData?.name}`}</h1>
            <FormRow label={Language==="en"?"Room Number":"رقم الغرفة"} error={errors?.name?.message as string}>

                <Select
                data={[]}
                defaultValue={()=>{
                    const tempids =[];
                    const temp = getValues("name")?[{label:getValues("name"),value:editId}]:[];
                    for ( let i =0 ; i<(cabinToEdit?.Cabins?.length||0);i+=2){
                        tempids.push({
                            label: cabinToEdit?.Cabins?.[i],
                            value: cabinToEdit?.Cabins?.[i + 1] // Handle case where there might be an odd number of cabins
                          });
                    }
                     
                    if(temp) setValue("name",tempids.length>0?tempids:temp[0]?.label);

                    return tempids.length>0?tempids:temp;
                }}
                selectCreate={true}
                placeholder={Language==="en"?"Enter One / More (For Bulk Creating) Room Numbers":"ادخل رقم او ارقام الغرف  (لانشاء مجموعة من الغرف في ان واحد) "}
                isDarkMode={isDarkMode}
                isMulti={true}
                onChange={(e:any) => setValue("name",e)}
                disabled={Boolean(getValues("name"))}
                >    
                </Select>
             </FormRow>

            <FormRow
                label={Language==="en"?"Price per night":"سعر اليلة"}
                error={errors?.regularPrice?.message as string}
            >
                <Input
                    type="number"
                    id="regular_price"
                    disabled={isWorking}
                    {...register("regular_price", {
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Price should be at least 1",
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label={Language==="en"?"Room Type":"نوع الغرفة"}
                error={errors?.roomsCategories?.message as string}
            >
               {isLoading ? <SpinnerMini /> :  <Select
                    data={CabinsCategories?.data?.cabins?.map((item) => ({ label: Language==="en"?item.type_name_en:item.type_name_ar, value: item.id }))}
                    defaultValue={CabinsCategories?.data?.cabins?.filter((item) => +item.id === editValues?.type).map((item) => ({ label:Language==="en"?item.type_name_en:item.type_name_ar, value: item.id }))}
                    isDarkMode={isDarkMode}
                    placeholder={Language==="en"?"Select Room Type":"حدد نوع الغرفة"}
                    isMulti={true}
                    disabled={(cabinToEdit?.Cabins?.length??0)>0}
                    onChange={(e:any) => {
                        if(e.length>1){
                                throw new Error("Please select only one room type").message
                    }
                    setValue("roomsCategories", e?.[0]?.value)
                      }
                }
                >
                </Select>} 
            </FormRow>

            <FormRow
                label={Language==="en"?"Description":"الوصف"}
                error={errors?.description?.message as string}
            >
                <Textarea
                    id="description"
                    defaultValue=""
                    disabled={isWorking}
                    {...register("description", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label={Language==="en"?"Room photo (optional)":"صورة الغرفة (اختياري)"}
                error={errors?.image?.message as string}
            >
                <FileInput
                    id="image"
                    accept="image/*"
                    disabled={((cabinToEdit?.Cabins?.length??0)>0)||isWorking}
                    {...register("image", {
                        // required: isEditSession
                        //     ? false
                        //     : "This field is required",
                    })}
                />
            </FormRow>

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
                        {isEditSession ? "Edit Room" : "Add Room"}
                    </Button>
                </>
            </FormRow>
        </Form>
    );
}

export default CreateCabinForm;
