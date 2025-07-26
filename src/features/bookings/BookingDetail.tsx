"use client";
import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";

import { useMoveBack } from "@/hooks";
import { useBooking, useDeleteBooking } from "@/hooks/bookings";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useSettings } from "@/hooks/settings";
import  { useGetProfile } from "@/hooks/authentication";
import { Heading } from "@/components/typography";
import { Row } from "@/components/layout";
import {
    Spinner,
    ConfirmDelete,
    ConfirmPayment,
    Empty,
    Modal,
    Button,
    Tag,
    ButtonGroup,
    ButtonText,
    InvoiceMaker,
} from "@/components/ui";
import { useDarkMode } from "@/hooks";

import { useEffect, useRef } from "react";

import { useParams, useRouter } from "next/navigation";
import { useCheckin, useCheckout, usePay } from "@/hooks/check-in-out";
import { formatCurrency } from "@/utils/helpers";

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;
// const Component = () => {
//     const targetRef: any = useRef();
//     const handlePrint = useReactToPrint({
//         content: () => targetRef.current,
//         documentTitle: "page.pdf",
//     });
//     return (
//         <div>
//             <Button variant="primary" onClick={() => handlePrint}>
//                 Print PDF
//             </Button>
//             <Button
//                 onClick={() =>
//                     generatePDF(targetRef, { filename: "Reciept.pdf" })
//                 }
//                 style={{ float: "left" }}
//                 variant="primary"
//             >
//                 Download Reciept
//             </Button>
//             <div style={{ display: "block" }}>
//                 <InvoiceMaker ref={targetRef} />
//             </div>
//         </div>
//     );
// };
type BookingCabin = {
    id: number; cabin_id: number; price: number; start_date: string; end_date: string; name: string;
    amenities: any; breakfast: boolean; type_name_en: string; type_name_ar: string; observation?: string;
};

