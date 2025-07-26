"use client";
import React from "react";

import { Input, Form, FormRow, Checkbox, FileInput } from "@/components/form";
import { Button, Select, Spinner } from "@/components/ui";
import {
    familyRolesOptions,
    countryOptions,
    genderOptions,
} from "@/components/data";

import { useForm } from "react-hook-form";
import { Guest } from "@/utils/types";
import { useCreateGuest, useEditGuest } from "@/hooks/guests";
import { useDarkMode } from "@/hooks";

import cities from "@/components/cities.json";

type City = {
    label: string;
    value: string;
    color: string;
    isFixed: boolean;
        // Add more properties as needed
};
const citiesArray: City[] = cities as City[];

// import "react-datepicker/dist/react-datepicker.css";
import {
    useBookingStore,
    useSettingsStore,
} from "@/components/WizardForm/useStore";
import { Heading } from "@/components/typography";

function space(n: number) {
    return Array(n).fill("\u00A0").join("");
}
const today = new Date();
const minDate = new Date(
    today.getFullYear() - 16,
    today.getMonth(),
    today.getDate()
);
const minDateString = minDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
export default function ({
    GuestToEdit,
    onCloseModal,
}: {
    GuestToEdit?: any;
    onCloseModal?: () => void;
}) {
    const { isCreating, createGuest } = useCreateGuest();
    const { isEditing, editGuest } = useEditGuest();
    const isWorking = isCreating || isEditing;
    const Language = useSettingsStore(state => state.Language);
    const { id: editId, Child, ...editValues } = (GuestToEdit as Guest) || {};
    const isEditSession = Boolean(editId);
    const { isLoading, setisLoading } = useBookingStore();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        getValues,
        setError,
    } = useForm<Guest>({
        defaultValues: isEditSession ? editValues : {},
    });
    function onSubmit(data: Guest) {
        console.log(data);
        if (isEditSession)
            editGuest(
                { GuestData: { ...data }, GuestId: editId },
                {
                    onSuccess: () => {
                        reset();
                        onCloseModal?.();
                    },
                }
            );
        else
            createGuest(
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
    const { isDarkMode } = useDarkMode();
    return (
        <Form
            style={{ marginBottom: "10rem" }}
            onSubmit={handleSubmit(onSubmit, onError)}
            type={onCloseModal ? "modal" : "regular"}
        >
            <Heading style={{ textAlign: "center", marginBottom: "2rem" }}>
                {Language === "en"
                    ? "Create/Edit Guest"
                    : "اضافة او تعديل الزائر"}
            </Heading>
            <FormRow
                label={Language === "en" ? "Guest Name" : "الاسم"}
                error={errors?.fullName?.message as string}
            >
                <Input
                    type="string"
                    id="fullName"
                    disabled={isWorking}
                    {...register("fullName", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language === "en" ? "Birth Date" : "تاريخ الميلاد"}
                error={errors?.BirthDate?.message as string}
            >
                <Input
                    type="date"
                    id="BirthDate"
                    calender={isDarkMode===true ? "white" : undefined}
                    // defaultValue={minDateString}
                    // max={minDateString}
                    disabled={isWorking}
                    {...register("BirthDate", {
                        // required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language === "en" ? "Phone Number" : "رقم الهاتف"}
                error={errors?.phoneNumber?.message as string}
            >
                <Input
                    type="number"
                    id="phoneNumber"
                    disabled={isWorking}
                    {...register("phoneNumber", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={
                    Language === "en"
                        ? "email (optional)"
                        : "البريد الالكتروني (اختياري) "
                }
                error={errors?.email?.message as string}
            >
                <Input
                    type="string"
                    disabled={isWorking}
                    {...register("email", {
                        // required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
                label={Language === "en" ? "Gender" : "نوع"}
                error={errors?.Gender?.message as string}
            >
                <Select
                    isDarkMode={isDarkMode}
                    data={genderOptions}
                    disabled={isWorking}
                    defaultValue={genderOptions.find(
                        (c) => c.value == getValues()?.Gender?.toLowerCase()
                    )}
                    {...register("Gender", {
                        // required: "This field is required",
                    })}
                    onChange={(e: any) => {
                        setValue("Gender", e.label);
                    }}
                ></Select>
            </FormRow>
            <FormRow
                label={Language === "en" ? "Country" : "الدولة"}
                error={errors?.nationality?.message as string}
            >
                <Select
                    isDarkMode={isDarkMode}
                    data={countryOptions}
                    placeholder={Language === "en" ? "Country" : "الدولة"}
                    defaultValue={countryOptions.find(
                        (c) => c.label == getValues()?.nationality
                    )}
                    disabled={isWorking}
                    {...register("nationality", {
                        // required: "This field is required",
                    })}
                    onChange={(e: any) => {
                        const country = countryOptions.find(
                            (c) => c.value == e.value
                        );
                        setValue("nationality", country?.label ?? "");
                        setValue(
                            "countryFlag",
                            `https://flagcdn.com/${country?.value?.toLowerCase()}.svg`
                        );
                        if (
                            countryOptions.find((c) => c.value == e.value)
                                ?.label !== "Egypt"
                        ) {
                            setValue("city", "");
                        }
                        setisLoading(true);
                        setTimeout(() => {
                            setisLoading(false);
                        }, 0);
                    }}
                ></Select>
            </FormRow>
            {getValues()?.nationality === "Egypt" && (
                <FormRow
                    label={Language === "en" ? "city" : "المدينة"}
                    error={errors?.city?.message as string}
                >
                    {
                        <Select
                            isDarkMode={isDarkMode}
                            data={citiesArray}
                            placeholder={Language === "en" ? "City" : "المدينة"}
                            disabled={
                                getValues()?.nationality != "Egypt" || isWorking
                            }
                            defaultValue={citiesArray.find(
                                (c) =>
                                    c.value ==
                                        (
                                            getValues()?.city || ""
                                        ).toLowerCase() || ""
                            )}
                            onChange={(e: any) => {
                                setValue(
                                    "city",
                                    citiesArray.find((c) => c.value === e.value)
                                        ?.value ?? ""
                                );
                            }}
                            menuClose={true}
                        ></Select>
                    }
                </FormRow>
            )}
            <FormRow
                label={
                    Language === "en"
                        ? "Passport ID / National ID"
                        : "رقم الجواز / الرقم القومي"
                }
                error={errors?.nationalID?.message as string}
            >
                <Input
                    type="number"
                    placeholder={
                        Language === "en"
                            ? "Passport ID / National ID"
                            : "رقم الجواز / الرقم القومي"
                    }
                    disabled={getValues()?.nationality == "" || isWorking}
                    onInput={(e: any) => {
                        if (
                            e.target.value.length != 14 &&
                            getValues()?.nationality == "Egypt"
                        ) {
                            setError("nationalID", {
                                message: "Please enter a valid ID (14 digits)",
                            });
                        } else if (
                            (e.target.value.length < 5 ||
                                e.target.value.length > 9) &&
                            getValues()?.nationality != "Egypt"
                        ) {
                            setError("nationalID", {
                                message: "Please enter a valid ID (5-9 digits)",
                            });
                        } else {
                            setError("nationalID", { message: "" });
                        }
                    }}
                    {...register("nationalID", {
                        validate: (val: any) =>
                            isEditSession
                                ? true
                                :
                            val?.length > 0
                                ? getValues()?.nationality !== "Egypt"
                                    ? val?.length >= 5 && val?.length <= 9
                                        ? true
                                        : "Please enter a valid ID (5-9 digits)"
                                    : "This field is required"
                                : getValues()?.nationality === "Egypt"
                                ? val?.length !== 14
                                ? "Please enter a valid ID (14 digits)"
                                : true
                                : "This field is required",
                    })}
                ></Input>
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
                        {isEditSession ? "Edit Guest" : "Add Guest"}
                    </Button>
                </>
            </FormRow>
        </Form>
    );
}
// const CreateGuestForm = ({
//     GuestToEdit,
//     onCloseModal,
// }: {
//     GuestToEdit?: any;
//     onCloseModal?: () => void;
// }) => {
//     const { isCreating, createGuest } = useCreateGuest();
//     const { isEditing, editGuest } = useEditGuest();
//     const isWorking = isCreating || isEditing;

//     const { id: editId, ...editValues } = (GuestToEdit as Guest) || {};
//     console.log(editValues);
//     const isEditSession = Boolean(editId);
//     type FamilyMember = {
//         name: string;
//         birthDate: Date;
//         role: string;
//         gender: string;
//         nationalID:string;
//         passportImage:string;
//     };

//     const [familyMembers, setFamilyMembers] = useState([
//         { name: "", birthDate: "", role: "", gender: "" ,nationalID:"",passportImage:""},
//     ]);
//     const [selectedNationality, setSelectedNationality] = useState(null);
//     const [filteredCities, setFilteredCities] = useState<City[]>([]);
//     let updatedMembers = [...familyMembers];

//     // Assuming you have a function to update filteredCities based on selectedNationality
//     const updateFilteredCities = (selectedNationality: any) => {
//         // Logic to filter cities based on selected nationality
//         // For example:
//         setValue("nationality", selectedNationality);
//         setFilteredCities(citiesArray
//             // filteredCitiesArray.filter(
//             //     (city) => city.country === selectedNationality
//             // )
//         );
//     };
//     const getValidationCountries = () => {
//         return {
//             required: "This field is required ..",
//         }
//     }
//     const getValidationRules = () => {
//         if (selectedNationality === "EG") {
//             return {
//                 required: "This field is required",
//                 minLength: {
//                     value: 14,
//                     message: "Egyptian ID number must be 14 digits",
//                 },
//                 maxLength: {
//                     value: 14,
//                     message: "Egyptian ID number must be 14 digits",
//                 },
//             };
//         } else {
//             return {
//                 required: "This field is required",
//                 minLength: {
//                     value: 5,
//                     message:
//                         "International ID number must be between 5 and 9 digits",
//                 },
//                 maxLength: {
//                     value: 9,
//                     message:
//                         "International ID number must be between 5 and 9 digits",
//                 },
//             }
//         }
//     };
//     function addFamilyMember() {
//         setFamilyMembers([
//             ...familyMembers,
//             { name: "", birthDate: "", role: "", gender: "",nationalID:"",passportImage:"" },
//         ]);
//     }

//     function handleFamilyMemberChange(
//         index: number,
//         field: keyof FamilyMember,
//         value: string
//     ) {
//         updatedMembers = [...familyMembers];
//         console.log(familyMembers, index, field, value);
//         console.log(updatedMembers[index]);
//         updatedMembers[index][field] = value;
//         setFamilyMembers(updatedMembers);
//     }

//     function removeFamilyMember(index: number) {
//         updatedMembers = [...familyMembers];
//         updatedMembers.splice(index, 1);
//         setFamilyMembers(updatedMembers);
//     }

//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState,
//         setValue,
//         getValues,
//     } = useForm<Guest>({
//         defaultValues: isEditSession ? editValues : {},
//     });
//     const { errors } = formState;

//     const handleSelectChange = (selectedOption: any) => {
//         //= citiesArray.filter(city => city.country === 'selectedCountry');
//     };
//     //console.log(mappedCabins)
//     function onSubmit(data: Guest) {
//         console.log(data,updatedMembers);
//         if (isEditSession)
//             editGuest(
//                 { GuestData: { ...data }, GuestId: editId },
//                 {
//                     onSuccess: () => {
//                         reset();
//                         onCloseModal?.();
//                     },
//                 }
//             );
//         else
//             createGuest(
//                 { ...data },
//                 {
//                     onSuccess: () => {
//                         reset();
//                         onCloseModal?.();
//                     },
//                 }
//             );
//     }

//     function onError(errors: any) {
//         errors;
//     }
//     const {isDarkMode}=useDarkMode();
//     return (
//         <Form
//             onSubmit={handleSubmit(onSubmit, onError)}
//             type={onCloseModal ? "modal" : "regular"}
//         >
//             <FormRow
//                 label="Guest Name"
//                 error={errors?.fullName?.message as string}
//             >
//                 <Input
//                     type="string"
//                     id="fullName"
//                     disabled={isWorking}
//                     {...register("fullName", {
//                         required: "This field is required",
//                     })}
//                 />
//             </FormRow>
//             {/* <FormRow
//                 label="Birth Date"
//                 error={errors?.birthDate?.message as string}
//             >
//                 <Input
//                     type="date"
//                     id="birthDate"
//                     defaultValue={minDateString}
//                     max={minDateString}
//                     disabled={isWorking}
//                     {...register("birthDate", {
//                         required: "This field is required",
//                     })}
//                 />
//             </FormRow> */}
//             <FormRow
//                 label="Nationality"
//                 error={errors?.nationality?.message as string}
//             >
//                 <Select
//                      isDarkMode={isDarkMode}
//                     data={countryOptions}
//                     // id="nationality"
//                     message="country doesnt exist"
//                     menuClose={true}
//                     isMulti={false}
//                     disabled={isWorking}
//                     {...register("nationality")}
//                     onChange={(e: any) => {
//                         setSelectedNationality(e.value);
//                         updateFilteredCities(e.value);
//                     }}
//                 ></Select>
//             </FormRow>
//             {selectedNationality && (
//                 <FormRow
//                     label="City"
//                     error={errors?.city?.message as string}
//                 >
//                     <Select
//                         isDarkMode={isDarkMode}
//                         data={filteredCities}
//                         //  id="nationality"
//                         message="city doesnt exist"
//                         menuClose={true}
//                         isMulti={false}
//                         disabled={isWorking}
//                         {...register("city")}
//                         onChange={(e: any) => {
//                             setValue("city",e.label);
//                         }}
//                     ></Select>
//                 </FormRow>
//             )}

//             <FormRow
//                 label="(Passport / National ID) Number"
//                 error={errors?.nationalID?.message as string}
//             >
//                 <Input
//                     type="number"
//                     id="nationalID"
//                     disabled={isWorking}
//                     {...register("nationalID", getValidationRules())}
//                 />
//             </FormRow>
//             <FormRow label="Passport/ID card">
//                 <FileInput
//                     id="Idscan"
//                     accept="image/*"
//                     //onChange={(e) => setAvatar(e.target.files[0])}
//                     //   disabled={isUpdating}
//                 />
//             </FormRow>
//             <p
//                 style={{
//                     fontWeight: "bold",
//                     marginTop: "20px",
//                     marginBottom: "20px",
//                 }}
//             >{`${space(0)} Guest Name ${space(34)}(Passport / National ID) Number ${space(
//             25
//             )} Gender ${space(10)} ${space(
//                 0
//             )} Passport/ID card`}</p>
//             <div id="members">
//                 {familyMembers.map((member, index) => (
//                     <FormRow label="" key={index}>
//                         <>
//                             <Input
//                                 type="text"
//                                 placeholder="Guest Name"
//                                 onChange={(e) =>
//                                     handleFamilyMemberChange(
//                                         index,
//                                         "name",
//                                         e.target.value
//                                     )
//                                 }
//                             />
//                             <Input
//                                 type="number"
//                                 //  id={`nationalID-${index}`}
//                                 placeholder="(Passport / National ID) Number"
//                                 disabled={isWorking}
//                                 // {...register(
//                                 //     "nationalID",
//                                 //     getValidationRules()
//                                 // )}
//                                 onChange={(e: any) =>
//                                     handleFamilyMemberChange(
//                                         index,
//                                         "nationalID",
//                                         e.target.value
//                                     )
//                                 }
//                             />
//                             <Input
//                                 type="date"
//                                 // id={`birthDate-${index}`}
//                                 defaultValue={minDateString}
//                                 disabled={isWorking}
//                                 // {...register("birthDate", {
//                                 //     required: "This field is required",
//                                 // })}
//                                 onChange={(e: any) =>
//                                     handleFamilyMemberChange(
//                                         index,
//                                         "birthDate",
//                                         e.target.value
//                                     )
//                                 }
//                             />
//                               <Select
//                                 isDarkMode={isDarkMode}
//                                 data={genderOptions}
//                                 message="gender doesnt exist"
//                                 onChange={(e: any) =>
//                                     handleFamilyMemberChange(
//                                         index,
//                                         "gender",
//                                         e.value
//                                     )
//                                 }
//                                 menuClose={true}
//                                 isMulti={false}
//                             ></Select>
//                             {/* <Select
//                                 data={familyRolesOptions}
//                                 onChange={(e: any) =>
//                                     handleFamilyMemberChange(
//                                         index,
//                                         "role",
//                                         e.value
//                                     )
//                                 }
//                                 menuClose={true}
//                                 isMulti={false}
//                             ></Select> */}

//                             <FileInput
//                                 // id="avatar"
//                                 accept="image/*"
//                                 onChange={(e: any) =>
//                                     handleFamilyMemberChange(
//                                         index,
//                                         "passportImage",
//                                         e.target.files[0]
//                                     )
//                                 }
//                                 // disabled={isUpdating}
//                             />
//                             <Button
//                                 onClick={() => removeFamilyMember(index)}
//                             >
//                                 Remove
//                             </Button>
//                         </>
//                     </FormRow>
//                 ))}
//             </div>
//             <Button onClick={addFamilyMember}>Add Family Member</Button>

//             <FormRow>
//                 <>
//                     <Button
//                         variant="secondary"
//                         type="reset"
//                         onClick={() => onCloseModal?.()}
//                     >
//                         Cancel
//                     </Button>
//                     <Button type="submit" disabled={isWorking}>
//                         {isEditSession ? "Edit Booking" : "Add Guest"}
//                     </Button>
//                 </>
//             </FormRow>
//         </Form>
//     );
// };

// export default CreateGuestForm;
