// "use client";
// import * as React from "react";
// import { FC, ReactNode, useEffect, useState } from "react";
// import { useWizard } from "react-use-wizard";
// import "flatpickr/dist/themes/material_green.css";
// import Flatpickr from "react-flatpickr";
// import { IoPersonAddOutline, IoAddCircleOutline } from "react-icons/io5";
// import { FaTrash } from "react-icons/fa";
// import { HiOutlineCalendarDays } from "react-icons/hi2";
// import { Input, FormRow, Checkbox, FileInput, Textarea } from "@/components/form";
// import { Button, Select, Table, Spinner } from "../ui";
// import SpinnerMini from "../ui/SpinnerMini";
// import { SummaryRow } from "@/components/WizardForm";
// import { getGuestsByQuery } from "@/services/apiGuests";
// import { useBookingStore } from "./useStore";
// import { useGetGuestsByGuestP, useGetGuestsByQuery } from "@/hooks/guests";
// import { useGetBookingCalender } from "@/hooks/bookings";
// import { useCabins } from "@/hooks/cabins";
// import { useGetAvailableDiscount } from "@/hooks/discounts";
// import { genderOptions, countryOptions } from "../data";
// import { useGetBreakfast, useGetPickedAmenities, useSettings } from "@/hooks/settings";
// import { useDarkMode } from "@/hooks";
// import { useSettingsStore } from "@/components/WizardForm/useStore";
// import { formatCurrency, formateDate as formatTime } from "@/utils/helpers";
// import { TestCalender } from "@/features/bookings/index";

// // =================================================================================
// // 1. TYPE DEFINITIONS - Centralized types for our data structures
// // =================================================================================

// interface SelectOption {
//     value: string;
//     label: string;
//     [key: string]: any; // Allow other properties
// }

// interface FamilyMember {
//     value?: string;
//     name?: SelectOption | string;
//     fullname?: string;
//     birthDate?: string;
//     role?: 'Adult' | 'Kid';
//     gender?: string;
//     nationalID?: string;
//     nationality?: SelectOption | string;
//     city?: string;
//     passportImage?: File | string;
//     phoneNumber?: string;
//     countryFlag?: string;
// }

// interface DateRange {
//     start: { year: number; month: number; day: number; };
//     end: { year: number; month: number; day: number; };
//     price: number;
//     totalDays: number;
// }

// interface RoomSummary {
//     [key: string]: any; // Allow properties from booking data
//     totalDays: number;
//     totalPrice: number;
//     name: string;
//     ranges: DateRange[];
// }

// interface Errors {
//     [key: string]: string;
// }

// // =================================================================================
// // 2. UTILITY FUNCTIONS - Now with TypeScript
// // =================================================================================

// const formatDate = (date: Date | string | null, format: 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'yyyy/mm/dd' = 'yyyy-mm-dd'): string => {
//     if (!date) return '';
//     const d = new Date(date);
//     if (isNaN(d.getTime())) return '';
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");

//     if (format === 'dd/mm/yyyy') return `${day}/${month}/${year}`;
//     if (format === 'yyyy/mm/dd') return `${year}/${month}/${day}`;
//     return `${year}-${month}-${day}`;
// };

// const getDatesBetween = (startDate: Date, endDate: Date): string[] => {
//     const dates: string[] = [];
//     const currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//         dates.push(formatDate(new Date(currentDate)));
//         currentDate.setDate(currentDate.getDate() + 1);
//     }
//     return dates;
// };

// const generateRoomSummary = (selectedRanges: any, bookingsData: any, Language: string): Record<string, RoomSummary> => {
//     if (!selectedRanges || !bookingsData) 
//     const rooms: Record<string, RoomSummary> = {};
//     Object.keys(selectedRanges).forEach((key) => {
//         const [typeId, roomId] = key.split('-');
//         const roomData = bookingsData[typeId]?.[roomId];
//         if (!roomData) return;

//         const result = selectedRanges[key].reduce((acc: { price: number; totalDays: number }, range: any) => {
//             const startDate = new Date(range.start.year, range.start.month, range.start.day);
//             const endDate = new Date(range.end.year, range.end.month, range.end.day);
//             return {
//                 price: acc.price + range.price,
//                 totalDays: acc.totalDays + getDatesBetween(startDate, endDate).length
//             };
//         }, { price: 0, totalDays: 0 });

