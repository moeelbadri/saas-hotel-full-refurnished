"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { format, getDaysInMonth, isBefore, startOfToday } from "date-fns";
import { arSA } from "date-fns/locale";
import { useSettingsStore , useBookingStore } from "@/components/WizardForm/useStore";
import { useGetBookingCalender } from "@/hooks/bookings";


const Calendar = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Get the current month (0-11)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentMonth); // Local state for current month
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null); // Start date
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null); // End date
  const [hovered, setHovered] = useState<boolean | null>(null); // Track hovered day
  const [locked , setLocked] = useState<boolean>(false);
  const Language = useSettingsStore(state => state.Language);
  const {bookings} = useGetBookingCalender();
  const {selectedRanges} = useBookingStore();
  console.log(bookings)
  const maxRange = 7; // Max number of days that can be selected after the start date

  const monthsArray = useMemo(() => Array.from({ length: 36 }, (_, i) => i + 1), []);
  const firstBooked = useMemo(() => {
    const SelectDate = new Date(selectedStartDate as Date).getTime();
    return bookedDates.find((date) => { 
      return new Date(date).getTime() > SelectDate;
    })
  }, [bookedDates,selectedStartDate]);
  const calculateMonthData = useCallback((selectedMonth: number, year: number) => {
    const monthDate = new Date(year, selectedMonth - 1);
    const daysInMonth = getDaysInMonth(monthDate);
    const monthName = format(monthDate, "MMMM yyyy", { locale: arSA });
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { monthName, daysArray };
  }, []);

  const [monthData, setMonthData] = useState(() =>
    calculateMonthData(monthsArray[0], currentYear)
  );

  useEffect(() => {
    const selectedMonth = monthsArray[currentMonthIndex];
    const newMonthData = calculateMonthData(selectedMonth, currentYear);
    setMonthData(newMonthData);
  }, [currentMonthIndex, currentYear, calculateMonthData]);

  const goToPreviousMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : monthsArray.length - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex < monthsArray.length - 1 ? prevIndex + 1 : 0));
  };

  const isPastDay = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonthIndex, day);
    return isBefore(selectedDate, startOfToday());
  };

  const handleDaySelection = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonthIndex, day);
    if(hovered) {
      if(selectedDate.getTime() < new Date(firstBooked as string).getTime()){
        setSelectedEndDate(selectedDate); // Update hovered day
      }else{
        setSelectedEndDate(new Date(firstBooked as string))
      }
      setHovered(false);
      setLocked(true);
    }else {
    if (selectedStartDate === null) {
      setSelectedStartDate(selectedDate); // Select start date
      setSelectedEndDate(selectedDate); // Select end date
      setLocked(false);
    } else if (selectedEndDate === null) {
      if(selectedDate.getTime() < new Date(firstBooked as string).getTime()){
        setSelectedEndDate(selectedDate); // Update hovered day
      }else{
        setSelectedEndDate(new Date(firstBooked as string))
      }
      setLocked(true);
    } else {
      if(selectedDate > selectedEndDate) {
        if(selectedDate.getTime() < new Date(firstBooked as string).getTime()){
          setSelectedEndDate(selectedDate); // Update hovered day
        }else{
          setSelectedEndDate(new Date(firstBooked as string))
        }
      }else{
        setLocked(false);
        setSelectedStartDate(selectedDate); // Reset and select a new start date
        setSelectedEndDate(null);
      }
    }
  };
}

  const handleDayHover = (day: number, e: React.MouseEvent) => {
    if(locked || !selectedStartDate) return true;
    const selectedDate = new Date(currentYear, currentMonthIndex, day);
    setHovered(true);
    if (selectedStartDate) {
      if (e.type === "mouseenter") {
        // console.log(selectedDate.getTime() < new Date(firstBooked as string).getTime())
      if(selectedDate.getTime() < new Date(firstBooked as string).getTime()){
        setSelectedEndDate(selectedDate); // Update hovered day
      }else{
        setSelectedEndDate(new Date(firstBooked as string))
      }
      } else if (e.type === "mouseleave") {
        if(hovered) setSelectedEndDate(null); // Update hovered day
        setHovered(false);
      }
    }
  };
  // const selectedRange = useMemo(() => {
  //   if (!selectedStartDate || !selectedEndDate) return new Set();
    
  //   const rangeSet = new Set<number>();
  //   let current = new Date(selectedStartDate);
  
  //   while (current <= selectedEndDate) {
  //     rangeSet.add(current.getDate());
  //     current.setDate(current.getDate() + 1);
  //   }
  //   return rangeSet;
  // }, [selectedStartDate, selectedEndDate]);
  // const isInRange = (day: number) => selectedRange.has(day);

  const isInRange = (day: number) => {
    // if(selectedStartDate == new Date(currentYear, currentMonthIndex, day)) {
    //   return true;
    // }
    if (selectedStartDate && selectedEndDate) {
      const currentDay = new Date(currentYear, currentMonthIndex, day);
      return (
        (currentDay >= selectedStartDate && currentDay <= selectedEndDate) ||
        (currentDay <= selectedStartDate && currentDay >= selectedEndDate)
      );
    }
    return false;
  };
  const maxLength = (CurrentDate: string) => {
    if(selectedStartDate) {
      const disabled = bookedDates.find((date) => {
        // console.log(new Date(date).getTime() , new Date(selectedStartDate).getTime())
        return new Date(date).getTime() < new Date(selectedStartDate).getTime();
      });
      console.log(disabled,new Date(selectedStartDate).getTime(),bookedDates);
      return new Date(CurrentDate).getTime() < new Date(selectedStartDate).getTime();
    }
    return false;
  }
  return (
    <CalendarWrapper direction={Language}>
      <ArrowButton disabled={currentMonthIndex === 0} type="button" onClick={goToPreviousMonth}>
        {"<"}
      </ArrowButton>
      <CalendarContainer>
      <MonthHeader><ArrowButton type="button" >{"<"}</ArrowButton>xd<ArrowButton type="button" >{">"}</ArrowButton></MonthHeader >
        <MonthHeader>{monthData.monthName}</MonthHeader>
        <DaysGrid>
          {monthData.daysArray.map((day) => {
            const currentDay = new Date(currentYear, currentMonthIndex, day).toISOString().split("T")[0];
            const past = isPastDay(day); // Check if the day is in the past
            const colorStyle = past
              ? "gray"
              : isInRange(day)
              ? "blue"
              : bookedDates.find((date) => date === currentDay)
              ? "red"
              : "green";
            return (
              <DayBox
                key={day}
                disabled={past || colorStyle === "red"}
                selected={currentDay == selectedStartDate?.toISOString().split("T")[0]||isInRange(day)}
                onClick={() => (colorStyle === "green" || colorStyle === "blue") && handleDaySelection(day)}
                onMouseEnter={(e) => colorStyle === "green" && handleDayHover(day, e)}
                onMouseLeave={(e) => handleDayHover(day, e)}
              >
                <DayNumber>{day}</DayNumber>
                <HalfBox color={colorStyle} > 
                 <Label>{colorStyle}</Label>
                </HalfBox>
              </DayBox>
            );
          })}
        </DaysGrid>
      </CalendarContainer>
      <ArrowButton disabled={currentMonthIndex === monthsArray.length - 1} type="button" onClick={goToNextMonth}>
        {">"}
      </ArrowButton>
    </CalendarWrapper>
  );
};

export default Calendar;

const CalendarWrapper = styled.div<{ direction: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65vh;
  font-family: Arial, sans-serif;
  direction: ${(props) => (props.direction === "en" ? "ltr" : "rtl")};
  color: #000;
`;

const CalendarContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
  width: 100%;
   background-color: var(--color-grey-900);
`;

const ArrowButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const MonthHeader = styled.div`
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  
`;

const DayBox = styled.div<{ disabled: boolean; selected: boolean}>`
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  position: relative;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${(props) =>
    props.disabled ? "#f1f1f1" : props.selected ? "#007bff" : "white"};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#f1f1f1" : "#007bff"};
  }
`;

const HalfBox = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  text-align: center;
  background: ${({ color }) =>
    color === "green"
      ? "#00ff00"
      : color === "red"
      ? "#ff0000"
      : color === "blue"
      ? "blue"
      : "linear-gradient(to right, #e0e0e0 50%, #e0e0e0 50%)"};
`;

const DayNumber = styled.span`
  font-size: 0.8em;
`;
const Label = styled.label`
  transform: translateY(40%);
  font-weight: 500;
  font-family: "Sono";
`;