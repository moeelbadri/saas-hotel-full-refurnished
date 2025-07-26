import { Input, Form, FormRow, Checkbox, FileInput } from "@/components/form";
import { Button, Select, Spinner, SpinnerMini } from "@/components/ui";
import { useForm } from "react-hook-form";
import {
    useCreateStorageItem,
    useGetStorageItemsCategories,
} from "@/hooks/storage";
import React from "react";
import { StorageItem } from "@/utils/types";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/components/WizardForm/useStore";

// export default function CreateStorageItemForm() {
const CreateStorageItemForm = ({
    ItemToEdit,
    onCloseModal,
}: {
    ItemToEdit?: any;
    onCloseModal?: () => void;
}) => {
    const { createItem, isCreating } = useCreateStorageItem();
    const { StorageItemsCategories, error, isLoading } = useGetStorageItemsCategories();
    const { register, handleSubmit, reset, formState, setValue, getValues } =
        useForm<StorageItem>({
            defaultValues: ItemToEdit ? ItemToEdit : {},
        });
    const Language = useSettingsStore((state) => state.Language);
    function onSubmit(data: any) {
        const itemData = ItemToEdit
            ? { ...data, id: ItemToEdit.id }
            : { ...data };
        createItem(itemData,
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
    const { errors } = formState;
    return (
        <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            type={onCloseModal ? "modal" : "regular"}
            iswidestring="true"
        >
            <h1 style={{ textAlign: "center", marginTop: "1rem", marginBottom: "5rem" }}>{Language === "en" ? "Add Item" : "إضافة عنصر"}</h1>
            <FormRow
                label={Language === "en" ? "name" : "اسم العنصر"}
                error={errors?.name?.message}
            >
                <Input
                    type="text"
                    id="name"
                    disabled={isCreating}
                    {...register("name", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language === "en" ? "Category" : "الفئة"}
                error={errors?.category?.message}
            >
                {isLoading ? (
                    <SpinnerMini />
                ) : (
                    <Select
                        data={StorageItemsCategories?.data.storage?.map((item: any) => ({
                            value: item.id,
                            label: Language === "en" ? item.name : item.name,
                        }))}
                        defaultValue={StorageItemsCategories?.data.storage?.filter(
                            (item: any) => item.id === ItemToEdit?.category
                        ).map((item: any) => ({
                            value: item.id,
                            label: Language === "en" ? item.name : item.name,
                        }))}
                        isDarkMode={true}
                        isMulti={true}
                        placeholder={
                            Language === "en" ? "Select..." : "اختر..."
                        }
                        onChange={(e: any) => {
                            setValue("category", e?.[0]?.value);
                            if (e.length > 1) {
                                throw new Error(
                                    "Please select only one category"
                                );
                            }
                        }}
                    ></Select>
                )}
                {/* <Input
                    type="text"
                    id="category"
                    disabled={isCreating}
                    {...register("item_category", {
                        required: "This field is required",
                    })}
                /> */}
            </FormRow>

            <FormRow
                label={Language === "en" ? "Cost" : "التكلفة"}
                error={errors?.cost?.message}
            >
                <Input
                    type="number"
                    id="cost"
                    disabled={isCreating}
                    {...register("cost", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
                    

            <FormRow
                label={Language == "en" ? "Critical level" : "مستوى التحذير"}
                error={errors?.criticality?.message}
            >
                <Input
                    type="number"
                    id="criticality"
                    disabled={isCreating}
                    {...register("criticality", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label={Language === "en" ? "Location" : "الموقع"}
                error={errors?.location?.message}
            >
                <Input
                    type="text"
                    id="location"
                    disabled={isCreating}
                    {...register("location", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={
                    Language === "en"
                        ? `Image${
                              ItemToEdit
                                  ? " (Upload img if you want to change it)"
                                  : ""
                          }`
                        : `الصورة${
                              ItemToEdit
                                  ? " (قم برفع صورة اذا اردت التغيير)"
                                  : ""
                          }`
                }
                error={errors?.img?.message}
            >
                <FileInput
                    type="file"
                    id="image"
                    accept="image/*"
                    disabled={isCreating}
                    {...register("img", {
                        // required: "This field is required",
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
                    <Button type="submit" disabled={isCreating}>
                        {ItemToEdit ? "Edit" : "Add"}
                    </Button>
                </>
            </FormRow>
        </Form>
    );
};

export default CreateStorageItemForm;
