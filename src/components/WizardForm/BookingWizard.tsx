"use client";
import * as React from "react";
// import { useForm, Controller } from "react-hook-form";
import { Wizard, useWizard } from "react-use-wizard";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
// Add these imports at the top of your file
import { IoPersonAddOutline, IoAddCircleOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import {
  Input,
  Form,
  FormRow,
  Checkbox,
  FileInput,
  Textarea,
} from "@/components/form";
import { Button, Select, Spinner, Table } from "../ui";
import SpinnerMini from "../ui/SpinnerMini";
import { SummaryRow } from "@/components/WizardForm";
import { useEffect, useRef, useState } from "react";
import { getGuestsByQuery } from "@/services/apiGuests";
import { useBookingStore } from "./useStore";
import { useGetGuestsByGuestP } from "@/hooks/guests";
import { useGetAvailableCabins , useGetBookingCalender } from "@/hooks/bookings";
import {
  useGetCabinsCategories,
  useGetAvailableCabinsByCategory,
  useCabins,
} from "@/hooks/cabins";
import { useGetAvailableDiscount } from "@/hooks/discounts";
import { genderOptions, countryOptions } from "../data";
import {
  useGetBreakfast,
  useGetPickedAmenities,
  useSettings,
} from "@/hooks/settings";
import { useDarkMode } from "@/hooks";
import { useSettingsStore } from "./useStore";
import cities from "@/components/cities.json";
import { formatCurrency, formateDate } from "@/utils/helpers";
import { Test, TestCalender } from "@/features/bookings/index";
type City = {
  label: string;
  value: string;
  color: string;
  isFixed: boolean;
  // Add more properties as needed
};
const citiesArray: City[] = cities as City[];

export interface Options {
  readonly value: string;
  readonly label: string;
  readonly arlabel?: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}
const mappedGuests: Options[] = [];

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getMaximumLength = (startDate: Date, disabledDates: string[]) => {
  const { settings } = useSettings();
  if (!startDate) {
    return 1;
  }
  //const formattedStartDate = formatDate(startDate);
  const nextDisabledDate = disabledDates?.find(
    (date) => new Date(date) > startDate
  );
  if (nextDisabledDate) {
    return Math.ceil(
      (new Date(nextDisabledDate).getTime() - startDate.getTime()) /
        (1000 * 3600 * 24)
    );
  }
  return nextDisabledDate ?? settings?.data?.settings?.max_booking_length ?? 60; // Default to 60 if no disabled date is found
};
const getDatesBetween = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  // Increment the date by one day at a time until reaching the end date
  while (currentDate <= endDate) {
    dates.push(formatDate(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
type FamilyMember = {
  value: string;
  name: string;
  fullname: string;
  birthDate: Date;
  role: string;
  gender: string;
  nationalID: string;
  nationality: string;
  city?: string;
  passportImage: string;
};

async function getGuestsBy(input: string) {
  const guests = await getGuestsByQuery(input);
  const mappedGuests =
    guests?.data.guests.map((guest: any) => ({
      value: guest.id,
      label: guest.full_name,
      ...guest,
    })) ?? [];
  return mappedGuests;
}

const EmbeddedCalendar = ({ onDateSelect, selectedDates, language = 'en' } : any) => {
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [existingBookings] = useState([]); // Could be populated from props

  const handleDateChange = (selectedDates: string | any[], dateStr: any, instance: any) => {
    if (selectedDates.length === 2) {
      const [startDate, endDate] = selectedDates;
      onDateSelect({
        startDate: startDate,
        endDate: endDate
      });
    } else if (selectedDates.length === 0) {
      onDateSelect({
        startDate: null,
        endDate: null
      });
    }
  };

  const handleDayCreate = (dObj: any, dStr: any, fp: { parseDate: (arg0: any, arg1: string) => any; }, dayElem: { dateObj: any; classList: { add: (arg0: string) => void; }; }) => {
    const date = dayElem.dateObj;
    
    const markRange = (range: { from: any; to: any; }, cssClass: string) => {
      const from = fp.parseDate(range.from, 'Y-m-d');
      const to = fp.parseDate(range.to, 'Y-m-d');
      
      if (date >= from && date <= to) {
        dayElem.classList.add('selected');
        if (date.getTime() === from.getTime()) {
          dayElem.classList.add('startRange');
        }
        if (date.getTime() === to.getTime()) {
          dayElem.classList.add('endRange');
        }
        dayElem.classList.add(cssClass);
      }
    };

    // Mark existing bookings
    existingBookings.forEach(range => markRange(range, 'legend-booked'));
    
    // Mark selected ranges
    selectedRanges.forEach(range => markRange(range, 'legend-pending'));
  };
  const getTodayLocal = () => {
    const d = new Date();
    const hoursidffer = d.getTimezoneOffset();
    const localOffset = hoursidffer / 60 * -1;
    d.setHours(localOffset, 0, 0, 0); // kills time component
    return d;
  };
  
  const flatpickrOptions:any = {
    mode: 'range',
    inline: true,
    dateFormat: 'Y-m-d',
    minDate: getTodayLocal(), // 👈 force local midnight
    defaultDate: selectedDates.startDate && selectedDates.endDate
      ? [new Date(selectedDates.startDate), new Date(selectedDates.endDate)]
      : null,
    onChange: handleDateChange,
    onDayCreate: handleDayCreate,
    showMonths: 1,
    enableTime: false,
    clickOpens: true,
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '2px solid #e9ecef',
      marginBottom: '20px'
    }}>
      {/* Custom styles for the calendar */}
      <style jsx>{`
        .flatpickr-calendar { 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; 
          border: none !important; 
          border-radius: 12px !important; 
          margin: auto; 
        }
        .flatpickr-day.selected, 
        .flatpickr-day.startRange, 
        .flatpickr-day.endRange { 
          background: #2f80ed !important; 
          color: white !important; 
          border-radius: 8px !important; 
        }
        .flatpickr-day.today { 
          border: 1px solid #2f80ed !important; 
        }
        .flatpickr-day.legend-booked {
          background: #eb5757 !important;
          color: white !important;
        }
        .flatpickr-day.legend-pending {
          background: #f39c12 !important;
          color: white !important;
        }
        .flatpickr-day:hover {
          background: #e3f2fd !important;
        }
      `}</style>
      
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
          {language === 'en' ? 'Select Check-in & Check-out Dates' : 'اختر تاريخ الوصول والمغادرة'}
        </h4>
        
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#eb5757', 
              borderRadius: '50%', 
              marginRight: '5px' 
            }}></span>
            <div style={{color: 'var(--color-grey-50)'}}>
              {language === 'en' ? 'Booked' : 'محجوز'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#2f80ed', 
              borderRadius: '50%', 
              marginRight: '5px' 
            }}></span>
            <div style={{color: 'var(--color-grey-50)'}}>
              {language === 'en' ? 'Selected' : 'مختار'}
            </div>
          </div>
        </div>
      </div>
      
      {/* React Flatpickr Component */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Flatpickr
          options={flatpickrOptions}
          value={selectedDates.startDate && selectedDates.endDate ? 
            [selectedDates.startDate, selectedDates.endDate] : []}
        />
      </div>
    </div>
  );
};

