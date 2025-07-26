"use client";
import { useMemo } from "react";
import styled from "styled-components";
import { format, isToday, differenceInDays } from "date-fns";
import {
    HiArrowDownOnSquare,
    HiArrowUpOnSquare,
    HiEye,
    HiTrash,
    HiCheck,
} from "react-icons/hi2";

import { useRouter } from 'next/navigation';

import {
    Table,
    ConfirmDelete,
    Modal,
    Menus,
    Tag,
    Button,
    ConfirmPayment,
    ConfirmAdding,
} from "@/components/ui";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";

import { useDeleteBooking, useExtendBooking } from "@/hooks/bookings";
import { useCheckout, usePay, useCheckin } from "@/hooks/check-in-out";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useSettings } from "@/hooks/settings";
import { useGetProfile } from "@/hooks/authentication";
import { useGetDrinks, useOrderDrinks } from "@/hooks/storage";
import React from "react";

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

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

const Amount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    font-size: 90%;
`;

const CabinDateRange = styled.div`
    padding: 0.2rem 0;
    border-bottom: 1px solid var(--color-grey-200);
    
    &:last-child {
        border-bottom: none;
    }
`;

// Improved type definitions
interface BookingCabin {
    id: number;
    booking_id: number;
    cabin_id: number;
    amenities: any;
    breakfast: boolean;
    price: number;
    start_date: string;
    end_date: string;
    cabin?: {
        name: string;
    };
}

interface BookingGuest {
    id: number;
    booking_id: number;
    guest_id: string;
    hotel_id: string;
    police_case_id: number;
    is_inside: boolean;
    left_at: string | null;
    guests?: {
        id: number;
        fullName: string;
        email: string;
        phoneNumber: string;
        nationalID?: string;
    };
}

interface BookingActivity {
    amount: number;
}

interface Booking {
    id: number;
    created_at: string;
    check_in: string | null;
    check_out: string | null;
    guest_p: string;
    is_paid: boolean;
    is_confirmed: boolean;
    observations: string | null;
    total_price: number;
    total_paid_price: number | null;
    full_name: string;
    booking_cabins: BookingCabin[];
    booking_guests: BookingGuest[];
    bookingActivity?: BookingActivity[];
}

interface BookingRowProps {
    booking: Booking;
}

// Status calculation hook
const useBookingStatus = (booking: Booking, language: string) => {
    return useMemo(() => {
        const { is_paid, is_confirmed, check_in, check_out, bookingActivity } = booking;
        
        // Calculate payment totals
        const total_paid_price = bookingActivity?.reduce(
            (total, item) => total + (item.amount > 0 ? item.amount : 0),
            0
        ) || booking.total_paid_price || 0;
        
        const total_price = bookingActivity?.reduce(
            (total, item) => total + (item.amount < 0 ? -item.amount : 0),
            0
        ) || booking.total_price;
        
        const remaining_balance = total_price - total_paid_price;
        const is_partially_paid = remaining_balance > 0 && total_paid_price > 0;

        // Status logic
        let status: string;
        
        if (check_out) {
            // Checked out
            if (is_partially_paid) {
                status = language === "en" ? "checked-out | paid-partly" : "تم الخروج | مدفوع جزئيا";
            } else if (is_paid || remaining_balance <= 0) {
                status = language === "en" ? "checked-out" : "تم الخروج";
            } else {
                status = language === "en" ? "checked-out | paid Later" : "تم الخروج | الدفع لاحقا";
            }
        } else if (check_in) {
            // Checked in
            if (is_partially_paid) {
                status = language === "en" ? "checked-in | paid-partly" : "تم الدخول | مدفوع جزئيا";
            } else if (is_paid || remaining_balance <= 0) {
                status = language === "en" ? "checked-in" : "تم الدخول";
            } else {
                status = language === "en" ? "checked-in | paid Later" : "تم الدخول | الدفع لاحقا";
            }
        } else {
            // Not checked in yet
            if (is_paid || remaining_balance <= 0) {
                status = language === "en" ? "paid" : "مدفوع";
            } else if (is_confirmed) {
                status = language === "en" ? "confirmed | paid Later" : "مؤكد | الدفع لاحقا";
            } else {
                status = language === "en" ? "unconfirmed" : "غير مؤكد";
            }
            
            if (is_partially_paid) {
                status = language === "en" ? "paid-partly" : "مدفوع جزئيا";
            }
        }
        const total = total_price - total_paid_price;
        const status1 = is_paid
            ? check_out !== null
                ? total !== 0
                    ? language === "en"
                        ? "checked-out | paid-partly"
                        : "تم الخروج | مدفوع جزئيا"
                    : language === "en"
                    ? "checked-out"
                    : "تم الخروج"
                : check_in !== null
                ? total !== 0
                    ? language === "en"
                        ? "checked-in | paid-partly"
                        : "تم الدخول | مدفوع جزئيا"
                    : language === "en"
                    ? "checked-in"
                    : "تم الدخول"
                : total !== 0
                ? language === "en"
                    ? "paid-partly"
                    : "مدفوع جزئيا"
                : language === "en"
                ? "paid"
                : "مدفوع"
            : is_confirmed
            ? check_out !== null
                ? language === "en"
                    ? "checked-out"
                    : "مدفوع | الدفع لاحقا"
                : check_in !== null
                ? language === "en"
                    ? "checked-in | paid Later"
                    : "تم الدخول | الدفع لاحقا"
                : language === "en"
                ? "confirmed | paid Later"
                : "مؤكد | الدفع لاحقا"
            : language === "en"
            ? "unconfirmed"
            : "غير مؤكد";
        return {
            status,
            total_paid_price,
            total_price,
            remaining_balance,
            is_partially_paid
        };
    }, [booking, language]);
};

// Cabin display component for better organization
const CabinDisplay: React.FC<{ cabins: BookingCabin[], language: string }> = ({ cabins, language }) => {
    // Group cabins by name and merge date ranges
    const groupedCabins = useMemo(() => {
        const groups: { [key: string]: BookingCabin[] } = {};
        
        cabins.forEach(cabin => {
            const cabinName = cabin.cabin?.name || `Cabin ${cabin.cabin_id}`;
            if (!groups[cabinName]) {
                groups[cabinName] = [];
            }
            groups[cabinName].push(cabin);
        });
        
        return groups;
    }, [cabins]);

    return (
        <Stacked>
            {Object.entries(groupedCabins).map(([cabinName, cabinBookings]) => (
                <CabinDateRange key={cabinName}>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>
                        {cabinName}
                    </div>
                    {cabinBookings.map((cabin, index) => {
                        const nights = differenceInDays(new Date(cabin.end_date), new Date(cabin.start_date));
                        return (
                            <div key={cabin.id} style={{ fontSize: '0.9rem', color: 'var(--color-grey-500)' }}>
                                {format(new Date(cabin.start_date), 'MMM dd')} → {format(new Date(cabin.end_date), 'MMM dd')} 
                                ({nights} {language === "en" ? "nights" : "ليالي"})
                                {cabin.breakfast && (
                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                                        🍳 {language === "en" ? "Breakfast" : "فطار"}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </CabinDateRange>
            ))}
        </Stacked>
    );
};

const Language = useSettingsStore(state => state.Language);

const BookingRow = React.memo(function BookingRow({ booking }: BookingRowProps) {
    const {
        id: bookingId,
        full_name: fullName,
        booking_guests: bookingGuests,
        booking_cabins: bookingCabins,
        is_paid,
        is_confirmed,
        check_in,
        check_out,
    } = booking;

    const navigate = useRouter();
    const { permissions, owner } = useGetProfile();
    const { deleteBooking, isDeleting } = useDeleteBooking();
    const { checkout, isCheckingOut } = useCheckout();
    const { checkin, isCheckingIn } = useCheckin();
    const { Pay, isPaying } = usePay();
    const { mutate: extend, isLoading: isExtending } = useExtendBooking();
    const { drinks } = useGetDrinks();
    const { orderDrinks, isLoading: isOrdering } = useOrderDrinks();
    const { settings } = useSettings();

    // Use the custom hook for status calculation
    const { status, total_paid_price, total_price, remaining_balance } = useBookingStatus(booking, Language);

    // Calculate total nights across all cabin bookings
    const totalNights = useMemo(() => {
        return bookingCabins.reduce((total, cabin) => {
            return total + differenceInDays(new Date(cabin.end_date), new Date(cabin.start_date));
        }, 0);
    }, [bookingCabins]);

    // Get guest IDs with national ID
    const guestsWithNationalId = useMemo(() => {
        return bookingGuests
            .filter(element => element.guests?.nationalID)
            .map(element => element.id);
    }, [bookingGuests]);

    // Status to tag color mapping
    const statusToTagName: { [key: string]: string } = {
        "unconfirmed": "red",
        "غير مؤكد": "red",
        "confirmed | paid Later": "blue",
        "مؤكد | الدفع لاحقا": "blue",
        "paid": "yellow",
        "مدفوع": "yellow",
        "paid-partly": "red",
        "مدفوع جزئيا": "red",
        "checked-in": "green",
        "تم الدخول": "green",
        "checked-in | paid-partly": "blue",
        "تم الدخول | مدفوع جزئيا": "blue",
        "checked-out | paid-partly": "red",
        "تم الخروج | مدفوع جزئيا": "red",
        "checked-out": "silver",
        "تم الخروج": "silver",
        "checked-in | paid Later": "green",
        "تم الدخول | الدفع لاحقا": "green",
        "checked-out | paid Later": "silver",
        "تم الخروج | الدفع لاحقا": "silver",
    };

    // Action handlers
    const handleCheckin = () => {
        checkin({
            bookingId,
            total_paid_price,
            guestsids: guestsWithNationalId,
        });
    };

    const handleCheckout = () => {
        checkout(bookingId);
    };

    const handlePayment = (amount: number, isPaid: boolean = true) => {
        Pay(
            {
                bookingId,
                guestsids: guestsWithNationalId,
                paid: isPaid,
                total_paid_price: amount,
            },
            {
                onSettled: () => navigate.push("/bookings"),
            }
        );
    };

    const handleExtendBooking = (id: number, totalcost: number, date: string) => {
        const obj = {
            id,
            TotalPrice: totalcost + total_price,
            date,
            ExtensionCost: totalcost,
        };
        extend(obj);
    };

    const handleOrderDrink = (drink: any, quantity: number) => {
        orderDrinks({
            item: drink,
            quantity,
            bookingId,
        });
    };

    // Check if actions are available
    const canCheckin = check_in === null && (is_paid || is_confirmed);
    const canCheckout = check_in !== null && check_out === null && is_paid && remaining_balance <= 0;
    const canShowExtendMenu = check_in !== null && check_out === null;

    return (
        <Table.Row>
            <Cabin>{bookingId}</Cabin>
            
            <CabinDisplay cabins={bookingCabins} language={Language} />
            
            <Stacked>
                <span>{fullName}</span>
            </Stacked>

            <Stacked>
                <span>
                    {Language === "en" ? "→" : "←"} {totalNights}{" "}
                    {Language === "en" ? "night stays" : "ليالي"}
                </span>
            </Stacked>

            <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
            
            <Stacked>
                <Amount>{formatCurrency(total_paid_price)}</Amount>
                <span>{formatCurrency(total_price)}</span>
                {remaining_balance > 0 && (
                    <span style={{ color: 'var(--color-red-700)', fontSize: '0.8rem' }}>
                        {Language === "en" ? "Remaining: " : "المتبقي: "}{formatCurrency(remaining_balance)}
                    </span>
                )}
            </Stacked>

            {!(isPaying || isExtending) && (
                <Modal>
                    <Menus.Menu>
                        <Menus.Toggle
                            id={bookingId.toString()}
                        />
                        <Menus.List id={bookingId.toString()}>
                            <Menus.Button
                                icon={<HiEye />}
                                onClick={() => navigate.push(`/bookings/${bookingId}`)}
                            >
                                {Language === "en" ? "See details" : "التفاصيل"}
                            </Menus.Button>

                            {/* Confirmation and Payment Actions */}
                            {!is_paid && !is_confirmed && (
                                <Modal.Open opens="Payment">
                                    <Menus.Button icon={<HiCheck />}>
                                        {Language === "en"
                                            ? "Confirm with Full Payment"
                                            : "تأكيد الحجز والدفع كاملا"}
                                    </Menus.Button>
                                </Modal.Open>
                            )}

                            {(!is_paid || is_confirmed) && remaining_balance > 0 && (
                                <Modal.Open opens="Payment-Part">
                                    <Menus.Button icon={<HiCheck />}>
                                        {is_confirmed
                                            ? Language === "en" ? "Add Payment" : "اضافة دفعة"
                                            : Language === "en" ? "Confirm with Partial Payment" : "تأكيد الحجز والدفع جزئيا"}
                                    </Menus.Button>
                                </Modal.Open>
                            )}

                            {!is_confirmed && !is_paid && (
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
                                    onClick={handleCheckin}
                                    disabled={isCheckingIn}
                                >
                                    {Language === "en" ? "Check in" : "دخول"}
                                </Menus.Button>
                            )}

                            {/* Extend Booking and Drinks Menu */}
                            {canShowExtendMenu && (
                                <Modal.Open opens="Extend Booking">
                                    <Menus.Button
                                        icon={<HiArrowDownOnSquare />}
                                        submenu={{
                                            id: `${bookingId}-main`,
                                            children: (
                                                <>
                                                    <Menus.Button
                                                        icon={<HiArrowDownOnSquare />}
                                                        submenu={{
                                                            id: `${bookingId}-extend`,
                                                            children: (
                                                                <>
                                                                    {[1, 2, 3, 4, 5].map((days) => (
                                                                        <Menus.Button
                                                                            key={`extend-${days}`}
                                                                            icon={<HiArrowDownOnSquare />}
                                                                            onClick={() => console.log(`Extend ${days} days`)}
                                                                        >
                                                                            {Language === "en" ? `${days} days` : `${days} ايام`}
                                                                        </Menus.Button>
                                                                    ))}
                                                                </>
                                                            ),
                                                        }}
                                                    >
                                                        {Language === "en" ? "Extend Booking" : "تمديد الحجز"}
                                                    </Menus.Button>

                                                    <Menus.Button
                                                        icon={<HiArrowDownOnSquare />}
                                                        submenu={{
                                                            id: `${bookingId}-drinks`,
                                                            children: (
                                                                <>
                                                                    {drinks?.data?.storage?.[0]?.map((drink: any) => (
                                                                        drink.storageActivity?.[0]?.sum > 0 && (
                                                                            <Menus.Button
                                                                                key={`drink-${drink.name}`}
                                                                                icon={<HiArrowDownOnSquare />}
                                                                                submenu={{
                                                                                    id: `${bookingId}-${drink.name}`,
                                                                                    children: (
                                                                                        <>
                                                                                            {[1, 2, 3, 4].map((quantity) => (
                                                                                                drink.storageActivity[0].sum >= quantity && (
                                                                                                    <Menus.Button
                                                                                                        key={`${drink.name}-${quantity}`}
                                                                                                        icon={<HiArrowDownOnSquare />}
                                                                                                        onClick={() => handleOrderDrink(drink, quantity)}
                                                                                                    >
                                                                                                        {Language === "en"
                                                                                                            ? `${quantity} ${drink.name} - ${formatCurrency(drink.cost * quantity)}`
                                                                                                            : `${quantity} \u202B${drink.name}\u202C - ${formatCurrency(drink.cost * quantity)}`}
                                                                                                    </Menus.Button>
                                                                                                )
                                                                                            ))}
                                                                                        </>
                                                                                    ),
                                                                                }}
                                                                            >
                                                                                {drink.name}
                                                                            </Menus.Button>
                                                                        )
                                                                    ))}
                                                                </>
                                                            ),
                                                        }}
                                                    >
                                                        {Language === "en" ? "Drinks" : "مشروب"}
                                                    </Menus.Button>
                                                </>
                                            ),
                                        }}
                                    >
                                        {Language === "en" ? "Add" : "اضافة"}
                                    </Menus.Button>
                                </Modal.Open>
                            )}

                            {/* Check-out Action */}
                            {canCheckout && (
                                <Menus.Button
                                    icon={<HiArrowUpOnSquare />}
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                >
                                    {Language === "en" ? "Check out" : "خروج"}
                                </Menus.Button>
                            )}

                            {/* Delete Action - Uncomment if needed */}
                            {/* {(permissions.BookingDelete || owner) && (
                                <Modal.Open opens="delete">
                                    <Menus.Button icon={<HiTrash />}>
                                        {Language === "en" ? "Delete booking" : "حذف"}
                                    </Menus.Button>
                                </Modal.Open>
                            )} */}
                        </Menus.List>
                    </Menus.Menu>

                    {/* Modal Windows */}
                    <Modal.Window name="Extend Booking">
                        <ConfirmAdding
                            resourceName={booking}
                            disabled={isExtending}
                            isBooking
                            onConfirm={handleExtendBooking}
                        />
                    </Modal.Window>

                    <Modal.Window name="Payment">
                        <ConfirmPayment
                            resourceName={{ fullName, total_price }}
                            disabled={isPaying}
                            fixed={true}
                            onConfirm={(amount: number) => handlePayment(amount, true)}
                        />
                    </Modal.Window>

                    <Modal.Window name="Payment-Part">
                        <ConfirmPayment
                            resourceName={{ fullName, total_price: remaining_balance }}
                            disabled={isPaying}
                            fixed={false}
                            onConfirm={(amount: number) => handlePayment(amount, true)}
                        />
                    </Modal.Window>

                    <Modal.Window name="Booking">
                        <ConfirmPayment
                            fixed={false}
                            ConfirmationMessage={
                                Language === "en"
                                    ? `Are you sure to confirm booking #${bookingId} without payment?`
                                    : `هل انت متأكد من تأكيد الحجز #${bookingId} بدون دفع؟`
                            }
                            resourceName={{ fullName, total_price }}
                            disabled={isPaying}
                            onConfirm={() => handlePayment(0, false)}
                        />
                    </Modal.Window>

                    <Modal.Window name="delete">
                        <ConfirmDelete
                            resourceName=""
                            disabled={isDeleting}
                            onConfirm={() => deleteBooking(bookingId)}
                        />
                    </Modal.Window>
                </Modal>
            )}
        </Table.Row>
    );
});

export default BookingRow;