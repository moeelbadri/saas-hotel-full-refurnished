"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { format, getDaysInMonth, isBefore, startOfToday } from "date-fns";
import { arSA } from "date-fns/locale";
import { useSettingsStore, useBookingStore } from "@/components/WizardForm/useStore";
import { FormRow, Input } from "@/components/form";
import { useGetBookingCalender } from "@/hooks/bookings";
import { FaArrowLeft, FaArrowRight, FaPlus, FaMinus } from "react-icons/fa";
import { useGetAvailableDiscount } from "@/hooks/discounts";
import { formatCurrency } from "@/utils/helpers";
import { X as CloseIcon } from "lucide-react";

const formatDate = (date: Date): string => {
  // implement your date formatting logic here
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
const getDatesBetweenDiscount = (discounts: any) => {
  const startDate = new Date(discounts.start_date.split("T")[0]);
  const endDate = new Date(discounts.end_date.split("T")[0]);
  const dates: any[] = [];
  const currentDate = new Date(startDate);

  // Increment the date by one day at a time until reaching the end date
  while (currentDate <= endDate) {
    dates.push({date: formatDate(new Date(currentDate)), discount: discounts.discount,cabin_ids: discounts.cabin_ids, amenities_ids: discounts.amenities_ids, guest_p_ids: discounts.guest_p_ids});
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
const getDatesBetween = (startDate: Date, endDate: Date) => {
  const dates: any[] = [];
  const currentDate = new Date(startDate);

  // Increment the date by one day at a time until reaching the end date
  while (currentDate <= endDate) {
    dates.push(formatDate(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
const Calendar = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentMonth);
  const [hoveredEndDate, setHoveredEndDate] = useState<SelectedDay | null>(null);
  const [pendingRangeStart, setPendingRangeStart] = useState<SelectedDay | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const Language = useSettingsStore(state => state.Language);
  const { selectedRanges, setSelectedRanges , startDate, endDate, numAdults,setTotalPrice,totalPrice } = useBookingStore();
  // Store ranges per room - this now persists all room ranges
  const [roomRanges, setRoomRanges] = useState<{[roomKey: string]: Range[]}>(selectedRanges || {});
  const { bookings } = useGetBookingCalender();
  
    const today = new Date().toISOString().split("T")[0];
  
    const {discounts,error: errorDiscount,isLoading: isLoadingDiscount} = useGetAvailableDiscount();
    const discountdataRange: [{date: string, discount: number, cabin_ids: string[], amenities_ids: string[], guest_p_ids: string}] = useMemo(() => {
      return discounts?.data?.discounts.reduce((acc, discount) => [...acc, ...getDatesBetweenDiscount(discount)], []) || [];
    }, [discounts]);
    function getDiscountForDay(selectedRoomId: string,dateTocheck: string, day?: number, currentYear?: number, currentMonthIndex?: number): number | null {
      if(!dateTocheck && day && currentYear && currentMonthIndex){
        const paddedMonth = String(currentMonthIndex + 1).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');
        const dateStr = `${currentYear}-${paddedMonth}-${paddedDay}`;
      
        const discountMatch = discountdataRange?.find(
          range => range.date === dateStr && range.cabin_ids.includes(selectedRoomId)
        );
      
        return discountMatch ? discountMatch.discount : null;
      }else{
        const discountMatch = discountdataRange?.find(
          range => range.date === dateTocheck && range.cabin_ids.map(String).includes(selectedRoomId)
        );
        return discountMatch ? discountMatch.discount : null;
      }
   
    }
  const monthsArray = useMemo(() => Array.from({ length: 12 * 10 }, (_, i) => i + 1), []);
  // Process bookings data
  const processedBookings = useMemo(() => {
    // if (!bookings?.data?.bookings) return { roomTypes: [], rooms: [], bookedDays: [], grouped: {} };
    if (!bookings?.data?.bookings) return { roomTypes: [], rooms: [], bookedDays: [], grouped: {}, allRooms: [] };

    const grouped: { [type: string]: { [cabin: string]: { [key: string]: any } } } = {};

    
    // Group bookings by type
    Object.values(bookings.data.bookings).forEach((typeGroup: any) => {
      Object.values(typeGroup).forEach((room: any) => {
        const typeId = room.type.toString();
        if (!grouped[typeId]) {
          grouped[typeId] = {};
        }
        grouped[typeId][room.cabin_id.toString()] = room;
      });
    });

    // Extract room types
    const roomTypes = Object.keys(grouped).map(typeId => {
      const firstRoom = Object.values(grouped[typeId])[0] as any;
      return {
        id: typeId,
        name_en: firstRoom.type_name_en,
        name_ar: firstRoom.type_name_ar
      };
    });

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (roomId: string, regularPrice: number) => {
    if (!discounts?.data?.discounts || discounts.data.discounts.length === 0) {
      return regularPrice;
    }

    const discount = discounts.data.discounts[0];
    const isRoomEligible = discount.cabin_ids.includes(roomId);
    
    if (isRoomEligible) {
      return regularPrice - (regularPrice * discount.discount / 100);
    }
    
    return regularPrice;
  };

    // Extract ALL rooms from ALL types
    const allRooms: any[] = [];
    Object.keys(grouped).forEach(typeId => {
      Object.values(grouped[typeId]).forEach((room: any) => {
        const discountedPrice = calculateDiscountedPrice(room.cabin_id.toString(), room.regular_price);
        allRooms.push({
          id: room.cabin_id.toString(),
          name: room.cabin_name,
          capacity: room.recommended_capacity,
          typeId: typeId,
          type_name_en: room.type_name_en,
          type_name_ar: room.type_name_ar,
          regular_price: room.regular_price,
          discounted_price: discountedPrice,
          has_discount: discountedPrice < room.regular_price
        });
      });
    });

    // Extract rooms for selected type (for dropdown)
    const rooms = selectedRoomType && grouped[selectedRoomType] 
      ? Object.values(grouped[selectedRoomType]).map((room: any) => {
        const discountedPrice = calculateDiscountedPrice(room.cabin_id.toString(), room.regular_price);
      return {
          id: room.cabin_id.toString(),
          name: room.cabin_name,
          capacity: room.recommended_capacity,
          regular_price: room.regular_price,
          discounted_price: discountedPrice,
          has_discount: discountedPrice < room.regular_price,
          price: discountedPrice // Keep for backward compatibility
        };
      })
      : [];
    // Extract booked days for selected room
    const bookedDays = selectedRoomType && selectedRoomId && grouped[selectedRoomType]?.[selectedRoomId]
      ? grouped[selectedRoomType][selectedRoomId].booked_days || []
      : [];

    return { roomTypes, rooms, bookedDays, grouped, allRooms };
  }, [bookings, selectedRoomType, selectedRoomId]);
  // Process bookings data


  // Auto-select first room type and room
  useEffect(() => {
    if (processedBookings.roomTypes.length > 0 && !selectedRoomType) {
      setSelectedRoomType(processedBookings.roomTypes[0].id);
    }
  }, [processedBookings.roomTypes, selectedRoomType]);

  useEffect(() => {
    if (processedBookings.rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(processedBookings.rooms[0].id);
    }
  }, [processedBookings.rooms, selectedRoomId]);

    useEffect(() => {
      let totalPriceZ = 0;
      Object.entries(roomRanges).map(([roomKey, ranges]) => {
        if (ranges.length === 0) return setTotalPrice({ rooms: 0 , breakfast : totalPrice.breakfast , amenities : totalPrice.amenities});
        totalPriceZ += ranges.reduce((acc, range) => acc + (range.price ?? 0), 0);
      });
      setTotalPrice({ rooms: totalPriceZ, breakfast: totalPrice.breakfast, amenities: totalPrice.amenities });
    }, [roomRanges]);

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

  type SelectedDay = { year: number; month: number; day: number };
  type Range = { start: SelectedDay; end: SelectedDay,price?: number };

  useEffect(() => {
    const selectedMonth = monthsArray[currentMonthIndex];
    const newMonthData = calculateMonthData(selectedMonth, currentYear);
    setMonthData(newMonthData);
  }, [currentMonthIndex, currentYear, calculateMonthData]);

  function areRangesEqual(a: Range[], newRanges: Range[]): boolean {
    if (!newRanges || !a) return false;
    let exists = false;
    newRanges.forEach(range => {
      const rangeB = a[0];
      if(
        range?.start.year === rangeB?.start.year &&
        range?.start.month === rangeB?.start.month &&
        range?.start.day === rangeB?.start.day &&
        range?.end.year === rangeB?.end.year &&
        range?.end.month === rangeB?.end.month &&
        range?.end.day === rangeB?.end.day
      ){
        exists = true
      }
    })
    return exists;
  }
  
  function shouldUpdateSelection(
    newSelectedRanges: { [key: string]: Range[] },
    selectedRanges: { [key: string]: Range[] }
  ): boolean {
    return Object.entries(newSelectedRanges).every(([key, newRanges]) => {
      const existingRanges = selectedRanges[key];
      return existingRanges && areRangesEqual(newRanges, existingRanges);
    });
  }
// 4. Updated auto-selection useEffect
// Updated useEffect for auto-selection
useEffect(() => {
  if (!startDate || !endDate || !numAdults || !processedBookings?.allRooms) {
    console.log("Required data not available")
    return;
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startDay = { 
    year: start.getFullYear(), 
    month: start.getMonth(),
    day: start.getDate() 
  };
  const endDay = { 
    year: end.getFullYear(), 
    month: end.getMonth(), 
    day: end.getDate() 
  };
  
  const suitableRooms = processedBookings?.allRooms?.filter(room => 
    room.capacity >= numAdults
  );
  
  if (suitableRooms?.length === 0) {
    console.log("No suitable rooms found for the number of adults");
    return;
  }
  
  let bestRoom = { typeId: "", id: "", discounted_price: 0 , regular_price: 0 };
  let maxAvailability = -1;
  const countAvailableDays = (room: { typeId: string | number; id: string | number; }) => {
    const roomData = (processedBookings.grouped as any)[room.typeId.toString()]?.[room.id];
    if (!roomData) return 0;
    
    const bookedDays = roomData.booked_days || [];
    const totalDays = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      // Format date to match the booked_days format (YYYY-MM-DD)
      const dateStr = currentDate.toISOString().split('T')[0];
      totalDays.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Filter out booked days - now comparing strings to strings
    const availableDays = totalDays.filter(dateStr => {
      return !bookedDays.includes(dateStr);
    });
    
    return availableDays.length;
  };
  suitableRooms?.forEach(room => {
    const availability = countAvailableDays(room);
    console.log(`Room ${room.id}: ${availability} available days`);
    if (availability > maxAvailability) {
      maxAvailability = availability;
      bestRoom = room;
    }
  });

  // Only proceed if we have full availability for the date range
  const totalDaysInRange = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (maxAvailability < totalDaysInRange) {
    console.log(`Not enough availability. Need ${totalDaysInRange} days, but only ${maxAvailability} available`);
    return;
  }
  
  const price = getDatesBetween(startDate, endDate).reduce((total, date) => {
    const dayData : any = getDiscountForDay(bestRoom.id, date);
    return total + (bestRoom.regular_price - ((dayData/100)*bestRoom.regular_price));
  }, 0);
  
  if (bestRoom && maxAvailability >= totalDaysInRange) {
    const newSelectedRanges = {
      [`${bestRoom.typeId}-${bestRoom.id}`]: [
        {
          start: startDay,
          end: endDay,
          price: price
        }
      ]
    };
    
    const alreadySelected = shouldUpdateSelection(newSelectedRanges, selectedRanges);
    if (!alreadySelected) {
      console.log("This is something new 👀");
      setRoomRanges(newSelectedRanges);
      setSelectedRanges(newSelectedRanges);
      setSelectedRoomId(bestRoom.id);
      setSelectedRoomType(bestRoom.typeId);
    } else {
      console.log("Bro, nothing's changed 💤");
    }
  } else {
    console.log("No available rooms found for the selected date range");
  }
}, [startDate, endDate, numAdults, discounts]);

  const goToPreviousMonth = () => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : monthsArray.length - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev < monthsArray.length - 1 ? prev + 1 : 0));
  };  

  // Get current room's ranges
  const currentRoomKey = `${selectedRoomType}-${selectedRoomId}`;
  const currentRoomRanges = roomRanges[currentRoomKey] || [];

  // Update ranges for current room
  const updateCurrentRoomRanges = (newRanges: Range[]) => {
    setRoomRanges(prev => ({
      ...prev,
      [currentRoomKey]: newRanges
    }));
    // Also update the global store for backward compatibility
     selectedRanges[currentRoomKey] = newRanges
      setSelectedRanges(selectedRanges);
  };

  const isPastDay = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonthIndex, day);
    return isBefore(selectedDate, startOfToday());
  };

  const isBookedDay = (day: number) => {
    const dateString = new Date(currentYear, currentMonthIndex, day).toISOString().split('T')[0];
    return processedBookings.bookedDays.includes(dateString);
  };

  const removeDayFromRanges = (dayToRemove: SelectedDay) => {
    const dayDate = new Date(dayToRemove.year, dayToRemove.month, dayToRemove.day);
    const updatedRanges: Range[] = [];

    currentRoomRanges.forEach(range => {
      const startDate = new Date(range.start.year, range.start.month, range.start.day);
      const endDate = new Date(range.end.year, range.end.month, range.end.day);

      // If day is outside this range, keep the range as is
      if (dayDate < startDate || dayDate > endDate) {
        updatedRanges.push(range);
        return;
      }

      // If day is at the start of range
      if (dayDate.getTime() === startDate.getTime()) {
        if (startDate.getTime() < endDate.getTime()) {
          // Move start to next day
          const nextDay = new Date(startDate);
          nextDay.setDate(nextDay.getDate() + 1);
          updatedRanges.push({
            start: { year: nextDay.getFullYear(), month: nextDay.getMonth(), day: nextDay.getDate() },
            end: range.end
          });
        }
        // If start === end, range is removed entirely
      }
      // If day is at the end of range
      else if (dayDate.getTime() === endDate.getTime()) {
        if (startDate.getTime() < endDate.getTime()) {
          // Move end to previous day
          const prevDay = new Date(endDate);
          prevDay.setDate(prevDay.getDate() - 1);
          updatedRanges.push({
            start: range.start,
            end: { year: prevDay.getFullYear(), month: prevDay.getMonth(), day: prevDay.getDate() }
          });
        }
      }
      // If day is in the middle of range, split into two ranges
      else {
        // First range: start to day-1
        const dayBefore = new Date(dayDate);
        dayBefore.setDate(dayBefore.getDate() - 1);
        updatedRanges.push({
          start: range.start,
          end: { year: dayBefore.getFullYear(), month: dayBefore.getMonth(), day: dayBefore.getDate() }
        });

        // Second range: day+1 to end
        const dayAfter = new Date(dayDate);
        dayAfter.setDate(dayAfter.getDate() + 1);
        updatedRanges.push({
          start: { year: dayAfter.getFullYear(), month: dayAfter.getMonth(), day: dayAfter.getDate() },
          end: range.end
        });
      }
    });
    const currentRoom: any  = processedBookings.rooms.find(room => room.id === selectedRoomId);
    updatedRanges.forEach(range => {
      const startDateR = new Date(range.start.year, range.start.month, range.start.day);
      const endDateR = new Date(range.end.year, range.end.month, range.end.day);
     range.price = getDatesBetween(startDateR, endDateR).reduce((total, date) => {
        const dayData : any = getDiscountForDay(selectedRoomId, date);
        return total + (currentRoom.regular_price - ((dayData/100)*currentRoom.regular_price));
      }, 0)
    })
    updateCurrentRoomRanges(updatedRanges);
  };
  const handleDayHover = (dayData: SelectedDay) => {
    if (pendingRangeStart) {
        const isDayDataPast = isPastDay(dayData.day);
        const isDayDataBooked = isBookedDay(dayData.day);
        const isDayDataInCompletedRange = isInCompletedRange(dayData.day);
        const isDayDataPendingStart = pendingRangeStart?.day === dayData.day && pendingRangeStart?.month === dayData.month && pendingRangeStart?.year === dayData.year;

        if (!isDayDataPast && !isDayDataBooked && !isDayDataInCompletedRange && !isDayDataPendingStart) {
            setHoveredEndDate(dayData);
        } else {
            setHoveredEndDate(null);
        }
    }
  };
  
 // 2. Updated handleDaySelection function to use discounted price
const handleDaySelection = (selectedDay: SelectedDay, discount = 100) => {
  setHoveredEndDate(null);
  
  if (isInCompletedRange(selectedDay.day)) {
    removeDayFromRanges(selectedDay);
    return;
  }

  if (!pendingRangeStart) {
    setPendingRangeStart(selectedDay);
  } else {
    // Get the current room's discounted price
    const currentRoom = processedBookings.rooms.find(room => room.id === selectedRoomId);
    const finalPrice = (currentRoom?.discounted_price ?? 0) * ((1- (discount / 100)) == 0?1:(1- (discount / 100)));
    let newRange: Range = {
      start: pendingRangeStart,
      end: selectedDay,
      price: finalPrice
    };

    // Ensure start <= end
    const startDate = new Date(newRange.start.year, newRange.start.month, newRange.start.day);
    const endDate = new Date(newRange.end.year, newRange.end.month, newRange.end.day);
    if (startDate > endDate) {
      newRange = {
        start: selectedDay,
        end: pendingRangeStart,
        price: finalPrice
      };
    }

    const toDate = (d: SelectedDay) => new Date(d.year, d.month, d.day);
    let mergedRange = { ...newRange };
    const updatedRanges: Range[] = [];

    for (const range of currentRoomRanges) {
      const currentStart = toDate(range.start);
      const currentEnd = toDate(range.end);
      const mergedStart = toDate(mergedRange.start);
      const mergedEnd = toDate(mergedRange.end);

      if (
        mergedEnd >= new Date(currentStart.getTime() - 86400000) &&
        mergedStart <= new Date(currentEnd.getTime() + 86400000)
      ) {
        mergedRange = {
          start: currentStart < mergedStart ? range.start : mergedRange.start,
          end: currentEnd > mergedEnd ? range.end : mergedRange.end,
          price: finalPrice
        };
      } else {
        updatedRanges.push(range);
      }
    }

    updatedRanges.push(mergedRange);
    updatedRanges.sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime());
    updatedRanges.forEach(range => {
      const startDateR = new Date(range.start.year, range.start.month, range.start.day);
      const endDateR = new Date(range.end.year, range.end.month, range.end.day);
     range.price = getDatesBetween(startDateR, endDateR).reduce((total, date) => {
        const dayData : any = getDiscountForDay(selectedRoomId, date);
        return total + ((currentRoom?.regular_price ?? 0) - ((dayData/100)*(currentRoom?.regular_price ?? 0)));
      }, 0)
    })
    updateCurrentRoomRanges(updatedRanges);
    setPendingRangeStart(null);
  }
};

  const isInPendingRange = (day: number) => {
    if (!pendingRangeStart) return false;
    
    const currentDay = new Date(currentYear, currentMonthIndex, day);
    const startDate = new Date(pendingRangeStart.year, pendingRangeStart.month, pendingRangeStart.day);
    
    return currentDay.getTime() === startDate.getTime();
  };

  const isInCompletedRange = (day: number) => {
    const currentDay = new Date(currentYear, currentMonthIndex, day);
    
    return currentRoomRanges.some(range => {
      const startDate = new Date(range.start.year, range.start.month, range.start.day);
      const endDate = new Date(range.end.year, range.end.month, range.end.day);
      
      return currentDay >= startDate && currentDay <= endDate;
    });
  };

  const clearAllRanges = () => {
    updateCurrentRoomRanges([]);
    setPendingRangeStart(null);
    setHoveredEndDate(null);
    // setSelectedRanges({});
  };

  const removeRange = (roomKey: string, indexToRemove: number) => {
    const currentRanges = roomRanges[roomKey] || [];
    const updated = currentRanges.filter((_, index) => index !== indexToRemove);
    setRoomRanges(prev => ({
      ...prev,
      [roomKey]: updated
    }));
    
    // also update the global store
    selectedRanges[roomKey] = updated
    setSelectedRanges(selectedRanges);
  };

  const baseWeekDaysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const baseWeekDaysAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  // Get day index of 1st day of month
  const firstDate = new Date(currentYear, currentMonthIndex, 1);
  const startIndex = firstDate.getDay(); // 0 (Sun) to 6 (Sat)

  // Rotate array to start from that index
  const reorderedDays = (
    Language === "en" ? baseWeekDaysEn : baseWeekDaysAr
  ).slice(startIndex).concat(
    (Language === "en" ? baseWeekDaysEn : baseWeekDaysAr).slice(0, startIndex)
  );

  // Get room name by room key
  const getRoomInfo = (roomKey: string) => {
    const [typeId, roomId] = roomKey.split('-');
    const room: any = processedBookings?.allRooms?.find(r => r.id === roomId && r.typeId === typeId);
    return room;
  };



  return (
    <MainLayout key={`calendar-${startDate}-${endDate}`}>
      <CalendarWrapper direction={Language}>
        <CalendarContainer>
          {/* Room Selection */}
          <SelectionContainer>
            <SelectGroup>
              <SelectLabel>
                {Language === "en" ? "Room Type:" : "نوع الغرفة:"}
              </SelectLabel>
              <Select 
                value={selectedRoomType} 
                onChange={(e) => {
                  setSelectedRoomType(e.target.value);
                  setSelectedRoomId(""); // Reset room selection
                }}
              >
                <option value="">
                  {Language === "en" ? "Select Room Type" : "اختر نوع الغرفة"}
                </option>
                {processedBookings.roomTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {Language === "en" ? type.name_en : type.name_ar}
                  </option>
                ))}
              </Select>
            </SelectGroup>

            {selectedRoomType && (
              <SelectGroup>
                <SelectLabel>
                  {Language === "en" ? "Room:" : "الغرفة:"}
                </SelectLabel>
                  <Select 
                    value={selectedRoomId} 
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      const room = processedBookings.rooms.find(r => r.id === e.target.value);
                      setSelectedRoomId(e.target.value);
                    }}
                  >
                    <option value="">
                      {Language === "en" ? "Select Room" : "اختر الغرفة"}
                    </option>
                    {processedBookings.rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {Language === "en" 
                          ? `Room ${room.name} (Capacity: ${room.capacity}) - ${
                              room.has_discount 
                                ? `${formatCurrency(room.regular_price)}/day discounts` 
                                : `${formatCurrency(room.regular_price)}/day`
                            }`
                          : `غرفة ${room.name} (السعة: ${room.capacity}) - ${
                              room.has_discount 
                                ? `${formatCurrency(room.discounted_price)}/يوم (${formatCurrency(room.regular_price)} مخفض)` 
                                : `${formatCurrency(room.regular_price)}/يوم`
                            }`
                        }
                      </option>
                    ))}
                  </Select>
              </SelectGroup>
            )}
          </SelectionContainer>

           {/* MODIFIED PART: Group arrows and header */}
        <MonthNavigationControls>
                <IconButton type="button" onClick={goToPreviousMonth} disabled={currentMonthIndex === monthsArray.length - 1} title={Language === "en" ? "Previous Month" : "الشهر السابق"}>
                {Language === 'ar' ? <FaArrowRight /> : <FaArrowLeft />}
              </IconButton>

          <MonthHeader>{monthData.monthName}</MonthHeader>
            {">"}
            <IconButton type="button" onClick={goToNextMonth} disabled={currentMonthIndex === 0} title={Language === "en" ? "Next Month" : "الشهر التالي"}>
                 {Language === 'ar' ? <FaArrowLeft /> : <FaArrowRight />}
              </IconButton>

        </MonthNavigationControls>
          
          {pendingRangeStart ? (
            <RangeStatus>
              {Language === "en" 
                ? "Select end date for range..." 
                : "اختر تاريخ النهاية للفترة..."}
            </RangeStatus>
          ) : (
            <RangeStatus>
              {Language === "en" 
                ? "Select start date for range..." 
                : "اختر تاريخ البدء للفترة..."}
            </RangeStatus>
          )}

          <Legend>
            <LegendItem>
              <LegendColor color="#dc3545" />
              <span>{Language === "en" ? "Booked" : "محجوز"}</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#007bff" />
              <span>{Language === "en" ? "Selected" : "مختار"}</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#28a745" />
              <span>{Language === "en" ? "Pending" : "في الانتظار"}</span>
            </LegendItem>
          </Legend>

          <WeekdaysHeader direction={Language}>
            {reorderedDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </WeekdaysHeader>
          
          <DaysGrid onMouseLeave={() => { if (pendingRangeStart) setHoveredEndDate(null); }}>
            {monthData.daysArray.map((day) => {
              const past = isPastDay(day);
              const booked = isBookedDay(day);
              const inPendingRange = isInPendingRange(day);
              const inCompletedRange = isInCompletedRange(day);
              const inDiscount = discountdataRange?.some(range => range.date == `${currentYear}-${currentMonthIndex + 1}-${day}` && range.cabin_ids.includes(selectedRoomId));
              const Discount = inDiscount ? discountdataRange?.find(range => range.date == `${currentYear}-${currentMonthIndex + 1}-${day}` && range.cabin_ids.includes(selectedRoomId))?.discount : 100;
              const isCurrentlyPendingStart = pendingRangeStart?.day === day && pendingRangeStart?.month === currentMonthIndex && pendingRangeStart?.year === currentYear;
              const isCurrentlyCompleted = isInCompletedRange(day);
              const isDisabledByNature = past || booked;

              let inHoverPreview = false;
              if (pendingRangeStart && hoveredEndDate && !isDisabledByNature && !isCurrentlyPendingStart && !isCurrentlyCompleted) {
                  const currentDayDate = new Date(currentYear, currentMonthIndex, day);
                  const startDate = new Date(pendingRangeStart.year, pendingRangeStart.month, pendingRangeStart.day);
                  const hoverDate = new Date(hoveredEndDate.year, hoveredEndDate.month, hoveredEndDate.day);
                  const tempRangeStart = startDate < hoverDate ? startDate : hoverDate;
                  const tempRangeEnd = startDate < hoverDate ? hoverDate : startDate;
                  if (currentDayDate >= tempRangeStart && currentDayDate <= tempRangeEnd) {
                      inHoverPreview = true;
                  }
              }
              
              const finalDisabled = isDisabledByNature;
              const finalSelected = isCurrentlyCompleted;
              const finalPending = isCurrentlyPendingStart;
              const finalHoverPreview = inHoverPreview;
              return (
                // Add discount indicator in DayBox JSX
                      <DayBox
                        key={day}
                        $isDisabled={finalDisabled.toString()}
                        $isSelected={finalSelected.toString()}
                        $isPending={finalPending.toString()}
                        $isBooked={booked.toString()}
                        $isHoverpreview={finalHoverPreview.toString()}
                        $hasDiscount={inDiscount.toString()} // Add this prop
                        onClick={() =>
                          finalDisabled ? null : handleDaySelection({ year: currentYear, month: currentMonthIndex, day }, Discount)
                        }
                        onMouseEnter={() => !finalDisabled && pendingRangeStart && handleDayHover({ year: currentYear, month: currentMonthIndex, day })}
                        title={
                          booked 
                            ? (Language === "en" ? "This day is already booked" : "هذا اليوم محجوز بالفعل")
                            : inDiscount
                              ? (Language === "en" ? `Discount available: ${discounts?.data?.discounts[0]?.discount}% off!` : `خصم متوفر: ${discounts?.data?.discounts[0]?.discount}% خصم!`)
                              : finalSelected
                                ? (Language === "en" ? "Click to remove from selection" : "انقر للإزالة من التحديد")
                                : ""
                        }
                      >
                        {day}
                        {inDiscount && <DiscountBadge>%</DiscountBadge>}
                      </DayBox>
              );
            })}
          </DaysGrid>
          
          {currentRoomRanges.length > 0 && (
            <ClearButton onClick={clearAllRanges}>
              {Language === "en" ? "Clear All Ranges" : "مسح جميع الفترات"}
            </ClearButton>
          )}
        </CalendarContainer>
      
      </CalendarWrapper>
      
      <FormWrapper>
       
          {/* Show all room ranges */}
          <AllRangesContainer>
          <SectionTitle>
            {Language === "en" ? "All Room Reservations" : "جميع حجوزات الغرف"}
          </SectionTitle>
          
          {Object.keys(roomRanges).length === 0 ? (
            <NoRangesMessage>
              {Language === "en" ? "No reservations selected yet" : "لم يتم تحديد أي حجوزات بعد"}
            </NoRangesMessage>
          ) : (
            Object.entries(roomRanges).map(([roomKey, ranges]) => {
              if (ranges.length === 0) return null;
              const roomInfo = getRoomInfo(roomKey);
              const isCurrentRoom = roomKey === currentRoomKey;
              const price = ranges.reduce((acc, range) => acc + (range.price ?? 0), 0);
                return (
                <RoomSection key={roomKey} iscurrentroom={isCurrentRoom.toString()}>
                  <RoomHeader iscurrentroom={isCurrentRoom.toString()}>
                    {roomInfo ? (
                      Language === "en" 
                        ? `${roomInfo.type_name_en} - Room ${roomInfo.name} (Capacity: ${roomInfo.capacity}) - ${formatCurrency(price)}`
                        : `${roomInfo.type_name_ar} - غرفة ${roomInfo.name} (السعة: ${roomInfo.capacity}) - ${formatCurrency(price)}`
                    ) : (
                      `Room ${roomKey}`
                    )}
                    {isCurrentRoom && (
                      <CurrentRoomBadge>
                        {Language === "en" ? "Currently Selected" : "محدد حالياً"}
                      </CurrentRoomBadge>
                    )}
                  </RoomHeader>
                  
                  <RangesContainer>
                    {ranges.map((range, idx) => {
                      return (
                      <RangeRow
                        key={idx}
                        style={{
                          direction: Language === "en" ? "ltr" : "rtl",
                        }}
                      >
                        <Input
                          readOnly
                          value={
                            `${new Date(range.start.year, range.start.month, range.start.day + 1)
                              .toISOString()
                              .split("T")[0]} ${format(
                              new Date(range.start.year, range.start.month, range.start.day + 1),
                              ", EEEE",
                              { locale: Language === "en" ? undefined : arSA }
                            )}`
                          }
                        />
                        <ArrowSeparator>{">"}</ArrowSeparator>
                        <Input
                          readOnly
                          value={
                            `${new Date(range.end.year, range.end.month, range.end.day + 1)
                              .toISOString()
                              .split("T")[0]} ${format(
                              new Date(range.end.year, range.end.month, range.end.day + 1),
                              ", EEEE",
                              { locale: Language === "en" ? undefined : arSA }
                            )}`
                          }
                        />
                        <RemoveButton 
                          type="button" 
                          onClick={() => removeRange(roomKey, idx)}
                          title={Language === "en" ? "Remove this range" : "إزالة هذه الفترة"}
                          
                        >
                           <CloseIcon  size={35}/>
                        </RemoveButton>
                      </RangeRow>
                    )})}
                  </RangesContainer>
                </RoomSection>
              );
            })
          )}
        </AllRangesContainer>
      </FormWrapper>
    </MainLayout>
  );
};