//         rooms[key] = {
//             ...roomData,
//             totalDays: result.totalDays,
//             totalPrice: result.price,
//             name: Language === "en" ? `${roomData.type_name_en} - ${roomData.cabin_name}` : `${roomData.type_name_ar} - ${roomData.cabin_name}`,
//             ranges: selectedRanges[key].map((range: any) => ({
//                 ...range,
//                 totalDays: getDatesBetween(new Date(range.start.year, range.start.month, range.start.day), new Date(range.end.year, range.end.month, range.end.day)).length
//             }))
//         };
//     });
//     return rooms;
// };


// // =================================================================================
// // 3. REUSABLE UI COMPONENTS - Now with typed props
// // =================================================================================

// const StepHeader: FC<{ children: ReactNode }> = ({ children }) => <h1 style={{ textAlign: "center", marginBottom: '2rem' }}>{children}</h1>;

// interface WizardNavigationProps {
//     onPrevious?: () => void;
//     onNext?: () => void;
//     prevLabel: string;
//     nextLabel: string;
//     language: string;
//     disabled?: boolean;
// }
// const WizardNavigation: FC<WizardNavigationProps> = ({ onPrevious, onNext, prevLabel, nextLabel, language, disabled }) => (
//     <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '2rem', borderTop: '1px solid var(--color-grey-200)' }}>
//         {onPrevious && <Button type="button" variant="secondary" onClick={onPrevious} style={{ float: language !== "en" ? "right" : "left" }}>{prevLabel}</Button>}
//         {onNext && <Button type="button" onClick={onNext} disabled={disabled} style={{ float: language !== "en" ? "left" : "right" }}>{nextLabel}</Button>}
//     </div>
// );

// interface GuestFormProps {
//     guest: FamilyMember;
//     index: number;
//     guestType: 'adult' | 'kid';
//     onChange: (field: keyof FamilyMember, value: any, isNew?: boolean) => void;
//     onRemove: () => void;
//     errors?: Errors;
//     guestList?: SelectOption[];
//     Language: string;
//     isDarkMode: boolean;
//     settings: any;
// }
// const GuestForm: FC<GuestFormProps> = ({ guest, index, guestType, onChange, onRemove, errors = {}, guestList = [], Language, isDarkMode, settings }) => {
//     const today = new Date();
//     const minDateAdult = formatDate(new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()));
//     const maxDate = formatDate(today);
//     const isBookingHolder = guestType === 'adult' && index === 0;

//     return (
//         <div style={{ border: "1px solid var(--color-grey-200)", borderRadius: "8px", padding: "1.5rem", marginTop: "1.5rem", background: 'var(--color-grey-0)' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//                 <h3 style={{ margin: 0, color: 'var(--color-brand-600)' }}>{isBookingHolder ? (Language === "en" ? 'Booking Holder' : 'صاحب الحجز') : `${Language === "en" ? (guestType === 'adult' ? 'Adult' : 'Kid') : (guestType === 'adult' ? 'بالغ' : 'طفل')} #${index + 1}`}</h3>
//                 {!isBookingHolder && <Button variant="danger" onClick={onRemove} type="reset" style={{ height: 'fit-content', padding: '0.5rem' }}><FaTrash /></Button>}
//             </div>
//             <FormRow label={Language === "en" ? "Full Name" : "الاسم الكامل"} error={errors.fullname}>
//                 {isBookingHolder ? <Input type="text" readOnly defaultValue={guest.fullname} /> : <Select isDarkMode={isDarkMode} selectCreate placeholder={Language === "en" ? "Search or enter new name" : "ابحث أو أدخل اسم جديد"} data={guestList} defaultValue={guestList.find(g => g.label === guest.fullname) || (guest.fullname && { value: guest.fullname, label: guest.fullname as string })} menuClose onChange={(e: SelectOption) => onChange("fullname", e, e?.__isNew__)} />}
//             </FormRow>
//             <FormRow label={Language === "en" ? "Country" : "الدولة"} error={errors.country}><Select isDarkMode={isDarkMode} data={countryOptions} placeholder={Language === "en" ? "Select Country" : "اختر الدولة"} value={countryOptions.find(c => c.label === (guest.nationality as SelectOption)?.label || c.label === guest.nationality)} onChange={(e: SelectOption) => onChange("nationality", e)} /></FormRow>
//             {guestType === 'adult' && <FormRow label={Language === "en" ? "Passport / National ID" : "رقم الجواز / الرقم القومي"} error={errors.nationalID}><Input type="text" placeholder={Language === "en" ? "Enter ID number" : "أدخل رقم الهوية"} defaultValue={guest.nationalID} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("nationalID", e.target.value)} /></FormRow>}
//             <FormRow label={Language === "en" ? "Birthdate" : "تاريخ الميلاد"} error={errors.birthDate}><Input type="date" max={guestType === 'adult' ? minDateAdult : maxDate} defaultValue={guest.birthDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("birthDate", e.target.value)} /></FormRow>
//             <FormRow label={Language === "en" ? "Gender" : "النوع"} error={errors.gender}><Select isDarkMode={isDarkMode} placeholder={Language === "en" ? "Select Gender" : "اختر النوع"} data={genderOptions.filter(opt => opt.lang === Language)} value={genderOptions.find(g => g.label.toLowerCase() === guest?.gender?.toLowerCase())} onChange={(e: SelectOption) => onChange("gender", e.value)} /></FormRow>
//             {guestType === 'adult' && settings?.data.settings.id_scan && <FormRow label={Language === "en" ? "Passport / ID Scan" : "صورة الجواز / الهوية"} error={errors.card}><FileInput accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("passportImage", e.target.files?.[0])} /></FormRow>}
//         </div>
//     );
// };