const Step0 = () => {
  // Mock state and functions
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { handleStep, previousStep, nextStep } = useWizard();
  const {
    numAdults,
    setNumAdults,
    numChildren,
    setNumChildren,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    familyMembers,
    setFamilyMembers,
    familyKids,
    setFamilyKids,
  } = useBookingStore();
  const { settings } = useSettings();
  const Language = useSettingsStore(state => state.Language);
  
  // Mock language and settings
  const validateFields = () => {
    const newErrors = {} as { [key: string]: string };
    if (numAdults < 1) {
      newErrors.numAdults = Language === 'en' ? "At least 1 adult is required" : "مطلوب بالغ واحد على الأقل";
    }
    if (!endDate || !startDate) {
      newErrors.Date = Language === "en" ? "Date selection is required" : "يرجى تحديد تاريخ البدء و الانتهاء للحجز";
    }
    if (parseInt(numAdults.toString()) + parseInt(numChildren.toString()) > (settings?.data?.settings?.max_guests_per_booking ?? 0)) {
      newErrors.numAdults = Language === "en" 
        ? "Maximum number of guests(Adults+Kids) allowed is " + settings?.data?.settings?.max_guests_per_booking
        : "الحد الاقصى لعدد الضيوف(البالغين+الاطفال) المسموح هو " + settings?.data?.settings?.max_guests_per_booking;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateSelect = (dates: { startDate: React.SetStateAction<null>; endDate: React.SetStateAction<null>; }) => {
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
  };

  const formatDate = (date: string | number | Date) => {
    if (!date) return '';
  
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
  
    return `${day}/${month}/${year}`;
  };


  return (
    <div>
      <style>{`
        .flatpickr-calendar { 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; 
          border: none !important; 
          border-radius: 12px !important; 
          margin: auto; 
        }
        .flatpickr-day.selected, 
        .flatpickr-day.startRange, 
        .flatpickr-day.endRange { 
          background: flatpickr-calendar#2f80ed !important; 
          color: white !important; 
          border-radius: 8px !important; 
        }
        .flatpickr-day.today { 
          border: 1px solid #2f80ed !important; 
        }
        .flatpickr-input {
            display: none;
          }
      `}</style>
      
      <h1 style={{ textAlign: "center", marginBottom: '30px' }}>
        {Language === "en" ? "Guest Information" : "معلومات الزائر"}
      </h1>
      
      {/* Embedded Calendar */}
      <FormRow
        label={Language === "en" ? "Select The Staying Dates" : "حدد تاريخ الوصول والانتهاء"}
        error={errors.Date}
      >
        <></>
      </FormRow>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start', // keeps items top-aligned
            gap: '20px', // adds spacing between calendar and date display
            flexWrap: 'wrap', // responsive fallback
          }}>
            {/* Calendar Component */}
            <div style={{ flex: '2', maxWidth: '100%' }}>
              <EmbeddedCalendar
                onDateSelect={handleDateSelect}
                selectedDates={{ startDate, endDate }}
                language={Language}
              />
            </div>
              {/* Selected Dates Display */}
              <div style={{
                flex: '1',
                minWidth: '250px',
                padding: '15px',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px'
              }}>
                <div style={{ marginBottom: '10px' }}>
                      <div style={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                        marginBottom: '4px',
                        color: 'var(--color-grey-50)'
                      }}>
                        {Language === "en" ? "Choosen Date" : "تاريخ المحدد"}
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px solid #ccc',minWidth: '250px' }} />
                    </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                      {Language === "en" ? "Check-in" : "تاريخ الوصول"}
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {startDate ? formatDate(startDate) : '--'}
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', color: '#666' }}>→</div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                      {Language === "en" ? "Check-out" : "تاريخ المغادرة"}
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {endDate ? formatDate(endDate) : '--'}
                    </div>
                  </div>
                </div>
              </div>
            
          </div>

      <FormRow
        label={Language === "en" ? "Number of Adults" : "عدد البالغين"}
        error={errors.numAdults}
      >
        <Input
          type="number"
          id="numAdults"
          value={numAdults}
          min={1}
          onChange={(e) => setNumAdults(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </FormRow>

      {settings?.data?.settings?.max_kids_per_booking && settings?.data?.settings?.max_kids_per_booking > 0 && (
        <FormRow label={Language === "en" ? "Number of Kids" : "عدد الاطفال"}>
          <Input
            type="number"
            id="numKids"
            value={numChildren}
            min={0}
            onChange={(e) =>  setNumChildren(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </FormRow>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <Button
          onClick={() => console.log('Previous step')}
          type="reset"
          style={{ 
            backgroundColor: '#6c757d',
            float: Language === "en" ? "left" : "right" 
          }}
        >
          {Language === "en" ? "Reset" : "محو البيانات"}
        </Button>
        
        <Button
          onClick={() => validateFields() ? nextStep() : null}
          type="reset"
          style={{ 
            float: Language === "en" ? "right" : "left" 
          }}
        >
          {Language === "en" ? "Next ⏭" : " التالي ⏮️"}
        </Button>
      </div>
    </div>
  );
};


const Step1 = () => {
  const { handleStep, previousStep, nextStep } = useWizard();
  const {
    RoomCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    choosenCabin,
    setChoosenCabin,
    familyMembers,
    setFamilyMembers,
    familyKids,
    setFamilyKids,
    totalPrice,
    setTotalPrice,
    setGuestListAdults,
    setGuestListKids,
    setisLoading,
    isLoading,
    orderSummary,
    setOrderSummary,
    selectedRanges,
  } = useBookingStore();
  const { settings } = useSettings();
  const Language = useSettingsStore(state => state.Language);
  const { isDarkMode } = useDarkMode();

  const mainGuestId = familyMembers[0]?.value;
  const {
    isLoading: guestListLoadingAdults,
    error: guestListErrorAdults,
    guests: guestsAdult,
  } = useGetGuestsByGuestP(mainGuestId, true);
  const {
    isLoading: guestListLoadingKids,
    error: guestListErrorKids,
    guests: guestsKids,
  } = useGetGuestsByGuestP(mainGuestId, false);  

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedRanges || Object.keys(selectedRanges).every((key) => selectedRanges[key].length == 0)) {
      newErrors.selectedRanges =
        Language === "en"
          ? "Rooms selection is required"
          : " يرجى تحديد الغرف/ة";
    }
    if (!familyMembers[0]?.name) {
      newErrors.guestName =
        Language === "en" ? "Guest name is required" : "يرجى تحديد صاحب الحجز";
    }
    setGuestListAdults(guestsAdult ?? []);
    setGuestListKids(guestsKids ?? []);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Attach an optional handler
  handleStep(() => {
    console.log("Step 1 validated:", validateFields()); // Call the validateFields function here
  });
  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        {Language === "en" ? "Step 1" : " الخطوة الاولى"}
      </h1>
      <FormRow label="" error={errors.selectedRanges}><></></FormRow>
      <TestCalender />
      <FormRow
        label={
          Language === "en"
            ? "Guest name / ID Booking Holder"
            : "اسم الضيف / صاحب الحجز"
        }
        error={errors.guestName}
      >
        <Select
          isDarkMode={isDarkMode}
          selectCreate
          func={getGuestsBy}
          defaultValue={familyMembers[0]?.name}
          placeholder={
            Language === "en"
              ? "Seach by name / ID Or Enter New Name"
              : "ابحث بالاسم او رقم البطاقة"
          }
          message="Guest Not Found"
          isMulti={true}
          menuClose={true}
          onChange={(e: any) => {
              if (e.length > 1) throw new Error("Please select only one guest as the booking holder."); 
              const tempmembers = [...familyMembers];
              const mainGuest = e[0] || {};
              tempmembers[0] = {
                  ...tempmembers[0],
                  fullname: mainGuest.full_name || mainGuest.label,
                  name: mainGuest,
                  nationalID: mainGuest.national_id,
                  birthDate: mainGuest.birth_date,
                  nationality: mainGuest.nationality,
                  countryFlag: countryOptions.find(c => c.label === mainGuest.nationality)?.value,
                  city: mainGuest.city,
                  gender: mainGuest.gender,
                  value: mainGuest.__isNew__ ? "0" : mainGuest.value || mainGuest.id,
                  passportImage: mainGuest.passport_image || "",
                  phoneNumber: mainGuest.phone_number || "",
              };
              setFamilyMembers(tempmembers);
          }}
          data={mappedGuests}
        ></Select>
      </FormRow>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <Button
          onClick={() => previousStep()}
          type="reset"
          style={{ 
            float: Language === "en" ? "left" : "right" 
          }}
        >
          {Language === "en" ? "Previous ⏮️" : " السابق ⏭"}
        </Button>
        
        <Button
          onClick={() => validateFields() ? nextStep() : null}
          type="reset"
          style={{ 
            float: Language === "en" ? "right" : "left" 
          }}
        >
          {Language === "en" ? "Next ⏭" : " التالي ⏮️"}
        </Button>
      </div>
    </>
  );
};

const Step2 = () => {
  const { handleStep, previousStep, nextStep } = useWizard();
  const [errorsA, setErrorsA] = useState<Array<{ [key: string]: string }>>([]);
  const [errorsK, setErrorsK] = useState<Array<{ [key: string]: string }>>([]);
  
  const {
    familyMembers,
    setFamilyMembers,
    familyKids,
    setFamilyKids,
    numChildren,
    setNumChildren,
    numAdults,
    setNumAdults,
    isLoading,
    setisLoading,
    guestlistAdults,
    guestlistKids,
  } = useBookingStore();

  useEffect(() => {
    setErrorsA(Array.from({ length: numAdults }, () => ({})));
  }, [numAdults]);

  useEffect(() => {
    setErrorsK(Array.from({ length: numChildren }, () => ({})));
  }, [numChildren]);
  
  const { settings } = useSettings();
  const Language = useSettingsStore(state => state.Language);
  const { isDarkMode } = useDarkMode();
  
  // Handler to add a new adult guest
  const addAdult = () => {
    const newAdult = {
      value: "", name: "", fullname: "", birthDate: "", role: "Adult",
      gender: "", nationalID: "", nationality: "", city: "",
      passportImage: "", phoneNumber: "", countryFlag: ""
    };
    setFamilyMembers([...familyMembers, newAdult]);
  };

  // Handler to remove an adult guest (cannot remove the booking holder)
  const removeAdult = (indexToRemove: number) => {
    if (indexToRemove === 0) return; 
    setFamilyMembers(familyMembers.filter((_, index) => index !== indexToRemove));
  };

  // Handler to add a new kid guest
  const addKid = () => {
    const newKid = {
        value: "", name: "", fullname: "", birthDate: "", role: "Kid",
        gender: "", nationalID: "", nationality: "", city: "",
        passportImage: "", phoneNumber: "", countryFlag: ""
    };
    setFamilyKids([...familyKids, newKid]);
  };
  
  // Handler to remove a kid guest
  const removeKid = (indexToRemove: number) => {
    setFamilyKids(familyKids.filter((_, index) => index !== indexToRemove));
  };

  function handleFamilyMemberChange(
    index: number,
    field: keyof FamilyMember,
    value: any,
    New?: boolean
  ) {
    console.log(index, field, value);
    const updatedMembers = [...familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };

    if (field === "nationality") {
      updatedMembers[index]["countryFlag"] = value.value.toLowerCase();
    }
    if (field === "fullname") {
        updatedMembers[index]["fullname"] = value.label || value;
        if(New){
            updatedMembers[index]["value"] = "0";
        }
    }
        console.log(index, field, value);

    // Auto-fill data if an existing guest is selected
    if (field === "fullname" && !New && value.value) {
      setisLoading(true);
      const selectedGuest = guestlistAdults.find((g: any) => g.value === value.value);
      if(selectedGuest){
        updatedMembers[index] = {
            ...updatedMembers[index],
            value : selectedGuest.value || selectedGuest.id,
            birthDate: selectedGuest.birth_date,
            gender: selectedGuest.gender,
            nationalID: selectedGuest.national_id,
            nationality: selectedGuest.nationality,
            countryFlag: countryOptions.find(c => c.label === selectedGuest.nationality)?.value || "",
        };
      }
      setTimeout(() => setisLoading(false), 0);
    }
    console.log(updatedMembers)
    setFamilyMembers(updatedMembers);
  }

  function handleFamilyKidChange(
    index: number,
    field: keyof FamilyMember,
    value: any,
    New?: boolean
  ) {
    const updatedKids = [...familyKids];
    updatedKids[index] = { ...updatedKids[index], [field]: value };
    
    if (field === "nationality") {
        updatedKids[index]["countryFlag"] = value.value.toLowerCase();
    }
     if (field === "fullname") {
        updatedKids[index]["fullname"] = value.label || value;
        if(New){
            updatedKids[index]["value"] = "0";
        }
    }

    if (field === "fullname" && !New && value.value) {
        setisLoading(true);
        const selectedKid = guestlistKids.find((k: any) => k.value === value.value);
        if(selectedKid){
            updatedKids[index] = {
                ...updatedKids[index],
                value : selectedKid.value || selectedKid.id,
                birthDate: selectedKid.birth_date,
                gender: selectedKid.gender,
                nationality: selectedKid.nationality,
                countryFlag: countryOptions.find(c => c.label === selectedKid.nationality)?.value || ""
            };
        }
        setTimeout(() => setisLoading(false), 0);
    }
    setFamilyKids(updatedKids);
  }

  const today = new Date();
  const minDateAdult = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
  const minDateString = minDateAdult.toISOString().split("T")[0]; 

  function validate() {
    const newErrorsA: Array<{ [key: string]: string }> = Array.from({ length: numAdults }, () => ({}));
    const newErrorsK: Array<{ [key: string]: string }> = Array.from({ length: numChildren }, () => ({}));

    let hasErrors = false;
console.log(familyKids,familyMembers)
    familyMembers.forEach((member, index) => {
      if (!member.fullname) {
        newErrorsA[index].fullname = Language === "en" ? "Name is required" : "الاسم مطلوب";
        hasErrors = true;
      }
      if(!member.nationality){
        newErrorsA[index].country = Language === "en" ? "country is required" : "الدولة مطلوبة";
        hasErrors = true;
      }
      if(!member.birthDate){
        newErrorsA[index].birthDate = Language === "en" ? "Birthdate is required" : "تاريخ الميلاد مطلوب";
        hasErrors = true;
      } else if (new Date(member.birthDate) > minDateAdult) {
        newErrorsA[index].birthDate = Language === "en" ? `Must be 16 years old or older` : `يجب ان يكون 16 سنة او اكثر`;
        hasErrors = true;
      }
      if (!member.gender) {
        newErrorsA[index].gender = Language === "en" ? "Gender is required" : "النوع مطلوب";
        hasErrors = true;
      }
      if (!member.nationalID) {
        newErrorsA[index].nationalID = Language === "en" ? "National ID is required" : "الرقم القومي مطلوب";
        hasErrors = true;
      }
    });
    
    familyKids.forEach((member, index) => {
         if (!member.fullname) {
        newErrorsK[index].fullname = Language === "en" ? "Name is required" : "الاسم مطلوب";
        hasErrors = true;
      }
      if(!member.nationality){
        newErrorsK[index].country = Language === "en" ? "country is required" : "الدولة مطلوبة";
        hasErrors = true;
      }
      if(!member.birthDate){
        newErrorsK[index].birthDate = Language === "en" ? "Birthdate is required" : "تاريخ الميلاد مطلوب";
        hasErrors = true;
      }
      if (!member.gender) {
        newErrorsK[index].gender = Language === "en" ? "Gender is required" : "النوع مطلوب";
        hasErrors = true;
      }
      // Add kid validation rules...
    });
    
    setErrorsA(newErrorsA);
    setErrorsK(newErrorsK);
    return !hasErrors;
  }

  handleStep(() => {
    // Optional: could run validation on step change
  });

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: '1rem' }}>
        {Language === "en"
          ? "Step 2 | Guest Details"
          : "الخطوة الثانية | بيانات الضيوف"}
      </h1>
      <p style={{ textAlign: "center", marginTop: 0, color: 'var(--color-grey-500)' }}>
        {Language === 'en' ? 'Main guest:' : 'صاحب الحجز:'} <strong>{familyMembers[0]?.fullname || '...'}</strong>
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '20px 0', borderTop: '1px solid var(--color-grey-200)', borderBottom: '1px solid var(--color-grey-200)', padding: '1rem 0' }}>
          <Button type="reset" onClick={addAdult} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IoPersonAddOutline /> {Language === "en" ? "Add Adult" : "إضافة بالغ"}
          </Button>
          <Button type="reset" onClick={addKid} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IoAddCircleOutline /> {Language === "en" ? "Add Kid" : "إضافة طفل"}
            </Button>
      </div>

      <div id="FamilyMembers">
        {familyMembers.map((member, index) => (
          <div key={`adult-form-${index}`} style={{border: "1px solid var(--color-grey-200)", borderRadius: "8px", padding: "1.5rem", marginTop: "1.5rem", background: 'var(--color-grey-0)'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--color-brand-600)' }}>
                {index === 0 ? (Language === "en" ? 'Booking Holder' : 'صاحب الحجز') : `${Language === "en" ? 'Adult' : 'بالغ'} #${index + 1}`}
                </h3>
                {index > 0 && (
                    <Button
                        variant="danger"
                        onClick={() => removeAdult(index)}
                        type="reset"
                        style={{ height: 'fit-content', padding: '0.5rem' }}
                    >
                        <FaTrash />
                    </Button>
                )}
            </div>
            
            <FormRow label={Language === "en" ? "Full Name" : "الاسم الكامل"} error={errorsA[index]?.fullname}>
              {(index === 0 || guestlistAdults.length === 0) ? (
                <Input
                  type="text"
                  readOnly={index === 0}
                  placeholder={Language === "en" ? "Full Name" : "الاسم الكامل"}
                  defaultValue={member.fullname}
                  onBlur={(e) => handleFamilyMemberChange(index, "fullname", e.target.value, true)}
                />
              ) : (
                <Select
                  isDarkMode={isDarkMode}
                  selectCreate
                  placeholder={Language === "en" ? "Search or enter new name" : "ابحث أو أدخل اسم جديد"}
                  data={guestlistAdults}
                  defaultValue={guestlistAdults.find((guest: any) => guest.fullName === member.fullname) || ( member.fullname && { value: member.fullname, label: member.fullname })}
                  menuClose={true}
                  onChange={(e: any) => handleFamilyMemberChange(index, "fullname", e, e.__isNew__)}
                />
              )}
            </FormRow>
          <FormRow label={Language === "en" ? "Country" : "الدولة"} error={errorsA[index]?.country}>
              <Select
                isDarkMode={isDarkMode}
                data={countryOptions}
                placeholder={Language === "en" ? "Select Country" : "اختر الدولة"}
                defaultValue={countryOptions.find(c => c.label === member.nationality?.label || c.label === member.nationality)}
                value={countryOptions.find(c => c.label === member.nationality?.label || c.label === member.nationality)}
                onChange={(e: any) => handleFamilyMemberChange(index, "nationality", e)}
              />
            </FormRow>
            
            <FormRow label={Language === "en" ? "Passport / National ID" : "رقم الجواز / الرقم القومي"} error={errorsA[index]?.nationalID}>
                <Input
                    type="text"
                    placeholder={Language === "en" ? "Enter ID number" : "أدخل رقم الهوية"}
                    defaultValue={member.nationalID}
                    onChange={(e) => handleFamilyMemberChange(index, "nationalID", e.target.value)}
                />
            </FormRow>
            
            <FormRow label={Language === "en" ? "Birthdate" : "تاريخ الميلاد"} error={errorsA[index]?.birthDate}>
                <Input
                    type="date"
                    max={minDateString}
                    defaultValue={member.birthDate}
                    onChange={(e) => handleFamilyMemberChange(index, "birthDate", e.target.value)}
                />
            </FormRow>
             <FormRow label={Language === "en" ? "Gender" : "النوع"} error={errorsA[index]?.gender}>
                <Select
                    isDarkMode={isDarkMode}
                    placeholder={Language === "en" ? "Select Gender" : "اختر النوع"}
                    data={genderOptions.filter(opt => opt.lang === Language)}
                    value={genderOptions.find(g => g.label.toLowerCase() === member?.gender?.toLowerCase())}
                    defaultValue={genderOptions.find(g => g.label.toLowerCase() === member?.gender?.toLowerCase())}
                    onChange={(e: any) => handleFamilyMemberChange(index, "gender", e.value)}
                />
            </FormRow>

            {settings?.data.settings.id_scan && (
              <FormRow label={Language === "en" ? "Passport / ID Scan" : "صورة الجواز / الهوية"} error={errorsA[index]?.card}>
                  <FileInput
                      accept="image/*"
                      onChange={(e) => handleFamilyMemberChange(index, "passportImage", e.target.files?.[0])}
                  />
              </FormRow>
            )}
          </div>
        ))}
      </div>

      <div id="FamilyKids" style={{marginTop: "2rem"}}>
        {familyKids.map((member, index) => (
          <div key={`kid-form-${index}`} style={{border: "1px solid var(--color-grey-200)", borderRadius: "8px", padding: "1.5rem", marginTop: "1.5rem", background: 'var(--color-grey-0)'}}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--color-brand-600)' }}>
                    {Language === "en" ? 'Kid' : 'طفل'} #{index + 1}
                </h3>
                <Button
                    variant="danger"
                    onClick={() => removeKid(index)}
                    type="reset"
                    style={{ height: 'fit-content', padding: '0.5rem' }}
                >
                    <FaTrash />
                </Button>
            </div>
            
            <FormRow label={Language === "en" ? "Full Name" : "الاسم الكامل"} error={errorsK[index]?.fullname}>
              {guestlistKids.length === 0 ? (
                <Input
                  type="text"
                  placeholder={Language === "en" ? "Full Name" : "الاسم الكامل"}
                  defaultValue={member.fullname}
                  onBlur={(e) => handleFamilyKidChange(index, "fullname", e.target.value, true)}
                />
              ) : (
                <Select
                  isDarkMode={isDarkMode}
                  selectCreate
                  placeholder={Language === "en" ? "Search or enter new name" : "ابحث أو أدخل اسم جديد"}
                  data={guestlistKids}
                  defaultValue={guestlistKids.find((kid) => kid.fullName === member.fullname)}
                  menuClose={true}
                  onChange={(e: any) => handleFamilyKidChange(index, "fullname", e, e.__isNew__)}
                />
              )}
            </FormRow>

             <FormRow label={Language === "en" ? "Country" : "الدولة"} error={errorsK[index]?.country}>
                <Select
                    isDarkMode={isDarkMode}
                    data={countryOptions}
                    placeholder={Language === "en" ? "Select Country" : "اختر الدولة"}
                    value={countryOptions.find(c => c.label === member.nationality?.label || c.label === member.nationality)}
                    defaultValue={countryOptions.find(c => c.label === member.nationality?.label || c.label === member.nationality)}
                    onChange={(e: any) => handleFamilyKidChange(index, "nationality", e)}
                />
            </FormRow>

            <FormRow label={Language === "en" ? "Birthdate" : "تاريخ الميلاد"} error={errorsK[index]?.birthDate}>
                <Input
                    type="date"
                    max={today.toISOString().split("T")[0]}
                    defaultValue={member.birthDate}
                    onChange={(e) => handleFamilyKidChange(index, "birthDate", e.target.value)}
                />
            </FormRow>
            <FormRow label={Language === "en" ? "Gender" : "النوع"} error={errorsK[index]?.gender}>
                <Select
                    isDarkMode={isDarkMode}
                    placeholder={Language === "en" ? "Select Gender" : "اختر النوع"}
                    data={genderOptions.filter(opt => opt.lang === Language)}
                    value={genderOptions.find(g => g.label.toLowerCase() === member?.gender?.toLowerCase())}
                    defaultValue={genderOptions.find(g => g.label.toLowerCase() === member?.gender?.toLowerCase())}
                    onChange={(e: any) => handleFamilyKidChange(index, "gender", e.value)}
                />
            </FormRow>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '2rem', borderTop: '1px solid var(--color-grey-200)' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => previousStep()}
            style={{ float: Language !== "en" ? "right" : "left" }}
          >
            {Language === "en" ? "Previous" : "السابق"}
          </Button>
          <Button
            type="button"
            onClick={() => (validate() ? nextStep() : null)}
            style={{ float: Language !== "en" ? "left" : "right" }}
          >
            {Language === "en" ? "Next" : "التالي"}
          </Button>
      </div>
    </>
  );
};