export default Calendar;

const MainLayout = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  padding: 0 15px;
   @media (min-width: 1200px) {
       flex-direction: row;
   }
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 0;
  }
`;

const CalendarWrapper = styled.div<{ direction: string }>`
  display: flex;
  align-items: center;
  direction: ${(props) => (props.direction === "en" ? "ltr" : "rtl")};
`;

const CalendarContainer = styled.div`
  background-color: var(--color-grey-900);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  @media (min-width: 1200px) {
    width: 100%;
  }
`;

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: var(--color-grey-800);
  border-radius: 1px;
`;

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectLabel = styled.label`
  color: var(--color-grey-50);
  font-weight: bold;
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--color-grey-600);
  border-radius: 5px;
  background-color: var(--color-grey-700);
  color: var(--color-grey-50);
  font-size: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--color-grey-50);
  font-size: 1rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;
const MonthNavigationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // This will place arrows at ends, header in middle
  width: 100%; // Ensure it spans the width to make space-between effective
  margin-bottom: 20px; // We'll move the MonthHeader's margin-bottom here
`;

// Adjust MonthHeader: remove its margin-bottom as it's now on MonthNavigationControls
// and allow it to grow to center the text properly between buttons.
const MonthHeader = styled.div`
  text-align: center;
  font-size: 1.5em;
  color: var(--color-grey-50);
  /* margin-bottom: 20px; */ /* REMOVED from here */
  flex-grow: 1; // Added to help center text when using space-between in parent
  padding: 0 10px; // Optional: adds some space so header text isn't too close to arrows
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

const IconButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0; // Adjusted for icon
  width: 40px; // Square for icon
  height: 40px; // Square for icon
  font-size: 1.2rem; // Icon size
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const RangeStatus = styled.div`
  text-align: center;
  color: #007bff;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const WeekdaysHeader = styled.div<{ direction: string }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--color-grey-50);
  direction: ${(props) => props.direction === "en" ? "ltr" : "rtl"};
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

