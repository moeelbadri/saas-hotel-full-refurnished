"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { format, getDaysInMonth, isBefore, startOfToday, addDays } from "date-fns";
import { arSA } from "date-fns/locale";

const Calendar = () => {
  const currentYear = new Date().getFullYear();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // Local state for current month
  const [selectedStartDate, setSelectedStartDate] = useState<number | null>(null); // Start date
  const [selectedEndDate, setSelectedEndDate] = useState<number | null>(null); // End date
  const maxRange = 7; // Max number of days that can be selected after the start date

  // Memoize monthsArray to prevent it from being recreated on every render
  const monthsArray = useMemo(() => Array.from({ length: 36 }, (_, i) => i + 1), []);

  // Memoize calculateMonthData to prevent infinite updates
  const calculateMonthData = useCallback((selectedMonth: number, year: number) => {
    const monthDate = new Date(year, selectedMonth - 1);
    const daysInMonth = getDaysInMonth(monthDate);
    const monthName = format(monthDate, "MMMM yyyy", { locale: arSA });
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { monthName, daysArray };
  }, []);

  // Month data (calculated from selected month)
  const [monthData, setMonthData] = useState(() =>
    calculateMonthData(monthsArray[0], currentYear)
  );

  // Update month data only when currentMonthIndex changes
  useEffect(() => {
    const selectedMonth = monthsArray[currentMonthIndex];
    const newMonthData = calculateMonthData(selectedMonth, currentYear);

    setMonthData((prevMonthData) => {
      if (
        prevMonthData.monthName !== newMonthData.monthName ||
        prevMonthData.daysArray.length !== newMonthData.daysArray.length
      ) {
        return newMonthData;
      }
      return prevMonthData;
    });
  }, [currentMonthIndex, monthsArray, currentYear, calculateMonthData]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : monthsArray.length - 1
    );
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex < monthsArray.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Get today's date
  const today = startOfToday();

  // Function to check if a day is in the past
  const isPastDay = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonthIndex, day);
    return isBefore(selectedDate, today);
  };

  // Handle day selection
  const handleDaySelection = (day: number) => {
    if (selectedStartDate === null) {
      setSelectedStartDate(day); // Select start date
    } else if (selectedEndDate === null) {
      setSelectedEndDate(day); // Select end date
    } else {
      setSelectedStartDate(day); // Reset and select a new start date
      setSelectedEndDate(null);
    }
  };

  // Function to check if a day is in the selected range
  const isInRange = (day: number) => {
    if (selectedStartDate && selectedEndDate) {
      return day >= selectedStartDate && day <= selectedEndDate;
    }
    return false;
  };

  return (
    <CalendarWrapper>
      {/* Navigation Arrows */}
      <ArrowButton disabled={currentMonthIndex === 0} type="button" onClick={goToPreviousMonth}>
        {"<"}
      </ArrowButton>
      <CalendarContainer>
        <MonthHeader>{monthData.monthName}</MonthHeader>
        <DaysGrid>
          {monthData.daysArray.map((day) => {
            const past = isPastDay(day); // Check if the day is in the past
            const colorStyle = past ? 'gray' : (isInRange(day) ? 'blue' : (day % 2 === 0 ? 'green' : 'red'));
            return (
              <DayBox
                key={day}
                disabled={past}
                selected={isInRange(day)}
                onClick={() => handleDaySelection(day)}
              >
                <DayNumber>{day}</DayNumber>
                <HalfBox color={colorStyle}>
                  <AMLabel>صباحًا</AMLabel>
                  <PMLabel>مساءً</PMLabel>
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

// Styled Components
const CalendarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-family: Arial, sans-serif;
  direction: rtl; /* Right-to-left for Arabic */
  color: #000;
`;

const CalendarContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
  width: 100%;
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

const DayBox = styled.div<{ disabled: boolean; selected: boolean }>`
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  position: relative;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${(props) => (props.disabled ? '#f1f1f1' : props.selected ? '#007bff' : 'white')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const HalfBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  background: ${({ color }) =>
    color === 'green'
      ? 'linear-gradient(to right, #00ff00 50%, #ff0000 50%)'
      : color === 'red'
      ? 'linear-gradient(to right, #ff0000 50%, #00ff00 50%)'
      : color === 'blue'
      ? 'linear-gradient(to right, #007bff 100%, #007bff 100%)'
      : 'linear-gradient(to right, #e0e0e0 50%, #e0e0e0 50%)'};
`;

const DayNumber = styled.span`
  font-size: 0.8em;
`;

const AMLabel = styled.div`
  font-size: 0.8em;
  padding-right: 10px;
`;

const PMLabel = styled.div`
  font-size: 0.8em;
  padding-left: 10px;   
`;