// interface EmbeddedCalendarProps {
//     onDateSelect: (dates: { startDate: Date | null; endDate: Date | null; }) => void;
//     selectedDates: { startDate: Date | null; endDate: Date | null; };
//     language: string;
// }
// const EmbeddedCalendar: FC<EmbeddedCalendarProps> = ({ onDateSelect, selectedDates, language }) => {
//     const flatpickrOptions: any = { mode: 'range', inline: true, dateFormat: 'Y-m-d', minDate: 'today', defaultDate: selectedDates.startDate && selectedDates.endDate ? [selectedDates.startDate, selectedDates.endDate] : null, onChange: (dates: Date[]) => dates.length === 2 ? onDateSelect({ startDate: dates[0], endDate: dates[1] }) : onDateSelect({ startDate: null, endDate: null }), showMonths: 1 };
//     return <div style={{ backgroundColor: 'var(--color-grey-0)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-grey-200)' }}><h4 style={{ margin: '0 0 10px 0', color: 'var(--color-grey-700)' }}>{language === 'en' ? 'Select Check-in & Check-out Dates' : 'اختر تاريخ الوصول والمغادرة'}</h4><div style={{ display: 'flex', justifyContent: 'center' }}><Flatpickr options={flatpickrOptions} /></div></div>;
// };

// // =================================================================================
// // 4. REFACTORED WIZARD STEPS
// // =================================================================================

// const Step0: FC = () => {
//     const { nextStep } = useWizard();
//     const { numAdults, setNumAdults, numChildren, setNumChildren, startDate, setStartDate, endDate, setEndDate, reset: resetStore } = useBookingStore();
//     const { settings } = useSettings();
//     const Language = useSettingsStore(state => state.Language);
//     const [errors, setErrors] = useState<Errors>({});