// Update DayBox to handle discount styling
const DayBox = styled.div<{ 
  $isDisabled: string; 
  $isSelected: string; 
  $isPending?: string; 
  $isBooked?: string; 
  $isHoverpreview?: string;
  $hasDiscount?: string;
}>`
  width: 45px;
  height: 45px;
  line-height: 45px;
  border-radius: 50%;
  font-size: 2.0rem;
  text-align: center;
  position: relative;
  background-color: ${(props) =>
    props.$isBooked === "true"
      ? "#dc3545"
      : props.$isDisabled === "true"
        ? "#f1f1f1" 
        : props.$isPending === "true"
          ? "#28a745"
          : props.$isSelected === "true"
            ? "#007bff"
            : props.$isHoverpreview === "true"
              ? "#add8e6"
                : "#fff"};
  color: ${(props) => 
    props.$isBooked === "true" || props.$isSelected === "true" || props.$isPending === "true" || props.$isHoverpreview === "true" 
      ? "#fff" 
      : "#000"};
  border: ${(props) => 
    props.$isPending === "true" 
      ? "2px solid #28a745" 
      : props.$isBooked === "true"
        ? "2px solid #dc3545"
          : props.$isHoverpreview === "true" 
            ? "2px dashed #007bff" 
            : "1px solid #ccc"};
  opacity: ${(props) => (props.$isDisabled === "true" && props.$isBooked !== "true" ? 0.15 : 1)};
  cursor: ${(props) => 
    props.$isDisabled === "true" && props.$isBooked !== "true"
      ? "not-allowed" 
      : "pointer"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$isBooked === "true"
        ? "#dc3545"
        : props.$isDisabled === "true"
          ? "#f1f1f1" 
          : props.$isPending === "true"
            ? "#28a745"
            : props.$isSelected === "true" 
              ? "#007bff"
                : (props.$isHoverpreview === "true" || (props.$isDisabled !== "true" && props.$isBooked !== "true")) 
                  ? "#0056b3" 
                  : "#fff"};
    transform: ${(props) => 
      props.$isDisabled === "true" && props.$isBooked !== "true" 
        ? "none" 
        : "scale(1.05)"};
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4500;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const FormWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ClearButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #c82333;
  }
`;

