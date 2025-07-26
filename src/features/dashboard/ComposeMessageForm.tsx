"use client";
import { Input, Form, FileInput, Textarea, FormRow } from "@/components/form";

import { Button, Select, SpinnerMini, CountrySelect } from "@/components/ui";

import { useForm } from "react-hook-form";
import { Alert } from "@/utils/types";
import { useGetUsers, usePutMessages } from "@/hooks/messages";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useDarkMode } from "@/hooks";
import { useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
export default function CreateAlertForm({onCloseModal}: {onCloseModal?: () => void}) {
    const Language = useSettingsStore(state => state.Language);
    const {isDarkMode}=useDarkMode();
    const { isPutting, PutMessages } = usePutMessages();
    const { isLoading, error, Users } = useGetUsers();
    const { register, handleSubmit, reset, getValues,setValue, formState } = useForm<any>({defaultValues: {}});
    const { errors } = formState;
    const [type, setType] = useState("message");
    function onSubmit(data: any) {
            PutMessages(
                { ...data},
                {
                    onSuccess: () => {
                        reset();
                        onCloseModal?.();
                    },
                }
            )
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
           {type === "message" && ( <h1 style={{textAlign:"center",marginBottom:"2rem"}}>{Language==="en"?"Compose Message":"إنشاء رسالة"}</h1>)}
           {type === "announcement" && ( <h1 style={{textAlign:"center",marginBottom:"2rem"}}>{Language==="en"?"Compose Announcement":"إنشاء اعلان"}</h1>)}

            <FormRow
                label={Language==="en"?"Type":"النوع"}
                error={errors?.type?.message as string}
            >
                <Select
                    data={[
                        { label: Language === "en" ? "Message" : "رسالة", value: "message" },
                        { label: Language === "en" ? "Announcement" : "اعلان", value: "announcement" },
                    ]}
                    isDarkMode={isDarkMode}
                    placeholder={Language==="en"?"Select Type":"اختر النوع"}
                    onChange={(e: any) => {setType(e.value);setValue("users",[])}}
                ></Select>  
            </FormRow>
           {type === "message" && (<FormRow
                label={Language==="en"?"Users":"المستخدمين"}
                error={errors?.users?.message as string}
            >
                <Select
                    data={Users}
                    isDarkMode={isDarkMode}
                    placeholder={Language==="en"?"Select Users":"اختر المستخدمين"}
                    isMulti={true}
                    menuClose={false}
                    onChange={(e:any) => {setValue("users", e)}}
                    disabled={isLoading}
                >
                </Select>
            </FormRow>)}
             <FormRow
                label={Language==="en"?"topic":"الموضوع"}
                error={errors?.message?.message as string}
            >
                <Input
                    id="topic"
                    defaultValue=""
                    disabled={isPutting}
                    {...register("topic", {
                        // required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language==="en"?"message":"نص الرسالة"}
                error={errors?.message?.message as string}
            >
                <Textarea
                    id="message"
                    defaultValue=""
                    disabled={isPutting}

                    {...register("message", {
                        required: "This field is required",
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
                    <Button type="submit" disabled={isPutting}>
                        {"Compose"}
                    </Button>
                </>
            </FormRow>
        </Form>
    );
}