//     const validateFields = (): boolean => {
//         const newErrors: Errors = {};
//         if (numAdults < 1) newErrors.numAdults = Language === 'en' ? "At least 1 adult is required" : "مطلوب بالغ واحد على الأقل";
//         if (!endDate || !startDate) newErrors.Date = Language === "en" ? "Date selection is required" : "يرجى تحديد تاريخ البدء و الانتهاء للحجز";
//         if (numAdults + numChildren > (settings?.data?.settings?.max_guests_per_booking ?? 99)) newErrors.numAdults = Language === "en" ? `Maximum guests allowed is ${settings?.data?.settings?.max_guests_per_booking}` : `الحد الاقصى لعدد الضيوف هو ${settings?.data?.settings?.max_guests_per_booking}`;
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     return (
//         <div>
//             <style>{`
//     .flatpickr-calendar {
//      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
//      border: none !important;
//      border-radius: 12px !important;
//      margin: auto;
//     }
//     .flatpickr-day.selected,
//     .flatpickr-day.startRange,
//     .flatpickr-day.endRange {
//      background: #2f80ed !important;
//      color: white !important;
//      border-radius: 8px !important;
//     }
//     .flatpickr-day.today {
//      border: 1px solid #2f80ed !important;
//     }
//     .flatpickr-input {
//       display: none;
//      }
// `}</style>
//             <StepHeader>{Language === "en" ? "Guest Information" : "معلومات الزائر"}</StepHeader>
//             <FormRow label={Language === "en" ? "Select The Staying Dates" : "حدد تاريخ الوصول والانتهاء"} error={errors.Date}><></></FormRow>
//             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
//                 <div style={{ flex: '2', minWidth: '300px' }}><EmbeddedCalendar onDateSelect={({ startDate, endDate }) => { setStartDate(startDate); setEndDate(endDate); }} selectedDates={{ startDate, endDate }} language={Language} /></div>
//                 <div style={{ flex: '1', minWidth: '250px', padding: '15px', backgroundColor: 'var(--color-blue-100)', borderRadius: '8px' }}>
//                     <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-grey-800)' }}>{Language === "en" ? "Chosen Dates" : "التواريخ المختارة"}</div>
//                     <hr style={{ border: 'none', borderTop: '1px solid var(--color-blue-200)', margin: '8px 0' }} />
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                         <div><div style={{ fontSize: '12px', color: 'var(--color-grey-600)' }}>{Language === "en" ? "Check-in" : "الوصول"}</div><div style={{ fontWeight: 'bold', color: 'var(--color-brand-700)' }}>{startDate ? formatDate(startDate, 'dd/mm/yyyy') : '--'}</div></div>
//                         <div style={{ fontSize: '18px', color: 'var(--color-grey-500)' }}>→</div>
//                         <div><div style={{ fontSize: '12px', color: 'var(--color-grey-600)' }}>{Language === "en" ? "Check-out" : "المغادرة"}</div><div style={{ fontWeight: 'bold', color: 'var(--color-brand-700)' }}>{endDate ? formatDate(endDate, 'dd/mm/yyyy') : '--'}</div></div>
//                     </div>
//                 </div>
//             </div>
//             <FormRow label={Language === "en" ? "Number of Adults" : "عدد البالغين"} error={errors.numAdults}><Input type="number" id="numAdults" value={numAdults} min={1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumAdults(Number(e.target.value))} /></FormRow>
//             {settings?.data?.settings?.max_kids_per_booking > 0 && <FormRow label={Language === "en" ? "Number of Kids" : "عدد الاطفال"}><Input type="number" id="numKids" value={numChildren} min={0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumChildren(Number(e.target.value))} /></FormRow>}
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}><Button onClick={resetStore} type="reset" variant="danger" style={{ float: Language === "en" ? "left" : "right" }}>{Language === "en" ? "Reset" : "إعادة تعيين"}</Button><Button onClick={() => validateFields() && nextStep()} style={{ float: Language === "en" ? "right" : "left" }}>{Language === "en" ? "Next ⏭" : " التالي ⏮️"}</Button></div>
//         </div>
//     );
// };

// export interface Options {
//     readonly value: string;
//     readonly label: string;
//     readonly arlabel?: string;
//     readonly color: string;
//     readonly isFixed?: boolean;
//     readonly isDisabled?: boolean;
// }

// const mappedGuests: Options[] = [];

// const Step1: FC = () => {
//     const { previousStep, nextStep } = useWizard();
//     const { familyMembers, setFamilyMembers, setGuestListAdults, setGuestListKids, selectedRanges } = useBookingStore();
//     const Language = useSettingsStore(state => state.Language);
//     const { isDarkMode } = useDarkMode();
//     const mainGuestId = familyMembers[0]?.value;
//     const { guests: guestsAdult } = useGetGuestsByGuestP(mainGuestId, true);
//     const { guests: guestsKids } = useGetGuestsByGuestP(mainGuestId, false);
//     const {guests} = useGetGuestsByQuery();
//     const [errors, setErrors] = useState<Errors>({});