const Step3 = () => {
  const { handleStep, previousStep, nextStep } = useWizard();
  const {
    pickedAmenities,
    setPickedAmenities,
    startDate,
    endDate,
    orderSummary,
    setOrderSummary,
    setExtras,
    extras,
    selectedRanges,
    breakfast,
    setBreakfast,
    observations,
    setObservations,
    totalPrice,
    setTotalPrice,
    choosenCabin,
    setIsLastStep,
    numAdults,
    numChildren,
  } = useBookingStore();
  
  const { isgettingBreakfast, GetBreakfast } = useGetBreakfast();
  const { bookings } = useGetBookingCalender();
  const Language = useSettingsStore(state => state.Language);
  const { isDarkMode } = useDarkMode();
  const { settings } = useSettings();

  // Calculate day difference
  const enddate = new Date(endDate);
  const startdate = new Date(startDate);
  const dayDiff = Math.ceil((enddate.getTime() - startdate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const { discounts, error: errorDiscount, isLoading: isLoadingDiscount } = useGetAvailableDiscount();
  
  const { isgettingPicked, GetPickedAmenities } = useGetPickedAmenities(
    dayDiff,
    discounts,
    startdate,
    enddate
  );

  // Local state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [localOrderSummary, setLocalOrderSummary] = useState<any>({});
  // Attach step handler
  handleStep(() => {
    setIsLastStep(true);
  });
  useEffect(() => {
    const rooms: any = {};
    Object.keys(selectedRanges).forEach((key) => {
      const [typeId, roomId] : any[] = key.split('-');
      if (!rooms[key]) rooms[key] = {}; // make sure it's an object
      rooms[key] = bookings?.data?.bookings[typeId][roomId];
      const result = selectedRanges[key].reduce((acc, range: any) => {
        const startDate = new Date(range.start.year, range.start.month, range.start.day);
        const endDate = new Date(range.end.year, range.end.month, range.end.day);
        const dates = getDatesBetween(startDate, endDate);
        return {
          price: acc.price + range.price,
          totalDays: acc.totalDays + dates.length
        };
      }, { price: 0, totalDays: 0 });
      if(!rooms[key]) rooms[key] = {};
      rooms[key].totalDays = result.totalDays;
      rooms[key].totalPrice = result.price;
      rooms[key].name = `${Language === "en" ? `${rooms[key].type_name_en} - ${rooms[key].cabin_name}` : `${rooms[key].type_name_ar} - ${rooms[key].cabin_name}`}`
      rooms[key].ranges = [];
      selectedRanges[key].forEach((range: any) => {
        const startDate = new Date(range.start.year, range.start.month, range.start.day);
        const endDate = new Date(range.end.year, range.end.month, range.end.day);
       
        rooms[key].ranges.push({
          start: range.start,
          end: range.end,
          price: range.price,
          totalDays: getDatesBetween(startDate, endDate).length,
          totalPrice: range.totalPrice,
          name: `${Language === "en" ? `${rooms[key].type_name_en} - ${rooms[key].cabin_name}` : `${rooms[key].type_name_ar} - ${rooms[key].cabin_name}`}`
        });
      })
    })
    setLocalOrderSummary(rooms);
  }, [selectedRanges]);
  const rangeToString = (range: any) => {
    return `${range.start.year}/${range.start.month+1}/${range.start.day}-${range.end.year}/${range.end.month+1}/${range.end.day}`
  }

  // Handle global checkbox for room
  const handleGlobalRoomCheck = (roomKey: string, checked: boolean) => {
    const newExtras = { ...extras };
    newExtras[roomKey] = {
      ...newExtras[roomKey],
      allSelected: checked,
      breakfast: checked
    };
    // setExtras(newExtras);
  };

  // Handle breakfast checkbox for specific room
  const handleBreakfastCheck = (roomKey: string,room: any, checked: boolean) => {
    const newExtras = { ...extras };   
    newExtras[roomKey] = {
      ...newExtras[roomKey],
      breakfast: checked
    };
     // Apply to all ranges if they don't have specific observations
     if(!newExtras[roomKey]?.rangeBreakfast) {
      newExtras[roomKey].rangeBreakfast = {};
     }
     room.ranges.forEach((range: any) => {
          console.log(rangeToString(range))
      newExtras[roomKey].rangeBreakfast[rangeToString(range)] = checked
     })
    setExtras(newExtras);
  };

  const handleRangeBreakfastCheck =  (roomKey: string, range: number, value: string) => {
    const rangeIndex = rangeToString(range);
    const newExtras = { ...extras };
    if(!newExtras[roomKey]){
      newExtras[roomKey] = {};
    }
    newExtras[roomKey] = {
      ...newExtras[roomKey],
      rangeBreakfast: {
        ...newExtras[roomKey].rangeBreakfast,
        [rangeIndex]: value
      }
    };
    setExtras(newExtras);
  };
  // Handle amenities selection
  const handleAmenitiesChange = (roomKey: string,range: any, selectedAmenities: any[]) => {
    const rangeIndex = rangeToString(range);
    const newExtras = { ...extras };
     
    newExtras[roomKey] = {
      ...newExtras[roomKey],
      rangeAmenities: {
        ...newExtras[roomKey]?.rangeAmenities,
        [rangeIndex]: selectedAmenities
      }
    };
    console.log(newExtras)
  //   // Update global checkbox state
  //   const allSelected = newExtras[roomKey].breakfast && selectedAmenities.length > 0;
  //   newExtras[roomKey].allSelected = allSelected;
    setExtras(newExtras);

  }
  // Handle global observation change
  const handleGlobalObservationChange = (roomKey: string, value: string) => {
    const newExtras = { ...extras };
    newExtras[roomKey] = {
      ...newExtras[roomKey],
      globalObservation: value
    };
    
    setExtras(newExtras);
  };
  // Handle range-specific observation change
  const handleRangeObservationChange = (roomKey: string, range: any, value: string) => {
    const newExtras = { ...extras };
    if (!newExtras[roomKey] || !newExtras[roomKey].rangeObservations) {
      newExtras[roomKey] = {
        ...newExtras[roomKey],
        rangeObservations: {}
      };
    }
    newExtras[roomKey] = {
      ...newExtras[roomKey],
      rangeObservations: {
        ...newExtras[roomKey].rangeObservations,
        [rangeToString(range)]: value
      }
    };
    setExtras(newExtras);
  };

  // Validation function
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Add validation logic here
    Object.keys(extras).forEach(roomKey => {
      if (!extras[roomKey]) {
        newErrors[roomKey] = Language === "en" ? "Please select options for this room" : "يرجى اختيار خيارات لهذه الغرفة";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get breakfast price per day
  const getBreakfastPricePerDay = () => {
    return (settings?.data?.settings?.breakfast_price || 0) * (Number(numAdults) + Number(numChildren));
  };

  // Format date range
  const formatDateRange = (range: any) => {
    const fromDate = new Date(range.start.year, range.start.month, range.start.day +1).toISOString().split("T")[0].replace(/-/g, "/");
    const toDate = new Date(range.end.year, range.end.month, range.end.day + 1).toISOString().split("T")[0].replace(/-/g, "/");
    return Language === "en" 
      ? `From ${fromDate} to ${toDate}`
      : `من ${fromDate} إلى ${toDate}`;
  };
  useEffect(() => {
    const totalBreakfastCost = Object.entries(extras).reduce((roomAcc, [roomKey, roomData] : [string, any] ) => {
      const roomBreakfastCost = Object.entries(roomData.rangeBreakfast || {}).reduce((rangeAcc, [rangeKey, isSelected]) => {
        if (!isSelected) return rangeAcc;
    
        const [startStr, endStr] = rangeKey.split("-");
        const [d1, m1, y1] = startStr.split("/").map(Number);
        const [d2, m2, y2] = endStr.split("/").map(Number);
        const startDate = new Date(d1, m1-1, y1);
        const endDate = new Date(d2, m2-1, y2);
    
        const totalDays = getDatesBetween(startDate, endDate).length;
        const breakfastCost = getBreakfastPricePerDay() * totalDays;
        return rangeAcc + breakfastCost;
      }, 0);
    
      return roomAcc + roomBreakfastCost;
    }, 0);
    const totalAmenitiesCost = Object.entries(extras).reduce((roomAcc, [roomKey, roomData] : [string, any] ) => {
      const roomAmenitiesCost = Object.entries(roomData.rangeAmenities || {}).reduce((amenityAcc, [amenityKey, amenities]: [string, any]) => {
          if(!Array.isArray(amenities)) return amenityAcc;
        const amenityCost = amenities.reduce((rangeAcc, amenity: any) => {
          const [startStr, endStr] = amenityKey.split("-");
          const [d1, m1, y1] = startStr.split("/").map(Number);
          const [d2, m2, y2] = endStr.split("/").map(Number);
          const startDate = new Date(d1, m1-1, y1);
          const endDate = new Date(d2, m2-1, y2);
    
          const totalDays = getDatesBetween(startDate, endDate).length;
          return rangeAcc + Number((amenity as { price: number }).price ) * totalDays;
          }, 0);
         return amenityAcc + amenityCost;
      }, 0);
      return roomAcc + roomAmenitiesCost;
    }, 0);
      setTotalPrice({rooms: totalPrice.rooms, breakfast: totalBreakfastCost, amenities : totalAmenitiesCost})
  },[extras])
 

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        {Language === "en" ? "Step 3 | Extras" : "الخطوة 3 | الاضافات"}
      </h1>

      {Object.keys(localOrderSummary).map((roomKey:string) => {
        const room = localOrderSummary[roomKey];
        const roomExtras = extras[roomKey] || {};

        return (
          <div key={`room-${roomKey}`} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
              {room?.name}
            </h2>

            {/* Global Room Controls */}
            <FormRow 
              label={Language === "en" ? "Select All for this Room" : "اختيار الكل لهذه الغرفة"}
              key={`room-${roomKey}-global`}
            >
              <Checkbox
                id={`global-${roomKey}`}
                checked={roomExtras.allSelected || false}
                onChange={(e: any) => handleGlobalRoomCheck(roomKey, e.target.checked)}
              />
            </FormRow>

            {/* Global Room Observation */}
            <FormRow
              label={Language === "en" ? "Room Observation (applies to all ranges)" : "ملاحظة الغرفة (تطبق على جميع الفترات)"}
              key={`room-${roomKey}-global-obs`}
            >
              <Textarea
                placeholder={Language === "en" ? "Enter room observation..." : "أدخل ملاحظة الغرفة..."}
                defaultValue={roomExtras.globalObservation || ""}
                onBlur={(e: any) => handleGlobalObservationChange(roomKey, e.target.value)}
              />
            </FormRow>

            {/* Breakfast for Room */}
            <FormRow
              label={
                Language === "en"
                  ? `Include Breakfast (${getBreakfastPricePerDay()} EGP/day)`
                  : `اضافة الافطار (${getBreakfastPricePerDay()} EGP/day)`
              }
              key={`room-${roomKey}-breakfast`}
            >
              <Checkbox
                id={`breakfast-${roomKey}`}
                checked={roomExtras.breakfast || false}
                onChange={(e: any) => handleBreakfastCheck(roomKey, room, e.target.checked)}
              />
            </FormRow>


            {/* Date Ranges for Room */}
            {room?.ranges?.map((range: any, rangeIndex: number) => (
              <div key={`range-${roomKey}-${rangeIndex}`} style={{ marginLeft: "1rem", padding: "0.5rem",borderRadius: "4px", marginBottom: "0.5rem" }}>
                <h4 style={{ marginBottom: "0.5rem" , textAlign: "center"}}>{formatDateRange(range)}</h4>
                
                <FormRow
                  label={
                    Language === "en" 
                      ? `Range-specific observation (overrides room observation)` 
                      : `ملاحظة خاصة بالفترة (تلغي ملاحظة الغرفة)`
                  }
                  key={`range-obs-${roomKey}-${rangeIndex}`}
                >
                  <Textarea
                    placeholder={
                      Language === "en" 
                        ? "Enter specific observation for this range..." 
                        : "أدخل ملاحظة خاصة لهذه الفترة..."
                    }
                    defaultValue={roomExtras.rangeObservations?.[rangeToString(range)] || ""}
                    onBlur={(e: any) => handleRangeObservationChange(roomKey, range, e.target.value)}
                  />
                </FormRow>
                 {/* Breakfast for Room */}
            <FormRow
              label={
                Language === "en"
                  ? `Include Breakfast (${getBreakfastPricePerDay()} EGP/day)`
                  : `اضافة الافطار (${getBreakfastPricePerDay()} EGP/day)`
              }
              key={`room-${roomKey}-breakfast`}
            >
              <Checkbox
                id={`breakfast-${roomKey}`}
                checked={roomExtras.rangeBreakfast?.[rangeToString(range)] || false}
                onChange={(e: any) => handleRangeBreakfastCheck(roomKey, range ,e.target.checked)}
              />
            </FormRow>
               {/* Amenities for Room */}
            <FormRow
              label={Language === "en" ? "Extra Amenities" : "خدمات اضافية"}
              key={`room-${roomKey}-amenities`}
            >
              {isgettingPicked ? (
                <SpinnerMini />
              ) : (
                <Select
                  isDarkMode={isDarkMode}
                  placeholder={Language === "en" ? "Select Amenities" : "اختر الاضافات"}
                  data={GetPickedAmenities}
                  defaultValue={roomExtras.rangeAmenities?.[rangeToString(range)] || []}
                  menuClose={false}
                  onChange={(selectedOptions: any[]) => handleAmenitiesChange(roomKey, range, selectedOptions)}
                  isMulti={true}
                />
              )}
            </FormRow>
            <div style={{ border: "1px solid #ccc", margin: "1rem 0" }}></div>
              </div>
            ))}
            {errors[roomKey] && (
              <div style={{ color: "red", marginTop: "0.5rem" }}>
                {errors[roomKey]}
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Buttons */}
      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between" }}>
        <Button
          type="button"
          disabled={false}
          onClick={() => previousStep()}
        >
          {Language === "en" ? "Previous ⏮️" : "⏭ السابق "}
        </Button>
        
        <Button
          type="button"
          disabled={false}
          onClick={() => (validateFields() ? nextStep() : null)}
        >
          {Language === "en" ? "Next ⏭" : " التالي ⏮️"}
        </Button>
      </div>
    </>
  );
};
const formatDateStep4 = (str: string) => {
  const [y, m, d] = str.split("-").map(Number);
  return `${y}/${m}/${d}`;
};
const Step4 = () => {
    const { bookings } = useGetBookingCalender();
    const { cabins } = useCabins();
  const { handleStep, previousStep, nextStep } = useWizard();
  const { orderSummary,setOrderSummary, setIsLastStep , totalPrice , selectedRanges, extras,setBookingActivity } = useBookingStore();
  const Language = useSettingsStore(state => state.Language);
  const { settings } = useSettings();
  const [localOrderSummary, setLocalOrderSummary] = useState<any>({});
  const [hierarchicalSummary, setHierarchicalSummary] = useState<any>([]);
  handleStep(() => {
    setIsLastStep(false);
  });
  const vat = (settings?.data?.settings?.vat ?? 0) || 0;
  const breakfast_price = settings?.data?.settings?.breakfast_price || 0
  useEffect(() => { 
    const rooms: any = {};
    Object.keys(selectedRanges).forEach((key) => {
      const [typeId, roomId] : any[] = key.split('-');
      rooms[key] = bookings?.data?.bookings[typeId][roomId];
      const result = selectedRanges[key].reduce((acc, range: any) => {
        const startDate = new Date(range.start.year, range.start.month, range.start.day);
        const endDate = new Date(range.end.year, range.end.month, range.end.day);
        const dates = getDatesBetween(startDate, endDate);
        return {
          price: acc.price + range.price,
          totalDays: acc.totalDays + dates.length
        };
      }, { price: 0, totalDays: 0 });
      rooms[key].totalDays = result.totalDays;
      rooms[key].totalPrice = result.price;
      rooms[key].name = `${Language === "en" ? `${rooms[key].type_name_en} - ${rooms[key].cabin_name}` : `${rooms[key].type_name_ar} - ${rooms[key].cabin_name}`}`
    })
    setLocalOrderSummary(rooms);
    const orderSummaryZ: any[] = [];
Object.keys(selectedRanges).forEach((key) => {
    const cabinData = rooms[key];
    const ranges = selectedRanges[key];

    if (!cabinData || !ranges || ranges.length === 0) return;

    ranges.forEach((range: any) => {
      const start = new Date(range.start.year, range.start.month, range.start.day+1);
      const end = new Date(range.end.year, range.end.month, range.end.day+1);
      const dayDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const priceWithVat = range.price  * (1 + (vat / 100));
  
      orderSummaryZ.push({
        item: `${cabinData.name} - ${priceWithVat.toFixed(2)} - ${dayDiff} Days`,
        price: priceWithVat.toFixed(2),
        cost: range.price,
        name: cabinData.name,
        day: dayDiff,
        start_date: start.toISOString().split("T")[0],
        end_date: end.toISOString().split("T")[0],
        id: cabinData.cabin_id,
      });
    });
  });
  setOrderSummary(orderSummaryZ);
  },[selectedRanges]);

  useEffect(() => {
    const Reciept : any = [];
    if(!cabins?.data.cabins) return;
    if(!orderSummary) return;
      try{
        let totalDaysBooking = 0;
      Object.values(localOrderSummary)?.forEach((item: any) => {
      const cabin = cabins?.data.cabins.find((cabin: any) => cabin.id === item.cabin_id);
      const ranges = orderSummary.filter((order: any) => order.id === item.cabin_id);
      if(!cabin) return;
      // push to reciept the room and its price
      Reciept.push({
        item:item.name,
        totalPrice:(item.totalPrice),
        totalDays:item.totalDays,
        included : false,
      });
      totalDaysBooking += item.totalDays;
      ranges.forEach((range: any) => {
        const rangeIndex = `${formatDateStep4(range.start_date)}-${formatDateStep4(range.end_date)}`;
        const cabinIndex = cabin.type+ "-" + cabin.id;
      //push to reciept the range itself of the room and it price
        Reciept.push({
          item:rangeIndex,
          id:item.cabin_id,
          type : "cabins",
          totalPrice:range.cost,
          totalDays:range.day,
          marginLeft: "15px",
        });
      //push to reciept the breakfast of the room
      if(extras?.[cabinIndex]?.rangeBreakfast?.[rangeIndex]){
          Reciept.push({
          item:`${Language === "en" ? "Breakfast" : "فطور"} 🍳`,
          type : "breakfast",
          totalPrice:breakfast_price * range.day,
          totalDays:range.day,
          marginLeft: "30px",
          });
        }
      // push to reciept the amenities of the room
      if(extras?.[cabinIndex]?.rangeAmenities?.[rangeIndex]){
        extras?.[cabinIndex]?.rangeAmenities?.[rangeIndex]?.forEach((amenity: any) => {
          Reciept.push({
            item:amenity.label,
            type:"amenities",
            id:amenity.value,
            totalPrice:amenity.price * range.day,
            totalDays:range.day,
            marginLeft: "30px",
          });
        })
      }
      })
    })
      // push to reciept the total price of the hole booking
      Reciept.push({
        item:"Total Price 🧾",
        totalPrice:totalPrice.rooms+totalPrice.breakfast+totalPrice.amenities,
        totalDays:totalDaysBooking,
        included : false,
      })
      }catch(e){
        console.log(e);
      }
      // set booking_activity
      setBookingActivity(Reciept);
      console.log(Reciept)
      setHierarchicalSummary(Reciept);
  },[orderSummary,cabins,extras,localOrderSummary]);

// Done: now use setOrderSummary(orderSummary);
// console.log(orderSummary);
  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        {Language === "en" ? "Your Receipt 🧾 Summary" : "🧾 ملخص الطلب "}
      </h1>
      <Table columns="1fr 1fr 1fr 1fr 1fr" minwidth="0px">
        <Table.Header>
          <div>highlight</div>
          <div>price/day</div>
          <div>days</div>
          <div>total cost</div>
          <div>vat {vat}% incl.</div>
        </Table.Header>
        {hierarchicalSummary &&
          hierarchicalSummary.map((item: any, index: any) => (
            <SummaryRow key={item.item+index} Row={item} />
          ))
        }
      </Table>
      <Button
        type="reset"
        disabled={false}
        onClick={() => previousStep()}
        style={{ float: Language !== "en" ? "right" : "left" }}
      >
        {Language === "en" ? "Previous ⏮️" : "⏭ السابق "}
      </Button>
      {/* <Button
              type="reset"
              disabled={false}
              onClick={() => nextStep()}
              style={{ float: "right" }}
          >
              Finish ✅
          </Button> */}
    </>
  );
};
export { Step0, Step1, Step2, Step3, Step4 }