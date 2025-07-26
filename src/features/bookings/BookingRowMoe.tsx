"use client";

import { HiOutlineCalendarDays, HiOutlineChevronDown, HiOutlineChevronUp, HiPencil, HiTrash, HiEye, HiArrowDownOnSquare, HiCheck, HiArrowUpOnSquare } from "react-icons/hi2";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import styled from "styled-components";
import { useRef, useState } from "react";
import Link from "next/link";
// MODIFIED: Imported more helpers for advanced date checks
import { format, isToday, isWithinInterval, startOfDay } from "date-fns";
import {
    SpinnerMini,
    NewMenus as Menus,
    ConfirmDelete,
    Modal,
    Tag,
    ConfirmPayment,
} from "@/components/ui";
import { formatCurrency, formateDate } from "@/utils/helpers";
import { useGetProfile } from "@/hooks/authentication";
import { useRouter } from "next/navigation"; // Corrected import for App Router
import { useDeleteBooking } from "@/hooks/bookings";
import { useCheckin, useCheckout, usePay } from "@/hooks/check-in-out";
import React from "react";
import { Tr } from "@/components/ui/MoeTable";
// Helper to format dates
const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "MMM dd, yyyy");
};

// --- STYLED COMPONENTS (Unchanged) ---

const Div = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
    display: flex;
    align-items: center;
    gap: 0.8rem;
`;

const Stacked = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    & span:first-child { font-weight: 600; }
    & span:last-child { color: var(--color-grey-500); font-size: 1.2rem; }
`;

const Td = styled.td<{ bg?: string }>`
    // border: 0.2px solid;
    border-bottom: 1px solid var(--color-grey-100);
    padding: 1.2rem 2.4rem;
    background-color: ${props => `var(--color-${props.bg}-100)` || `var(--color-grey-0)`};
    white-space: normal;
    word-wrap: break-word;
    text-align: center;
    &:empty::before { content: "—"; }
`;

// --- TYPES (Unchanged) ---
type BookingCabin = {
    id: number; cabin_id: number; price: number; start_date: string; end_date: string; name: string;
    amenities: any; breakfast: [{ id: number; name: string;}]; type_name_en: string; type_name_ar: string; observation?: string;
};

type Booking = {
    id: string; created_at: string; is_paid: boolean; is_confirmed: boolean; total_price: number;
    full_name: string; guest_p: string; booking_cabins: BookingCabin[]; booking_activity_total: number;
    booking_activity_incomes: number; last_edit_user: string; check_in: string; check_out: string; observations: string | null;
};

type BookingRowProps = {
    BookingItem: Booking; isLoading?: boolean;
};

// --- COMPONENT ---