//     const validateFields = (): boolean => {
//         const newErrors: Errors = {};
//         if (!selectedRanges || Object.keys(selectedRanges).length === 0) newErrors.selectedRanges = Language === "en" ? "At least one room must be selected" : "يجب اختيار غرفة واحدة على الأقل";
//         if (!familyMembers[0]?.name) newErrors.guestName = Language === "en" ? "Booking holder is required" : "يجب تحديد صاحب الحجز";
//         setGuestListAdults(guestsAdult ?? []);
//         setGuestListKids(guestsKids ?? []);
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };
    
//     return (
//         <>
//             <StepHeader>{Language === "en" ? "Step 1 | Select Rooms & Guest" : "الخطوة الاولى | اختر الغرف والضيف"}</StepHeader>
//             {errors.selectedRanges && <FormRow error={errors.selectedRanges}><></></FormRow>}
//             <TestCalender />
//             <FormRow label={Language === "en" ? "Booking Holder Name/ID" : "اسم/هوية صاحب الحجز"} error={errors.guestName}>
//                 <Select
//                     isDarkMode={isDarkMode}
//                     selectCreate
//                     func={async (input: string) => (await getGuestsByQuery(input))?.data.guests.map((g: any) => ({ value: g.id, label: g.full_name, ...g })) ?? []}
//                     defaultValue={familyMembers[0]?.name}
//                     isMulti={true}
//                     placeholder={Language === "en" ? "Search by name/ID or enter a new name" : "ابحث بالاسم أو الهوية أو أدخل اسما جديدا"}
//                     menuClose={true}
//                     onChange={(e: any) => {
//                         const mainGuest = e[0] || {};
//                         setFamilyMembers([{ ...familyMembers[0], fullname: mainGuest.full_name || mainGuest.label, name: mainGuest, value: mainGuest.value, nationalID: mainGuest.national_id, birthDate: mainGuest.birth_date, nationality: mainGuest.nationality, gender: mainGuest.gender }]);
//                     }}
//                     data={guests?.data?.guests.map((guest: any) => ({ value: guest.id, label: guest.full_name, ...guest })) ?? []}
//                 />
//             </FormRow>
//             <WizardNavigation onPrevious={previousStep} onNext={() => validateFields() && nextStep()} prevLabel={Language === "en" ? "Previous ⏮️" : " السابق ⏭"} nextLabel={Language === "en" ? "Next ⏭" : " التالي ⏮️"} language={Language} />
//         </>
//     );
// };

// const Step2: FC = () => {
//     const { previousStep, nextStep } = useWizard();
//     const { familyMembers, setFamilyMembers, familyKids, setFamilyKids, guestlistAdults, guestlistKids } = useBookingStore();
//     const { settings } = useSettings();
//     const Language = useSettingsStore(state => state.Language);
//     const { isDarkMode } = useDarkMode();
//     const [errorsA, setErrorsA] = useState<Errors[]>([]);
//     const [errorsK, setErrorsK] = useState<Errors[]>([]);

//     const handleGuestChange = (type: 'adult' | 'kid', index: number, field: keyof FamilyMember, value: any, isNew: boolean = false) => {
//         const list = type === 'adult' ? familyMembers : familyKids;
//         const setList = type === 'adult' ? setFamilyMembers : setFamilyKids;
//         const sourceList = type === 'adult' ? guestlistAdults : guestlistKids;
//         const updatedGuests = [...list];
//         let currentGuest = { ...updatedGuests[index], [field]: value };
//         if (field === 'nationality') currentGuest.countryFlag = (value as SelectOption).value.toLowerCase();
//         if (field === 'fullname') {
//             currentGuest.fullname = (value as SelectOption).label || (value as string);
//             if (isNew) currentGuest.value = "0";
//             else if ((value as SelectOption)?.value) {
//                 const selectedGuest = sourceList.find(g => g.value === (value as SelectOption).value);
//                 if (selectedGuest) currentGuest = { ...currentGuest, value: selectedGuest.value, birthDate: selectedGuest.birth_date, gender: selectedGuest.gender, nationalID: selectedGuest.national_id, nationality: selectedGuest.nationality };
//             }
//         }
//         updatedGuests[index] = currentGuest;
//         setList(updatedGuests);
//     };

