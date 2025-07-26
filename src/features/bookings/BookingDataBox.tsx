"use client";
import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
    HiOutlineChatBubbleBottomCenterText,
    HiOutlineCheckCircle,
    HiOutlineCurrencyDollar,
    HiOutlineHomeModern,
    HiOutlineUsers,
} from "react-icons/hi2";
import {FaListAlt} from 'react-icons/fa';
import { Button, DataItem, Flag, SpinnerMini } from "@/components/ui";

import { formatDistanceFromNow, formatCurrency , formateDate} from "@/utils/helpers";

import { TableContainer, Th, TableBox } from "@/components/ui";

const StyledBookingDataBox = styled.section`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    margin: 2rem auto;

    overflow: hidden;
`;

const Header = styled.header`
    background-color: var(--color-brand-600);
    padding: 2rem 4rem;
    color: #e0e7ff;
    font-size: 1.8rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;

    svg {
        height: 3.2rem;
        width: 3.2rem;
    }

    & div:first-child {
        display: flex;
        align-items: center;
        gap: 1.6rem;
        font-weight: 600;
        font-size: 1.8rem;
    }

    & span {
        font-family: "Sono";
        font-size: 2rem;
        margin-left: 4px;
    }
`;

const Section = styled.section`
    padding: 3.2rem 4rem 1.2rem;
`;

const Guest = styled.div`
    display: flex;
    align-items: right;
    gap: 1.2rem;
    margin-bottom: 1.6rem;
    color: var(--color-grey-500);

    & p:first-of-type {
        font-weight: 500;
        color: var(--color-grey-700);
    }
`;

const Price = styled.div<{ $isPaid: string }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.6rem 3.2rem;
    border-radius: var(--border-radius-sm);
    margin-top: 2.4rem;

    background-color: ${(props) => props.$isPaid === "true" ? "var(--color-green-100)" : "var(--color-red-700)"};
    color: ${(props) => props.$isPaid === "true" ? "var(--color-green-700)" : "white"};

    & p:last-child {
        text-transform: uppercase;
        font-size: 1.4rem;
        font-weight: 600;
    }

    svg {
        height: 2.4rem;
        width: 2.4rem;
        color: currentColor !important;
    }
`;

const Footer = styled.footer`
    padding: 1.6rem 4rem;
    font-size: 1.2rem;
    color: var(--color-grey-500);
    text-align: right;
`;
const Th1 = styled.th`
    border: 2px solid;
    padding: 10px;
    `
const Td = styled.td<any>`
    // border: 2px solid ${(props) => props.color};
    padding: 10px;
    `
const Stacked = styled.div`
display: flex;
flex-direction: column;

gap: 0.2rem;

& span:first-child {
    font-weight: 500;
}