const BookingRow = React.memo(function BookingRow({ BookingItem, isLoading }: BookingRowProps) {
    const Language = useSettingsStore(state => state.Language);
    const router = useRouter(); // For navigation
    const [expanded, setExpanded] = useState(false);
    const { permissions, owner } = useGetProfile();
    const { deleteBooking, isDeleting, Tpromise:DeletePromise } = useDeleteBooking();
    const { checkin, isCheckingIn } = useCheckin();
    const { checkout, isCheckingOut } = useCheckout();
    const { pay, isPaying, Tpromise: PayPromise } = usePay();
    const getStayDetails = () => {
        if (!BookingItem.booking_cabins || BookingItem.booking_cabins.length === 0) {
            return { stay: "No cabins", startDate: null, endDate: null };
        }
        const allDates = BookingItem.booking_cabins.flatMap(c => [new Date(c.start_date), new Date(c.end_date)]);
        const startDate = new Date(Math.min(...allDates.map(d => d.getTime())));
        const endDate = new Date(Math.max(...allDates.map(d => d.getTime())));
        const daysz = BookingItem.booking_cabins.reduce((total, cabin) => total + (new Date(cabin.end_date).getTime() - new Date(cabin.start_date).getTime()) / (1000 * 60 * 60 * 24), BookingItem.booking_cabins.length);
        return {
            stay: `${daysz} day(s) in Room ${[...new Set(BookingItem.booking_cabins.map(cabin => cabin.name))].join(', ')}`,
            startDate: formatDate(startDate.toISOString()),
            endDate: formatDate(endDate.toISOString()),
        };
    };

    const { stay, startDate, endDate } = getStayDetails();

    if (isLoading) {
        return <tr><Td colSpan={20}><SpinnerMini /></Td></tr>;
    }
    const remaining_amount = (BookingItem.booking_activity_total * -1) - BookingItem.booking_activity_incomes
      const statusToTagName: any = {
        "unconfirmed": "red",
        "غير مؤكد": "red",
        "confirmed | paid Later": "blue",
        "مؤكد | الدفع لاحقا": "blue",
        "paid": "yellow",
        "مدفوع": "yellow",
        "paid-partly": "red",
        "مدفوع جزئيا": "red",
        "checked-in": "green",
        "تم الدخول": "green",
        "checked-out": "silver",
        "تم الخروج": "silver",
        "checked-in | paid Later": "red",
        "تم الدخول | الدفع لاحقا": "red",
        "checked-in | paid-partly": "green",
        "تم الدخول | مدفوع جزئيا": "green",
        "checked-out | paid Later": "silver",
        "تم الخروج | الدفع لاحقا": "silver",
    };
    const status = 
    BookingItem.is_confirmed 
        ? BookingItem.is_paid
            ? BookingItem.check_out !== null
                ? Language === "en" ? "checked-out": "تم الخروج"
            : BookingItem.check_in !== null
                ? Language === "en"? "checked-in": "تم الدخول"
            : Language === "en"? "paid": "مدفوع"
            // when partially paid or no payments are made
        : (BookingItem.booking_activity_total + BookingItem.total_price) !== 0
        ? BookingItem.check_in !== null ? Language === "en"? "checked-in | paid-partly": "تم الدخول | مدفوع جزئيا": Language === "en"? "paid-partly": "مدفوع جزئيا"
        : BookingItem.check_in !== null ? Language === "en"? "checked-in | paid Later": "تم الدخول | الدفع لاحقا": Language === "en"? "confirmed | paid Later": "مؤكد | الدفع لاحقا"
    : Language === "en"? "unconfirmed": "غير مؤكد";

  // Check if actions are available
    const canCheckin = BookingItem.check_in === null && (BookingItem.is_paid || BookingItem.is_confirmed);
    const canCheckout = BookingItem.check_in !== null && BookingItem.check_out === null && BookingItem.is_paid && remaining_amount >= 0;
    const canShowExtendMenu = BookingItem.check_in !== null && BookingItem.check_out === null;
    const bookingId = BookingItem.id;
        // A unique ID for the menu based on the booking ID
    const menuId = `booking-menu-${bookingId}`;
    return (
        <>
            {/* Main Booking Row */}
            <Tr key={bookingId}>
                <Td>
                    {BookingItem.booking_cabins?.length > 0 && (
                        <button onClick={() => setExpanded(prev => !prev)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                            {expanded ? <HiOutlineChevronUp size={22} /> : <HiOutlineChevronDown size={22} />}
                        </button>
                    )}
                </Td>
                <Td>{bookingId}</Td>
                <Td>
                <Link
                    href={`/guest/${BookingItem.guest_p}`}
                    style={{
                    textDecoration: "underline",
                    color: "inherit",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")} // blue-500
                    onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                >
                    {BookingItem.full_name}
                </Link>
                </Td>
                <Td>
                    <Div>
                        <HiOutlineCalendarDays />
                        <Stacked>
                            <span>{stay}</span>
                            <span>{startDate} &rarr; {endDate}</span>
                        </Stacked>
                    </Div>
                </Td>
                <Td>
                 <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
                </Td>
                <Td>
                    <Stacked>
                        <span>{formatCurrency(BookingItem.booking_activity_incomes)}</span>
                        <span>{formatCurrency(BookingItem.booking_activity_total * -1 + BookingItem.booking_activity_incomes)}</span>
                    </Stacked>
                </Td>
                <Td>
                    <Stacked>
                        <span>{formateDate(BookingItem.created_at, Language)[0]}</span>
                        <span>{formateDate(BookingItem.created_at, Language)[1]}</span>
                    </Stacked>
                </Td>
                <Td>{BookingItem.last_edit_user}</Td>
                {/* --- ACTION MENU CELL --- */}
                <Td>
                    {/* MODIFIED: The Menus provider now wraps the Modal as well to share context */}
                    <Menus>
                        <Modal>
                            <Menus.Menu>
                                {/* The Toggle button with a unique ID */}
                                <Menus.Toggle id={menuId} />

                                {/* The List that opens, with the SAME ID and the row ref */}
                                <Menus.List id={menuId} >

                                    {/* Action Button 1: View Details */}
                                    <Menus.Button 
                                        icon={<HiEye />}
                                        onClick={() => router.push(`/bookings/${bookingId}`)}
                                    >
                                        View Details
                                    </Menus.Button>

                                    {/* Action Button 2: Edit */}
                                    {(owner || permissions?.BookingWrite) && (
                                        <Menus.Button 
                                            icon={<HiPencil />}
                                            onClick={() => router.push(`/bookings/edit/${bookingId}`)}
                                        >
                                            Edit
                                        </Menus.Button>
                                    )}


                                {/* Confirmation and Payment Actions */}
                                {!BookingItem.is_paid && !BookingItem.is_confirmed && (
                                    <Modal.Open opens="Payment">
                                        <Menus.Button icon={<HiCheck />}>
                                            {Language === "en"
                                                ? "Confirm with Full Payment"
                                                : "تأكيد الحجز والدفع كاملا"}
                                        </Menus.Button>
                                    </Modal.Open>
                                )}
    
                                {!BookingItem.is_paid && (
                                    <Modal.Open opens="Payment-Part">
                                        <Menus.Button icon={<HiCheck />}>
                                            {BookingItem.is_confirmed
                                                ? Language === "en" ? "Add Payment" : "اضافة دفعة"
                                                : Language === "en" ? "Confirm with Partial Payment" : "تأكيد الحجز والدفع جزئيا"}
                                        </Menus.Button>
                                    </Modal.Open>
                                )}
    
                                {!BookingItem.is_confirmed && !BookingItem.is_paid && (
                                    <Modal.Open opens="Booking">
                                        <Menus.Button icon={<HiCheck />}>
                                            {Language === "en"
                                                ? "Confirm with Later Payment"
                                                : "تأكيد الحجز والدفع لاحقا"}
                                        </Menus.Button>
                                    </Modal.Open>
                                )}
    
                                {/* Check-in Action */}
                                {canCheckin && (
                                    <Menus.Button
                                        icon={<HiArrowDownOnSquare />}
                                        onClick={() => checkin(bookingId)}
                                        disabled={isCheckingIn}
                                    >
                                        {Language === "en" ? "Check in" : "دخول"}
                                    </Menus.Button>
                                )}
                                {/* Check-out Action */}
                                {canCheckout && (
                                    <Menus.Button
                                        icon={<HiArrowUpOnSquare />}
                                        onClick={() => checkout(bookingId)}
                                        disabled={isCheckingOut}
                                    >
                                        {Language === "en" ? "Check out" : "خروج"}
                                    </Menus.Button>
                                )}

                                {/* Action Button 3: Delete (opens a modal) */}
                                    {(owner || permissions?.BookingDelete) && (
                                        <Modal.Open opens="delete">
                                            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                                        </Modal.Open>
                                    )}
                                </Menus.List>
                                {/* Modal Windows */}
                                {/* <Modal.Window name="Extend Booking">
                                    <ConfirmAdding
                                        resourceName={booking}
                                        disabled={isExtending}
                                        isBooking
                                        onConfirm={handleExtendBooking}
                                    />
                                </Modal.Window> */}
            
                                <Modal.Window name="Payment">
                                    <ConfirmPayment
                                        resourceName={{ full_name : BookingItem.full_name, total_price : BookingItem.booking_activity_total }}
                                        disabled={isPaying}
                                        fixed={true}
                                        isLoading={isPaying}
                                        onConfirm={(amount: number, info : string) => pay({amount, bookingId, info: info})}
                                        promise={PayPromise}
                                    />
                                </Modal.Window>
            
                                <Modal.Window name="Payment-Part">
                                    <ConfirmPayment
                                        resourceName={{ full_name : BookingItem.full_name, total_price: BookingItem.booking_activity_total }}
                                        disabled={isPaying}
                                        fixed={false}
                                        isLoading={isPaying}
                                        onConfirm={(amount: number, info : string) => pay({amount, bookingId, info})}
                                        promise={PayPromise}
                                    />
                                </Modal.Window>
                                {/* The Modal Window for the delete confirmation */}
                                <Modal.Window name="delete">
                                    <ConfirmDelete
                                        resourceName={`Booking #${bookingId}`}
                                        Language={Language}
                                        disabled={false}
                                        onConfirm={() => deleteBooking(bookingId)}
                                        isLoading={isDeleting}
                                        promise={DeletePromise}
                                    />
                                </Modal.Window>

                            </Menus.Menu>
                        </Modal>
                    </Menus>
                </Td>
            </Tr>
            {/* Animated Expandable Row (Unchanged) */}
            {expanded && BookingItem.booking_cabins.map((cabin, index) => {
                // ... logic for expandable row remains the same ...
                const getCabinStatus = () => { 
                    //  if (cabin.status === 'occupied') return { text: 'Occupied', tagType: 'red' };
                    //  if (cabin.status === 'vacant') return { text: 'Vacant', tagType: 'green' };
                    //  if (cabin.status === 'reserved') return { text: 'Reserved', tagType: 'blue' };
                    //  if (cabin.status === 'booked') return { text: 'Booked', tagType: 'yellow' };
                    //  if (cabin.status === 'unavailable') return { text: 'Unavailable', tagType: 'gray' };
                    //  if (cabin.status === 'other') return { text: 'Other', tagType: 'default' };
                     return { text: '', tagType: 'default' }; 
                };
                const days = Math.round((new Date(cabin.end_date).getTime() - new Date(cabin.start_date).getTime()) / (1000 * 60 * 60 * 24))+1;
                const cabinStatus = getCabinStatus();
                return (
                    <tr key={cabin.id + cabin.name + cabin.start_date}>
                        <Td colSpan={20}>
                            <div style={{ display: "flex", flexDirection: "row", float: Language === "en" ? "left" : "right", gap: "50px", }}>
                                <strong>{index + 1 + "."}</strong>
                                <strong>
                                    {Language === "en" ? `${cabin.type_name_en} - ${cabin.name}` : `${cabin.type_name_ar} - ${cabin.name}`}
                                </strong>
                                <span>
                                    {formatDate(Language === "en" ? cabin.start_date : cabin.end_date)} {Language === "en" ? "→" : "←"} {formatDate(Language === "en" ? cabin.end_date : cabin.start_date)} - {Language === "en" ? `${days} days` : `${days} أيام`}
                                </span>
                                <span>
                                    <strong>{cabin.observation}</strong>
                                </span>
                                <Tag type={cabin.breakfast?.[0] ? "green" : "gray"}>
                                    {cabin.breakfast?.[0] ? Language === "en" ? "Breakfast Included" : "افطار مضاف" : Language === "en" ? "No Breakfast" : "لا يوجد افطار"}
                                </Tag>
                                {
                                    cabin.amenities && cabin.amenities.length > 0 && (
                                        <span>
                                            {cabin.amenities.map((amenity: any, idx: number) => (
                                                <Tag key={idx} type="blue" style={{ marginRight: "5px" }}>{amenity.name}</Tag>
                                            ))}
                                        </span>
                                    )
                                }
                                <span>
                                    {cabinStatus.text && (
                                        <Tag type={cabinStatus.tagType}>{cabinStatus.text}</Tag>
                                    )}
                                </span>
                            </div>
                        </Td>
                    </tr>
                );
            })}
        </>
    );
});

export default BookingRow;