//     const validateGuest = (guest: FamilyMember, guestType: 'adult' | 'kid'): Errors => {
//         const errors: Errors = {};
//         const minAgeDate = new Date(); minAgeDate.setFullYear(minAgeDate.getFullYear() - 16);
//         if (!guest.fullname) errors.fullname = Language === "en" ? "Name is required" : "الاسم مطلوب";
//         if (!guest.nationality) errors.country = Language === "en" ? "Country is required" : "الدولة مطلوبة";
//         if (!guest.birthDate) errors.birthDate = Language === "en" ? "Birthdate is required" : "تاريخ الميلاد مطلوب";
//         if (!guest.gender) errors.gender = Language === "en" ? "Gender is required" : "النوع مطلوب";
//         if (guestType === 'adult') {
//             if (!guest.nationalID) errors.nationalID = Language === "en" ? "National ID is required" : "الرقم القومي مطلوب";
//             if (guest.birthDate && new Date(guest.birthDate) > minAgeDate) errors.birthDate = Language === "en" ? `Must be 16 or older` : `يجب ان يكون 16 سنة او اكثر`;
//         }
//         return errors;
//     };

//     const validateAll = (): boolean => {
//         const adultErrors = familyMembers.map(member => validateGuest(member, 'adult'));
//         const kidErrors = familyKids.map(kid => validateGuest(kid, 'kid'));
//         const hasErrors = adultErrors.some(e => Object.keys(e).length > 0) || kidErrors.some(e => Object.keys(e).length > 0);
//         setErrorsA(adultErrors);
//         setErrorsK(kidErrors);
//         return !hasErrors;
//     };

//     const addGuest = (type: 'adult' | 'kid') => {
//         const setList = type === 'adult' ? setFamilyMembers : setFamilyKids;
//         const list = type === 'adult' ? familyMembers : familyKids;
//         setList([...list, {
//           role: type === 'adult' ? 'Adult' : 'Kid',
//           value: undefined,
//           name: "",
//           fullname: "",
//           birthDate: "",
//           gender: "",
//           nationality: "",
//           countryFlag: undefined,
//           nationalID: "",
//           passportImage: "",
//           phoneNumber: undefined
//         }]);
//     };
//     const removeGuest = (type: 'adult' | 'kid', index: number) => {
//         const setList = type === 'adult' ? setFamilyMembers : setFamilyKids;
//         const list = type === 'adult' ? familyMembers : familyKids;
//         setList(list.filter((_, i) => i !== index));
//     };

//     return (
//         <>
//             <StepHeader>{Language === "en" ? "Step 2 | Guest Details" : "الخطوة الثانية | بيانات الضيوف"}</StepHeader>
//             <p style={{ textAlign: "center", marginTop: 0, color: 'var(--color-grey-500)' }}>{Language === 'en' ? 'Main guest:' : 'صاحب الحجز:'} <strong>{familyMembers[0]?.fullname || '...'}</strong></p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '20px 0', borderTop: '1px solid var(--color-grey-200)', borderBottom: '1px solid var(--color-grey-200)', padding: '1rem 0' }}>
//                 <Button type="reset" onClick={() => addGuest('adult')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IoPersonAddOutline /> {Language === "en" ? "Add Adult" : "إضافة بالغ"}</Button>
//                 <Button type="reset" onClick={() => addGuest('kid')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IoAddCircleOutline /> {Language === "en" ? "Add Kid" : "إضافة طفل"}</Button>
//             </div>
//             {familyMembers.map((member, index) => <GuestForm key={`adult-${index}`} guest={member} index={index} guestType="adult" onChange={(field, value, isNew) => handleGuestChange('adult', index, field, value, isNew)} onRemove={() => removeGuest('adult', index)} errors={errorsA[index]} guestList={guestlistAdults} Language={Language} isDarkMode={isDarkMode} settings={settings} />)}
//             {familyKids.map((member, index) => <GuestForm key={`kid-${index}`} guest={member} index={index} guestType="kid" onChange={(field, value, isNew) => handleGuestChange('kid', index, field, value, isNew)} onRemove={() => removeGuest('kid', index)} errors={errorsK[index]} guestList={guestlistKids} Language={Language} isDarkMode={isDarkMode} settings={settings} />)}
//             <WizardNavigation onPrevious={previousStep} onNext={() => validateAll() && nextStep()} prevLabel={Language === "en" ? "Previous" : "السابق"} nextLabel={Language === "en" ? "Next" : "التالي"} language={Language} />
//         </>
//     );
// };