& span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
}
`;
import { useCheckin } from "@/hooks/check-in-out";

import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useGuestLeftEnters , useUpdatePoliceCase } from "@/hooks/check-in-out";
import { useSettings } from '@/hooks/settings'
import { useDarkMode } from "@/hooks";
import { Input } from "@/components/form";
import { Booking } from "@/utils/types";
import { useDeleteBookingActivity } from "@/hooks/bookings";
import { LoadingRow, Tr } from "@/components/ui/MoeTable";
// A purely presentational component
function BookingDataBox({booking} : {booking: any}) {
    const { 
            id : booking_id,
            booking_cabins,
            booking_guests,
            booking_activity,
            created_at,
            start_date,
            end_date,
            check_in,
            check_out,
            booking_activity_total,
            total_price,
            observations,
            is_paid,
            is_confirmed,
            full_name,
            nationality,
            national_id,
            country_flag,
            phone_number,
            email,
    } = booking?.data?.bookings?.[0];
    booking_guests?.sort((a:any, b:any) => a.guestId - b.guestId);
    const uniqueGuests = booking_guests?.filter((guest:any, index:any, self:any) =>
        index === self.findIndex((g:any) => g.guestId === guest.guestId)
      );
    const PoliceCases = booking_guests?.map((guest:any) => guest.police_case_id);
    const daysDiff: any = Math.round(
        (new Date(end_date).getTime() - new Date(start_date).getTime()) /
            (1000 * 60 * 60 * 24)
    );
    const amenitiesCost = booking_cabins?.reduce(
        (totalCost: number, cabin: any) => {
            const cabinCost =
                cabin.amenities != null
                    ? cabin.amenities.reduce(
                          (cabinTotal: number, amenity: any) => {
                              return cabinTotal + amenity.cost * amenity.day;
                            },
                          0
                      )
                    : 0;
            return totalCost + cabinCost;
        },
        0
    );
    // const {isDarkMode}= useDarkMode();
    const Language = useSettingsStore(state => state.Language);
    const {settings}=useSettings();
    const {LeftEnters,isLoading:isLeftEntering} = useGuestLeftEnters();
    const {updatePoliceId,isLoading} = useUpdatePoliceCase();
    const {deleteActivity,isDeleting} = useDeleteBookingActivity();
    return (
        <StyledBookingDataBox>
            <Header>
                <div>{booking_activity_total} {total_price} {booking_activity_total+total_price}</div>
                {/* <div>
                    <HiOutlineHomeModern />
                    <p>
                        {daysDiff} 
                        {Language === "en" ? "day/s" : `${daysDiff<1?"يوم":daysDiff<10?"أيام":"يوم"}`}
                        {" "}
                        {Language === "en" ? " → " : " ← "}
                        <span>
                            {" "}
                            {Language === "en" ? "Room" : "غرفة"}
                            {" "}
                            {booking_cabins?.map((cabin: any, index: any) => {
                                return `${cabin.name}${
                                    index === booking_cabins.length - 1
                                        ? ""
                                        : ", "
                                } `;
                            })}{" "}
                        </span>
                    </p>
                </div> */}

                {/* <p>
                   {Language==="en"?
                   `${formatDistanceFromNow(start_date, Language).includes("ago") ? "Booking started" : "Booking Starts"}`
                   :`${formatDistanceFromNow(start_date, Language).includes("منذ") ? "بدا الحجز" : "يبدا الحجز"}`}
                   {" "}
                    {isToday(new Date(start_date))
                        ? Language === "en"
                            ? "Today"
                            : "اليوم"
                        : formatDistanceFromNow(start_date, Language)}{" - "}
                    {formateDate(Language === "en" ? start_date : end_date,Language)}
                    {" "}
                    {Language === "en" ? " → " : " ← "}
                    {formateDate(Language === "en" ? end_date : start_date,Language)}
                </p> */}
            </Header>

            <Section>
                <Guest>
                    {country_flag && (
                        <Flag
                            src={country_flag}
                            alt={`Flag of ${nationality}`}
                        />
                    )}
                    <p>
                        {full_name}{" "}
                        {(uniqueGuests.length) > 1
                            ? `+ ${uniqueGuests.length-1} ${Language === "en" ? "guests" : "نزلاء"} `
                            : ""}

                    </p>
                    <span>&bull;</span>
                    <p>{phone_number}</p>
                    <span>&bull;</span>
                    <p>
                        {Language === "en" ? "National ID :" : "رقم البطاقة : "}{" "}
                        {national_id}
                    </p>
                </Guest>

                {observations && (
                    <DataItem
                        icon={<HiOutlineChatBubbleBottomCenterText />}
                        label={
                            Language === "en" ? "Observations :" : "الملاحظات : "
                        }
                    >
                        {observations}
                    </DataItem>
                )}
                 {uniqueGuests.length > 1 && (
                    <>
                    <DataItem
                        icon={<HiOutlineUsers />}
                        label={Language === "en" ? "Guests :" : "النزلاء :"}
                    >
                    {uniqueGuests.map((guest: any, index: any) => {
                        return `${guest.full_name}`
                    }).join(", ")}   
                    </DataItem>
                    </>
                )}
                  <DataItem
                        icon={<FaListAlt />}
                        label={Language === "en" ? "Guests Record :" : "سجل النزلاء :"}
                    >
                    </DataItem>
                    {
                    <TableContainer style={{ overflowX: 'auto',maxHeight: '600px'}}>
                        <TableBox style={{ minWidth: '600px',width:"100%",textAlign: 'center' }}>
                        <thead>
                          <tr>
                            <Th>{Language === "en" ? "Guest Name" : "اسم الضيف"}</Th>
                            <Th>{Language === "en" ? "Police Case Id" : "رقم ملف الشرطة"}</Th>
                            <Th>{Language === "en" ? "Action" : "تغير الحالة"}</Th>
                            <Th>{Language === "en" ? "Arrived in" : "تاريخ الوصول"}</Th>
                            <Th>{Language === "en" ? "Left out" : "تاريخ الخروج"}</Th>
                            <Th>{Language === "en" ? "Status" : "الحالة"}</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {booking_guests.map((guest:any, index:any) => (
                            <Tr key={guest.id+" "+guest.bg_id+" "+index}>
                            <Td>{guest.full_name}</Td>
                            {is_confirmed&&(check_in) && 
                              <>
                              <Td><Input style={{textAlign: 'center',width:'auto'}} onBlur={(e)=>updatePoliceId({guestId:guest.id,id:e.target.value,ids:PoliceCases})} disabled={!guest.is_inside} min={Math.min(...PoliceCases)} max={Math.max(...PoliceCases)} defaultValue={guest.police_case_id} type="number"></Input></Td>
                              {(check_out || !booking_guests.every((bguest:any) => guest.bg_id >= bguest.bg_id)) ? <Td></Td>:<Td><Button disabled={isLeftEntering} onClick={() => LeftEnters({guestId:guest.guest_id,bookingId:booking_id,action:guest.is_inside?"left":"enters"})}>{isLeftEntering ? <SpinnerMini /> : Language === 'en' ? guest.is_inside ? 'Left' : 'Arrived' :guest.is_inside ? 'مغادرة' : 'وصول'}</Button></Td>}
                              <Td>{(check_in||created_at) && (formateDate(guest.bg_created_at,Language)[1]+" - "+formateDate(guest.bg_created_at,Language)[0])}</Td>
                              <Td>{(guest.is_inside && guest.national_id !== null) ? null:guest.national_id !== null&& (formateDate(guest.left_at,Language)[1]+" - "+formateDate(guest.left_at,Language)[0])}</Td>
                              <Td><p style={{color:guest.is_inside?"green":"red"}}>{(guest.is_inside ? Language === "en" ? "Staying":"مقيم" : Language === "en" ? "Left":"غادر")}</p></Td>
                              </>
                              }
                            </Tr>
                          )
                        )}
                        </tbody>
                      </TableBox>    
                    </TableContainer>                  
                    }
                    <DataItem
                        icon={<FaListAlt />}
                        label={
                            Language === "en"
                                ? "Booked Rooms :"
                                : "غرف الحجز : "
                        }
                    >
                    </DataItem>
                 {booking_cabins.map((cabin: any) => (
                    <div key={cabin.bc_id}>
                      <div style={{ backgroundColor: "black",height:"1px",width:"100%" }}></div>
                        <DataItem
                            key={cabin.id}
                            // icon={<HiOutlineCheckCircle />}
                            label={` ${Language === "en" ? "Room" : "غرفة"} 
                            ${cabin.name + " ,"}
                            ${Language==="en"?
                    `${formatDistanceFromNow(cabin.start_date, Language).includes("ago") ? "Booking started" : "Booking Starts"}`
                   :`${formatDistanceFromNow(cabin.start_date, Language).includes("منذ") ? "بدا الحجز" : "يبدا الحجز"}`
                   }
                            ${isToday(new Date(cabin.start_date))
                                    ? Language === "en"
                                        ? "Today"
                                        : "اليوم"
                                    : formatDistanceFromNow(cabin.start_date, Language)}
                            ${`-
                            ${formateDate(cabin.start_date,Language)[0]}
                            ${Language === "en" ? " → " : " ← "}
                            ${formateDate(cabin.end_date,Language)[0]}
                            `}
                            ${
                                cabin.breakfast ? `+ ${Language === "en" ? "Breakfast" : "افطار"}` : ""
                            } 
                            ${cabin.amenities != null ? " + " : ""}
                            ${
                                cabin.amenities != null
                                    ? cabin.amenities
                                          .map((amenity: any) => {
                                              return `${amenity.name}`;
                                          })
                                          .join(", ")
                                    : ""
                            }`}
                        ></DataItem>
                    </div>
                ))}
                 <div style={{ backgroundColor: "black",height:"1px",width:"100%" }}></div>
                 <DataItem
                        icon={<HiOutlineCurrencyDollar />}
                        label={
                            Language === "en"
                                ? "Payments Logs :"
                                : "سجل الدفعات : "
                        }
                    >
                    </DataItem>
                    {
                    <TableContainer style={{ overflowX: 'auto',maxHeight: '600px'}}>
                      <TableBox style={{minWidth: '600px',textAlign: 'center' }}>
                        <thead>
                          <tr>
                            <Th>{Language === "en" ? "id" : "id"}</Th>
                            <Th>{Language === "en" ? "amount" : "المبلغ"}</Th>
                            <Th>{Language === "en" ? "Activity Date" : "تاريخ العملية"}</Th>
                            <Th>{Language === "en" ? "name" : "الاسم"}</Th>
                            <Th>{Language === "en" ? "info" : "وصف"}</Th>
                            <Th>{Language === "en" ? "User" : "الموظف"}</Th>
                            <Th>{Language === "en" ? "Action" : "تغير الحالة"}</Th>
                          </tr>
                        </thead>
                        <tbody>
                            {booking_activity?.map((Activity:any,index:any) => (
                                <Tr key={Activity.ba_id+" "+index}>
                                    <Td>{Activity.ba_id}</Td>
                                    <Td><p style={{color:Activity.amount<0?"red":"green"}}>{formatCurrency(Activity.amount)}</p></Td>
                                    <Td>{formateDate(Activity.ba_created_at,Language)[1]+" - "+formateDate(Activity.ba_created_at,Language)[0]}</Td>
                                    <Td>{Activity?.storage?.name ||(Activity.cabin_id ? Language === "en" ? `Room ${Activity?.cabin_id}` : `غرفة ${Activity?.cabin_id}` : null ) || Activity?.amenities?.name || "-"}</Td>
                                    <Td>{Activity.info}</Td>
                                    <Td>{Activity?.full_name}</Td>
                                    <Td><Button onClick={() =>deleteActivity(Activity.ba_id)}>Delete</Button></Td>
                                </Tr>
                            ))}
                        </tbody>
                      </TableBox> 
                    </TableContainer>                     
                    }
                        
                <Price $isPaid={is_paid.toString()}>
                    <DataItem
                        icon={<HiOutlineCurrencyDollar />}
                        label={
                            Language === "en" ? "price :" : "السعر الكلي : "
                        }
                    >
                    {`${formatCurrency(total_price*((100+settings!.data!.settings.vat)/100))}
                      
                    (${formatCurrency(
                        total_price - amenitiesCost
                    )} ${
                        Language === "en" ? "Room" : "الغرف/ة"
                    } + ${formatCurrency(amenitiesCost)} ${
                        Language === "en" ? "Amenities" : " الخدمات المضافة"
                    } + ${formatCurrency(
                        total_price*((settings!.data!.settings.vat)/100)
                    )}  ${Language === "en" ? "VAT" : "الضريبة"})`}
                    <p> : {is_paid ? Language === "en" ? "Paid" : "مدفوع" : Language === "en" ? "Unpaid" : "غير مدفوع"}</p>
                    </DataItem>
                </Price>
            </Section>

            <Footer>
                <p>
                    {Language === "en"? "Booked on" : "تم الحجز في"}
                    {" "}
                    {formateDate(created_at,Language)}
                </p>
            </Footer>
        </StyledBookingDataBox>
    );
}

export default BookingDataBox;