type Booking = {
    id: string; created_at: string; is_paid: boolean; is_confirmed: boolean; total_price: number;
    full_name: string; guest_p: string; booking_cabins: BookingCabin[]; booking_activity_total: number;
    booking_activity_incomes: number; last_edit_user: string; check_in: string; check_out: string; observations: string | null;
};
function BookingDetail() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { pay, isPaying, Tpromise: PayPromise } = usePay();
    const { booking, isLoading } = useBooking();
    const { checkout, isCheckingOut } = useCheckout();
    const { deleteBooking, isDeleting, Tpromise: DeletePromise } = useDeleteBooking();
    const Language = useSettingsStore(state => state.Language);
    const setTempObj = useSettingsStore(state => state.setTempObj);
    useEffect(() => {
        setTempObj(booking);
    }, [booking]);
    const moveBack = useMoveBack();
    const router = useRouter();
    const { settings, isLoading: isLoadingSettings } = useSettings();
    const { checkin, isCheckingIn } = useCheckin();
    const { owner, permissions , isLoading: isLoadingUser} = useGetProfile();
    if (isLoading || isLoadingSettings || isLoadingUser) return <Spinner />;
    if (!booking) return <Empty resourceName="booking" />;

    const {
        check_in,
        check_out,
        is_paid,
        is_confirmed,
        total_price,
        id: bookingId,
        booking_guests,
        booking_activity_total,
        booking_activity,
        full_name
    } = booking?.data?.bookings?.[0];
    const guestsids = [] as number[];
    const uniqueGuests = booking_guests?.filter(
        (guest: any, index: any, self: any) => index === self.findIndex((g: any) => g.guest_id === guest.guest_id)
    );
    uniqueGuests?.forEach((element: any) => {
        if (element.national_id !== null) guestsids.push(element.id);
    })
    // console.log(booking);
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
    is_confirmed 
        ? is_paid
            ? check_out !== null
                ? Language === "en" ? "checked-out": "تم الخروج"
            : check_in !== null
                ? Language === "en"? "checked-in": "تم الدخول"
            : Language === "en"? "paid": "مدفوع"
            // when partially paid or no payments are made
        : (booking_activity_total + total_price) !== 0
        ? check_in !== null ? Language === "en"? "checked-in | paid-partly": "تم الدخول | مدفوع جزئيا": Language === "en"? "paid-partly": "مدفوع جزئيا"
        : check_in !== null ? Language === "en"? "checked-in | paid Later": "تم الدخول | الدفع لاحقا": Language === "en"? "confirmed | paid Later": "مؤكد | الدفع لاحقا"
    : Language === "en"? "unconfirmed": "غير مؤكد";
    return (
        <>
            <Row>
                <HeadingGroup>
                    <Heading as="h1">
                        {Language === "en" ? "Booking #" : "رقم الحجز #"}
                        {bookingId}
                    </Heading>
                    <Tag
                        style={{ fontSize: "1.6rem" }}
                        type={statusToTagName[status]}
                    >
                        {status.replace("-", " ")}
                    </Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>
                    &larr; {Language === "en" ? "Back" : "رجوع"}
                </ButtonText>
            </Row>

            <BookingDataBox booking={booking as any} />

            <ButtonGroup>
                {is_confirmed !== true && (
                    <Modal>
                        <Modal.Open opens="Booking">
                            <Button variant="primary">
                                {Language === "en"
                                    ? "Confirm The Booking and pay later"
                                    : "تأكيد الحجز والدفع لاحقا "}
                            </Button>
                        </Modal.Open>
                        <Modal.Window name="Booking">
                            <ConfirmPayment
                                fixed={true}
                                ConfirmationMessage={
                                    Language === "en"
                                        ? `Are you sure to confirm the booking#${bookingId} Without Payment?`
                                        : `هل انت متأكد من تأكيد الحجز #${bookingId} بدون دفع؟`
                                }
                                resourceName={{ full_name, total_price:booking_activity_total }}
                                disabled={isPaying}
                                onConfirm={(amount: number, info : string) => pay({amount, bookingId, info: info})}
                                promise={PayPromise}
                                isLoading={isPaying}
                            />
                        </Modal.Window>
                    </Modal>
                )}
                {is_paid === false && (
                    <Modal>
                        <Modal.Open opens="Payment">
                            <Button variant="primary">
                                {Language === "en"
                                    ? "Confirm The Full Payment"
                                    : "تأكيد الدفع كاملا"}
                            </Button>
                        </Modal.Open>
                        <Modal.Open opens="Payment-Part">
                            <Button variant="primary">
                                {Language === "en"
                                    ? "Add Payment"
                                    : "اضافة دفعة"}
                            </Button>
                        </Modal.Open>
                        <Modal.Window name="Payment-Part">
                            <ConfirmPayment
                                resourceName={{ full_name, total_price:booking_activity_total }}
                                disabled={isPaying}
                                fixed={false}
                                isLoading={isPaying}
                                onConfirm={(amount: number, info : string) => pay({amount, bookingId, info})}
                                promise={PayPromise}
                            />
                        </Modal.Window>
                        <Modal.Window name="Payment">
                            <ConfirmPayment
                            fixed={true}
                                resourceName={{ full_name, total_price:booking_activity_total }}
                                disabled={isPaying}
                                onConfirm={(amount: number, info : string) => pay({amount, bookingId, info: info})}
                                promise={PayPromise}
                                isLoading={isPaying}
                            />
                        </Modal.Window>
                    </Modal>
                )}
                {is_confirmed === true && check_in === null && (
                        <Button onClick={() => checkin(bookingId)}>
                            {Language === "en" ? "Check in" : "تسجيل الدخول"}
                        </Button>
                    )}
                {is_confirmed === true && is_paid === true && check_out === null && (
                    <Button
                        // icon={<HiArrowUpOnSquare />}
                        onClick={() => checkout(bookingId)}
                        disabled={isCheckingOut}
                    >
                        {/* <HiArrowUpOnSquare /> */}
                        {Language === "en" ? "Check out" : "تسجيل الخروج"}
                    </Button>
                )}

                <Modal>
                    {(permissions?.BookingDelete || owner) && (
                       <Modal.Open opens="delete">
                       <Button variant="danger">
                           {Language === "en" ? "Delete Booking" : "حذف الحجز"}
                       </Button>
                      </Modal.Open>  
                    )}
                    <Modal.Window name="delete">
                        <ConfirmDelete
                            resourceName="booking"
                            disabled={isDeleting}
                            onConfirm={() =>
                                deleteBooking(bookingId, {
                                    onSettled: () => router.back(),
                                })
                            }
                            promise={DeletePromise}
                            isLoading={isDeleting}
                        />
                    </Modal.Window>
                </Modal>

                <Button variant="secondary" onClick={moveBack}>
                    {Language === "en" ? "Back" : "رجوع"}
                </Button>
                <Button
                    onClick={() => {
                        const darkmode = isDarkMode;
                        isDarkMode ? toggleDarkMode() : null;
                        // Language==="ar"?LanguageToggle():null;
                        setTimeout(() => {
                            router.push(
                                "/reciept/" +
                                    bookingId +
                                    "?Language=en&" +
                                    "DarkMode=" +
                                    darkmode
                            );
                        }, 1000);
                    }}
                >
                    {Language === "en" ? "Print Reciept in English" : "طباعة الفاتورة باللغة الانجليزية"}
                </Button><Button
                    onClick={() => {
                        const darkmode = isDarkMode;
                        isDarkMode ? toggleDarkMode() : null;
                        // Language==="ar"?LanguageToggle():null;
                        setTimeout(() => {
                            router.push(
                                "/reciept/" +
                                    bookingId +
                                    "?Language=ar&" +
                                    "DarkMode=" +
                                    darkmode
                            );
                        }, 1000);
                    }}
                >
                    {Language === "en" ? "Print Reciept in Arabic" : " طباعة الفاتور باللغة العربية"}
                </Button>
                
            </ButtonGroup>
            <div></div>
        </>
    );
}

export default BookingDetail;