// const Step3: FC = () => {
//     const { previousStep, nextStep } = useWizard();
//     const { extras, setExtras, selectedRanges, numAdults, numChildren, totalPrice, setTotalPrice } = useBookingStore();
//     const { bookings } = useGetBookingCalender();
//     const Language = useSettingsStore(state => state.Language);
//     const { isDarkMode } = useDarkMode();
//     const { settings } = useSettings();
//     const { discounts } = useGetAvailableDiscount();
//     const { isgettingPicked, GetPickedAmenities } = useGetPickedAmenities(1, discounts);
//     const [localOrderSummary, setLocalOrderSummary] = useState<Record<string, RoomSummary>>({});

//     useEffect(() => {
//         setLocalOrderSummary(generateRoomSummary(selectedRanges, bookings?.data?.bookings, Language));
//     }, [selectedRanges, bookings, Language]);
    
//     useEffect(() => {
//         const breakfastPricePerPerson = settings?.data?.settings?.breakfast_price || 0;
//         const totalBreakfastCost = Object.values(extras).reduce((roomAcc, roomData: any) => {
//             if (!roomData.rangeBreakfast) return roomAcc;
//             return roomAcc + Object.entries(roomData.rangeBreakfast).reduce((rangeAcc, [rangeKey, isSelected]) => {
//                 if (!isSelected) return rangeAcc;
//                 const [startStr, endStr] = rangeKey.split("-");
//                 const totalDays = getDatesBetween(new Date(startStr), new Date(endStr)).length;
//                 return rangeAcc + (breakfastPricePerPerson * (numAdults + numChildren) * totalDays);
//             }, 0);
//         }, 0);
//         setTotalPrice({ ...totalPrice, amenities: totalBreakfastCost });
//     }, [extras, settings, numAdults, numChildren, setTotalPrice, totalPrice.rooms]);
    
//     const handleExtraChange = (roomKey: string, field: string, value: any) => setExtras({ ...extras, [roomKey]: { ...extras[roomKey], [field]: value }});
//     const handleRangeExtraChange = (roomKey: string, field: string, rangeKey: string, value: any) => handleExtraChange(roomKey, field, { ...extras[roomKey]?.[field], [rangeKey]: value });
//     const getBreakfastPricePerDay = () => (settings?.data?.settings?.breakfast_price || 0) * (numAdults + numChildren);
    
//     return (
//         <>
//             <StepHeader>{Language === "en" ? "Step 3 | Extras" : "الخطوة الثالثة | الإضافات"}</StepHeader>
//             {Object.keys(localOrderSummary).map(roomKey => {
//                 const room = localOrderSummary[roomKey];
//                 const roomExtras = extras[roomKey] || {};
//                 return (
//                     <div key={roomKey} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid var(--color-grey-200)", borderRadius: "8px" }}>
//                         <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{room?.name}</h2>
//                         <FormRow label={Language === "en" ? "Room Observation" : "ملاحظة الغرفة"}><Textarea placeholder="..." defaultValue={roomExtras.globalObservation} onBlur={(e) => handleExtraChange(roomKey, 'globalObservation', e.target.value)} /></FormRow>
//                         <FormRow label={Language === "en" ? "Amenities" : "خدمات إضافية"}>{isgettingPicked ? <SpinnerMini /> : <Select isDarkMode={isDarkMode} data={GetPickedAmenities} defaultValue={roomExtras.amenities} isMulti menuClose onChange={(selected) => handleExtraChange(roomKey, 'amenities', selected)} />}</FormRow>
//                         {room?.ranges?.map((range, rangeIndex) => {
//                             const rangeKeyStr = `${formatDate(new Date(range.start.year, range.start.month, range.start.day))}-${formatDate(new Date(range.end.year, range.end.month, range.end.day))}`;
//                             return (
//                                 <div key={rangeIndex} style={{ marginLeft: "1rem", padding: "0.5rem", borderTop: '1px solid var(--color-grey-100)', marginTop: '1rem' }}>
//                                     <h4 style={{ marginBottom: "0.5rem", textAlign: "center" }}>{`${formatDate(new Date(range.start.year, range.start.month, range.start.day), 'dd/mm/yyyy')} → ${formatDate(new Date(range.end.year, range.end.month, range.end.day), 'dd/mm/yyyy')}`}</h4>
//                                     <FormRow label={`${Language === "en" ? "Breakfast" : "إفطار"} (${getBreakfastPricePerDay()} EGP/day)`}><Checkbox id={`${roomKey}-${rangeIndex}-breakfast`} checked={roomExtras.rangeBreakfast?.[rangeKeyStr] || false} onChange={(e) => handleRangeExtraChange(roomKey, 'rangeBreakfast', rangeKeyStr, e.target.checked)} /></FormRow>
//                                     <FormRow label={Language === "en" ? "Range-specific observation" : "ملاحظة خاصة بالفترة"}><Textarea placeholder="..." defaultValue={roomExtras.rangeObservations?.[rangeKeyStr]} onBlur={(e) => handleRangeExtraChange(roomKey, 'rangeObservations', rangeKeyStr, e.target.value)} /></FormRow>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 );
//             })}
//             <WizardNavigation onPrevious={previousStep} onNext={nextStep} prevLabel={Language === "en" ? "Previous ⏮️" : " السابق ⏭"} nextLabel={Language === "en" ? "Next ⏭" : " التالي ⏮️"} language={Language} />
//         </>
//     );
// };

