"use client";
import { Input, Form, FileInput, Textarea, FormRow } from "@/components/form";

import { Button, Select, SpinnerMini } from "@/components/ui";

import { useForm } from "react-hook-form";
import { Alert } from "@/utils/types";
import { usePutAlerts} from "@/hooks/settings";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useDarkMode } from "@/hooks";
import { useState } from "react";
export default function CreateAlertForm({
    alertToEdit,
    onCloseModal,
}: {
    alertToEdit?: { alertData: Alert;Alerts?:[] };
    onCloseModal?: () => void;
}) {
    const Language = useSettingsStore(state => state.Language);
    const {isDarkMode}=useDarkMode();
    const { isPutting,PutAlerts } = usePutAlerts();
    
    const [Type,setType]=useState(0)
    const [isPermanent,setisPermanent]=useState<boolean>()

    const isWorking = isPutting;
    const { id: editId, ...editValues } = (alertToEdit?.alertData || {}) as Alert;
    const isEditSession = Boolean(editId);
    if(isEditSession){editValues.editId=editId}
    const { register, handleSubmit, reset, getValues,setValue, formState } =
        useForm<Alert>({
            defaultValues: isEditSession ? editValues : {},
        });
    const { errors } = formState;
    function onSubmit(data: Alert) {
            PutAlerts(
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
    const TypeA = [{label:Language==="en"?"Note":"ملحوظة",value:0},{label:Language==="en"?"Alert":"تنبيه",value:1}];
    const PriorityA=[{label:Language==="en"?"Low":"منخفض",value:0},{label:Language==="en"?"Important":"مهم",value:1},{label:Language==="en"?"Urgent":"عاجل",value:2}];
    const DurationA =[{label:Language==="en"?"Temporary":"مؤقت",value:false},{label:Language==="en"?"Permanent":"دائم",value:true}];
    return (
        <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            type={onCloseModal ? "modal" : "regular"}
            iswidestring="true"
        >
            <h1 style={{textAlign:"center",marginBottom:"2rem"}}>{Language==="en"?"Add Message":"اضافة رسالة"}</h1>
            <FormRow
                label={Language==="en"?"Message Type":"نوع الرسالة"}
                error={errors?.type?.message as string}
            >
               {<Select
                    data={TypeA}
                    isDarkMode={isDarkMode}
                    placeholder={Language==="en"?"Select Type":"حدد نوع"}
                    isMulti={false}
                    disabled={(alertToEdit?.Alerts?.length??0)>0}
                    defaultValue={()=>{
                        getValues()?.priority_level===-1?setType(0):setType(1);
                        getValues()?.priority_level===-1? setValue("type","0"):setValue("type","1");
                        return getValues()?.priority_level===-1?TypeA[0]:TypeA[1];
                    }}
                    onChange={(e:any) => {
                    setValue("type", e?.value)
                    setType(e?.value)
                      }
                }
                >
                </Select>} 
            </FormRow>
           {Type===1 && <FormRow
            label={Language==="en"?"Priority Level":"مستوى الاهمية"}
            error={errors?.priority_level?.message as string}
            >
                <Select
                    data={PriorityA}
                    isDarkMode={isDarkMode}
                    placeholder={Language==="en"?"Select Priority Level":"حدد مستوى الاهمية"}
                    isMulti={false}
                    disabled={(alertToEdit?.Alerts?.length??0)>0}
                    defaultValue={PriorityA[getValues()?.priority_level]}
                    onChange={(e:any) => {
                        if(e.length>1){
                                throw new Error("Please select only one type").message
                    }
                    setValue("priority_level", e?.value)
                      }
                }
                >
                </Select>
             </FormRow>}
             {
                Type==0 && <FormRow 
                label={Language==="en"?"Duration Type":"نوع المدة"}
                error={errors?.Permanent?.message as string}>
                 <Select
                 data={DurationA}
                 isDarkMode={isDarkMode}
                 placeholder={Language==="en"?"Select Type":"حدد نوع"}
                 isMulti={false}
                 disabled={(alertToEdit?.Alerts?.length??0)>0}
                 defaultValue={()=>{
                    setisPermanent((getValues()?.priority_level===-1||getValues()?.Permanent===true)?false:true)
                    return getValues()?.Permanent===true?DurationA[1]:DurationA[0]
                 }}
                 onChange={(e:any) => {
                     setValue("Permanent", e?.value)
                     setisPermanent(e?.value)
                       }
                 }
                 
                 ></Select>
                 </FormRow>
             }
             {isPermanent===false &&
                <FormRow
                label={Language==="en"?"End Date":"تاريخ الانتهاء"}
                error={errors?.end_date?.message as string}
                >
                 <Input
                 type="date"
                 id="end_date"
                 defaultValue={getValues()?.end_date?.split("T")[0]}
                 disabled={isWorking}
                 {...register("end_date", {
                     required: "This field is required",
                 })}
                 />
                </FormRow>
             }
            <FormRow
                label={Language==="en"?"message":"الموضوع"}
                error={errors?.message?.message as string}
            >
                <Textarea
                    id="message"
                    defaultValue=""
                    disabled={isWorking}

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
                    <Button type="submit" disabled={isWorking}>
                        {isEditSession ? "Edit" : "Add"}
                    </Button>
                </>
            </FormRow>
        </Form>
    );
}
