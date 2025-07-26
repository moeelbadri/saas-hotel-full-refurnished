"use client";

import { useForm } from "react-hook-form";

import { useCreateEditUser } from "@/hooks/authentication";

import { Button ,Select} from "@/components/ui";
import { Form, FormRow, Input } from "@/components/form";
import {useGetHotels} from "@/hooks/authentication";

export interface rolesOptions {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
    readonly isTrue?:boolean;
}
const roles:  rolesOptions[]  = [
    { value: "Co_owner", label: "Co-owner", color: "green", isFixed: true,isTrue:true },
    { value: "cashier", label: "Reception", color: "#0052CC", isDisabled: false,isTrue:true  },
    { value: "storage", label: "Storage", color: "#5243AA",isTrue:true  },
    { value: "SEO", label: "SEO", color: "#FF5630", isFixed: true,isTrue:true  },
    { value: "statistics", label: "Statistics", color: "#FF8B00" ,isTrue:true },
];
// Add this interface to your existing interfaces
interface Roles {
    BookingRead: boolean;
    BookingWrite: boolean;
    BookingEdit: boolean;
    BookingDelete: boolean;
    CabinsRead: boolean;
    CabinsWrite: boolean;
    CabinsEdit: boolean;
    CabinsDelete: boolean;
    StorageRead: boolean;
    StorageWrite: boolean;
    StorageEdit: boolean;
    StorageDelete: boolean;
    StatisticsRead: boolean;
    StatisticsWrite: boolean;
    StatisticsEdit: boolean;
    StatisticsDelete: boolean;
    GuestsRead: boolean;
    GuestsWrite: boolean;
    GuestsEdit: boolean;
    GuestsDelete: boolean;
    ReportsRead: boolean;
    ReportsWrite: boolean;
    ReportsEdit: boolean;
    ReportsDelete: boolean;
    UsersRead: boolean;
    UsersWrite: boolean;
    UsersEdit: boolean;
    UsersDelete: boolean;
}
import { useDarkMode } from "@/hooks";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useState } from "react";
import { Heading } from "@/components/typography";
// Email regex: /\S+@\S+\.\S+/