// const Step4: FC = () => {
//     const { previousStep } = useWizard();
//     const { selectedRanges, extras, setOrderSummary } = useBookingStore();
//     const Language = useSettingsStore(state => state.Language);
//     const { settings } = useSettings();
//     const { bookings } = useGetBookingCalender();
//     const [hierarchicalSummary, setHierarchicalSummary] = useState<any[]>([]);

//     useEffect(() => {
//         const summary = generateRoomSummary(selectedRanges, bookings?.data?.bookings, Language);
//         const vat = settings?.data?.settings?.vat ?? 0;
//         const breakfastPrice = settings?.data?.settings?.breakfast_price || 0;
//         const receipt: any[] = [];

//         Object.keys(summary).forEach(roomKey => {
//             const room = summary[roomKey];
//             receipt.push({ item: room.name, totalPrice: room.totalPrice * (1 + vat / 100) });
            
//             room.ranges.forEach(range => {
//                 const rangeStart = new Date(range.start.year, range.start.month, range.start.day);
//                 const rangeEnd = new Date(range.end.year, range.end.month, range.end.day);
//                 const rangeKeyStr = `${formatDate(rangeStart)}-${formatDate(rangeEnd)}`;
                
//                 receipt.push({ item: `${formatDate(rangeStart, 'dd/mm/yyyy')} → ${formatDate(rangeEnd, 'dd/mm/yyyy')}`, totalPrice: range.price, totalDays: range.totalDays, marginLeft: "15px" });
                
//                 if (extras[roomKey]?.rangeBreakfast?.[rangeKeyStr]) {
//                     receipt.push({ item: `🍳 ${Language === "en" ? "Breakfast" : "إفطار"}`, totalPrice: breakfastPrice * range.totalDays, marginLeft: "30px" });
//                 }
//             });
//         });

//         setHierarchicalSummary(receipt);
//         setOrderSummary(receipt);
//     }, [selectedRanges, bookings, extras, settings, Language, setOrderSummary]);
    
//     return (
//         <>
//             <StepHeader>{Language === "en" ? "Your Receipt 🧾 Summary" : "🧾 ملخص الطلب"}</StepHeader>
//             <Table columns="2fr 1fr 1fr" minwidth="0px">
//                 <Table.Header><div>Item</div><div>Days</div><div>Total Cost</div></Table.Header>
//                 {hierarchicalSummary.map((item, index) => <SummaryRow key={`${item.item}-${index}`} Row={item} />)}
//             </Table>
//             <WizardNavigation onPrevious={previousStep} prevLabel={Language === "en" ? "Previous ⏮️" : " السابق ⏭"} language={Language} />
//         </>
//     );
// };

// // =================================================================================
// // 5. EXPORTS
// // =================================================================================

// export { Step0, Step1, Step2, Step3, Step4 };