// 2. Style your button to center the icon, add hover effects, etc.
const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: red; very very light red
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #e00; /* red on hover */
  }
`;

const RoomInfo = styled.div`
  background-color: var(--color-grey-800);
  color: var(--color-grey-50);
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-weight: bold;
  text-align: center;
`;


// const FormWrapper = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
//   max-height: 80vh;
//   overflow-y: auto;
// `;

const AllRangesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const SectionTitle = styled.h1`
  color: var(--color-grey-50);
   background-color: var(--color-grey-700);
  font-size: 1.6rem;
  margin: 0 0 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  padding-bottom: 1.5rem;
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid var(--color-grey-700);
`;

const NoRangesMessage = styled.div`
  background-color: var(--color-grey-800);
  color: var(--color-grey-300);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  font-style: italic;
`;

const RoomSection = styled.div<{ iscurrentroom: string }>`
  background-color: ${props => props.iscurrentroom === 'true' ? 'var(--color-grey-700)' : 'var(--color-grey-800)'};
  border: ${props => props.iscurrentroom === 'true' ? '2px solid #007bff' : '1px solid var(--color-grey-600)'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const RoomHeader = styled.div<{ iscurrentroom: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.iscurrentroom === 'true' ? '#007bff' : 'var(--color-grey-50)'};
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-grey-600);
`;

const CurrentRoomBadge = styled.span`
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: normal;
`;

const RangesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
`;

const ArrowSeparator = styled.h1`
  align-self: center;
  margin: 0 5px;
  color: var(--color-grey-50);
  font-size: 1.2rem;
`;