function SignupForm({onCloseModal}:{onCloseModal?: () => void;})  {
    // const { hotels, isLoading: isLoadingHotels } = useGetHotels();
    // const [ hotel, setHotel ] = useState(hotels?.[0]?.value||"");
    const [userRole,setUserRole]=useState();
    // Add this state to your SignupForm component (with other useState declarations)
    const [selectedRoles, setSelectedRoles] = useState<Partial<Roles>>({});
    
    // Add state for select all checkboxes
    const [selectAllStates, setSelectAllStates] = useState({
        read: false,
        write: false,
        edit: false,
        delete: false,
        all: false
    });

    const { createEditUser , isLoading } = useCreateEditUser();
    const { register, formState, getValues, setValue, handleSubmit, reset, watch } = useForm();
    const { errors } = formState;
    const { isDarkMode } = useDarkMode();
    const Language = useSettingsStore(state => state.Language);

    // Watch all permission fields to update header checkboxes
    const watchedPermissions = watch();

    const modules = [
        { key: "Booking", label: Language==="en"?"Booking":"الحجوزات" },
        { key: "Cabins", label: Language==="en"?"Cabins":"الغرف" },
        { key: "Storage", label: Language==="en"?"Storage":"المخزن" },
        { key: "Statistics", label: Language==="en"?"Statistics":"الإحصائيات" },
        { key: "Guests", label: Language==="en"?"Guests":"الضيوف" },
        { key: "Reports", label: Language==="en"?"Reports":"التقارير" },
        { key: "Users", label: Language==="en"?"Users":"المستخدمين" }
    ];

    // Function to handle "select all" for each action type
    const handleSelectAll = (action: string, checked: boolean) => {
        modules.forEach((module) => {
            if (action === "All") {
                ["Read", "Write", "Edit", "Delete"].forEach((act) => {
                    setValue(`permissions.${module.key}${act}`, checked);
                });
            } else {
                setValue(`permissions.${module.key}${action}`, checked);
            }
        });

        // Update select all states
        setSelectAllStates(prev => ({
            ...prev,
            [action.toLowerCase()]: checked,
            ...(action === "All" && {
                read: checked,
                write: checked,
                edit: checked,
                delete: checked
            })
        }));
    };

    // Function to check if all permissions of a type are selected
    const isAllSelected = (action: string) => {
        if (!watchedPermissions?.permissions) return false;
        
        return modules.every(module => 
            watchedPermissions.permissions[`${module.key}${action}`] === true
        );
    };

    // Function to check if all permissions are selected
    const isAllPermissionsSelected = () => {
        if (!watchedPermissions?.permissions) return false;
        
        return modules.every(module => 
            ["Read", "Write", "Edit", "Delete"].every(action =>
                watchedPermissions.permissions[`${module.key}${action}`] === true
            )
        );
    };

    function onSubmit({ email,password,full_name,phone,job,permissions}: any) {
        createEditUser({email,password,full_name,phone,job,permissions},
            {
                // onSettled: () => reset(),
                // onSuccess: () => onCloseModal?.(),
            }
        );
    }

    return (
        
        <Form onSubmit={handleSubmit(onSubmit)} type="modal" iswidestring={"true"}>
            <Heading as="h1" style={{marginBottom:"2rem", textAlign:"center"}}>{Language==="en"?"Create a new user":"انشاء مستخدم جديد"}</Heading>
            <FormRow
                label={Language==="en"?"Full name":"الاسم الكامل"}
                error={errors?.full_name?.message?.toString()}
            >
                <Input
                    type="text"
                    id="full_name"
                    disabled={isLoading}
                    {...register("full_name", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label={Language==="en"?"Email address":"البريد الالكتروني"}
                error={errors?.email?.message?.toString()}
            >
                <Input
                    type="email"
                    id="email"
                    autoComplete="new-email"
                    disabled={isLoading}
                    {...register("email", {
                        required: "This field is required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Please provide a valid email address",
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label={Language==="en"?"Password (min 8 characters)":"كلمة المرور (8 حروف على الاقل)"}
                error={errors?.password?.message?.toString()}
            >
                <Input
                    type="password"
                    id="password"
                    disabled={isLoading}
                    {...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 8,
                            message: "Password needs a minimum of 8 characters",
                        },
                    })}
                />
            </FormRow>
            <FormRow
                label={Language==="en"?"Repeat password":"تأكيد كلمة المرور"}
                error={errors?.passwordConfirm?.message?.toString()}
            >
                <Input
                    type="password"
                    id="passwordConfirm"
                    disabled={isLoading}
                    {...register("passwordConfirm", {
                        required: "This field is required",
                        validate: (value) =>
                            value === getValues().password ||
                            "Passwords need to match",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language==="en"?"phone number":"رقم الموبايل"}
                error={errors?.phone?.message?.toString()}
            >
                <Input
                    type="tel"
                    id="phone"
                    disabled={isLoading}
                    {...register("phone", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language==="en"?"job":"الوظيفة"}
                error={errors?.job?.message?.toString()}
            >
                <Input
                    type="text"
                    id="job"
                    disabled={isLoading}
                    {...register("job", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            {/* <FormRow label={Language==="en"?"Hotel":"الفندق"}
                            error={errors?.hotel?.message?.toString()}
                            >
                {!isLoadingHotels&&<Select
                    isDarkMode={isDarkMode} 
                    placeholder=" اختار الفندق"
                    data={hotels} 
                    defaultValue={hotels?.[0]||null}
                    onChange={(e:any)=>setHotel(e.value)}
                    />}
            </FormRow> */}
            {/* <FormRow label={Language==="en"?"User Roles":"الصلاحيات"}> 
                <>
                <Select 
                isDarkMode={isDarkMode}
                placeholder="اختار "
                isMulti
                data={roles} menuClose={false}
                onChange={(e:any) => setUserRole(e)}
                />
                <div className="tooltip" style={{ textAlign: "center" }}>?
                {Language==="en"?
            <span className="tooltiptext">*Reception : allows Reservation and payments<br/>*Co_Owner : allows Everything , but have no power over the owner<br/>*Storage : allows Adding,Editing items to the Storage<br/>*SEO : allows Access to SEO Statistics<br/>*Statistics : allows Access to financial Reports about the hotel</span>
                :<span className="tooltiptext">*Reception : السماح بالقيام بالحجوزات و تاكيد الدفع <br/>*Co_Owner : يسمح بكل شيء، ولكن ليس له سلطة على المالك <br/>*Storage : يسمح بتعديل واضافة العناصر للمخزن <br/>*SEO : يسمح بالوصول للتحليلات SEO <br/>*Statistics : يسمح بالوصول لتقارير المالية</span>}
            </div>
                </>
             </FormRow> */}
        <FormRow label={Language==="en"?"Detailed Permissions":"الصلاحيات التفصيلية"}>
            <div style={{ 
                overflowY: "auto", 
                border: "1px solid #ccc",
            }}>
                <table style={{ 
                    width: "100%", 
                    fontSize: "12px", 
                    borderCollapse: "collapse" 
                }}>
                    <thead>
                        <tr style={{ 
                            backgroundColor: isDarkMode ? "#374151" : "#f8f9fa", 
                            borderBottom: "1px solid #dee2e6" 
                        }}>
                            <th style={{ 
                                padding: "8px 4px", 
                                textAlign: "left", 
                                fontWeight: "600" 
                            }}>
                                {Language==="en"?"Module":"الوحدة"}
                            </th>
                            <th style={{ 
                                padding: "8px 4px", 
                                textAlign: "center", 
                                fontWeight: "600",
                                width: "60px" 
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <span>{Language==="en"?"Read":"قراءة"}</span>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected("Read")}
                                        onChange={(e) => handleSelectAll("Read", e.target.checked)}
                                        style={{ width: "14px", height: "14px", cursor: "pointer" }}
                                        title={Language==="en"?"Select All Read":"تحديد الكل للقراءة"}
                                    />
                                </div>
                            </th>
                            <th style={{ 
                                padding: "8px 4px", 
                                textAlign: "center", 
                                fontWeight: "600",
                                width: "60px" 
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <span>{Language==="en"?"Write":"كتابة"}</span>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected("Write")}
                                        onChange={(e) => handleSelectAll("Write", e.target.checked)}
                                        style={{ width: "14px", height: "14px", cursor: "pointer" }}
                                        title={Language==="en"?"Select All Write":"تحديد الكل للكتابة"}
                                    />
                                </div>
                            </th>
                            <th style={{ 
                                padding: "8px 4px", 
                                textAlign: "center", 
                                fontWeight: "600",
                                width: "60px" 
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <span>{Language==="en"?"Edit":"تعديل"}</span>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected("Edit")}
                                        onChange={(e) => handleSelectAll("Edit", e.target.checked)}
                                        style={{ width: "14px", height: "14px", cursor: "pointer" }}
                                        title={Language==="en"?"Select All Edit":"تحديد الكل للتعديل"}
                                    />
                                </div>
                            </th>
                            <th style={{ 
                                padding: "8px 4px", 
                                textAlign: "center", 
                                fontWeight: "600",
                                width: "60px" 
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <span>{Language==="en"?"Delete":"حذف"}</span>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected("Delete")}
                                        onChange={(e) => handleSelectAll("Delete", e.target.checked)}
                                        style={{ width: "14px", height: "14px", cursor: "pointer" }}
                                        title={Language==="en"?"Select All Delete":"تحديد الكل للحذف"}
                                    />
                                </div>
                            </th>
                            <th style={{ 
                                padding: "8px 4px", 
                                textAlign: "center", 
                                fontWeight: "600",
                                width: "60px" 
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <span>{Language==="en"?"All":"الكل"}</span>
                                    <input
                                        type="checkbox"
                                        checked={isAllPermissionsSelected()}
                                        onChange={(e) => handleSelectAll("All", e.target.checked)}
                                        style={{ width: "14px", height: "14px", cursor: "pointer" }}
                                        title={Language==="en"?"Select All":"تحديد الكل"}
                                    />
                                </div>
                            </th>
                        </tr>
                        <tr style={{ 
                            backgroundColor: isDarkMode ? "#4b5563" : "#e9ecef", 
                            borderBottom: "2px solid #dee2e6" 
                        }}>
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map((module, index) => (
                            <tr key={module.key} style={{ 
                                borderBottom: "1px solid #eee",
                                backgroundColor: index % 2 === 0 ? (isDarkMode ? "#1f2937" : "#ffffff") : (isDarkMode ? "#374151" : "#f8f9fa")
                            }}>
                                <td style={{ 
                                    padding: "8px 4px", 
                                    fontWeight: "500" 
                                }}>
                                    {module.label}
                                </td>
                                {["Read", "Write", "Edit", "Delete"].map((action) => (
                                    <td key={action} style={{ 
                                        padding: "8px 4px", 
                                        textAlign: "center" 
                                    }}>
                                        <input
                                            type="checkbox"
                                            id={`${module.key}${action}`}
                                            disabled={isLoading}
                                            {...register(`permissions.${module.key}${action}`)}
                                            style={{ 
                                                width: "16px", 
                                                height: "16px",
                                                cursor: isLoading ? "not-allowed" : "pointer"
                                            }}
                                        />
                                    </td>
                                ))}
                                <td key={module.key+"All"} style={{
                                    padding: "8px 4px",
                                    textAlign: "center"
                                }}>
                                    <input
                                        type="checkbox"
                                        id={`${module.key}All`}
                                        disabled={isLoading}
                                        checked={["Read", "Write", "Edit", "Delete"].every(action => 
                                            watchedPermissions?.permissions?.[`${module.key}${action}`] === true
                                        )}
                                        onChange={(e) => {
                                            ["Read", "Write", "Edit", "Delete"].forEach((action) => {
                                                setValue(`permissions.${module.key}${action}`, e.target.checked);
                                            });
                                        }}
                                        style={{ 
                                            width: "16px", 
                                            height: "16px",
                                            cursor: isLoading ? "not-allowed" : "pointer"
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </FormRow>
            <FormRow>
                <>
                    <Button
                        variant="secondary"
                        type="reset"
                        disabled={isLoading}
                        onClick={() => {reset(),onCloseModal?.()}}
                    >
                        {Language==="en"?"Cancel":"الغاء"}
                    </Button>
                    <Button disabled={isLoading}>{Language==="en"?"Create new user":"انشاء مستخدم جديد"}</Button>
                </>
            </FormRow>
        </Form>
    );
}

export default SignupForm;