"use client";
import styled from "styled-components";

import BookingDataBox from "../bookings/BookingDataBox";
import { useSettingsStore } from "@/components/WizardForm/useStore";

import { useMoveBack } from "@/hooks";
import { useBooking } from "@/hooks/bookings";

import { Heading } from "@/components/typography";
import { Row } from "@/components/layout";
import {
    Spinner,
    Empty,
    Button,
    Tag,
    ButtonGroup,
    ButtonText,
} from "@/components/ui";

import { formatCurrency } from "@/utils/helpers";
import { Checkbox } from "@/components/form";
import { useEffect, useState } from "react";
import { useCheckin } from "@/hooks/check-in-out";
import { useSettings } from "@/hooks/settings";

const Box = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    padding: 2.4rem 4rem;
`;

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;

function CheckinBooking() {
    const [confirmPaid, setConfirmPaid] = useState(true);
    const [addBreakfast, setAddBreakfast] = useState(false);

    const { booking, isLoading } = useBooking();
    const { checkin, isCheckingIn } = useCheckin();
    const { settings, isLoading: isLoadingSettings } = useSettings();

    useEffect(() => {
        setConfirmPaid(booking?.isPaid ?? false);
    }, [booking]);

    const moveBack = useMoveBack();
    const Language = useSettingsStore(state => state.Language);

    if (isLoading || isLoadingSettings) return <Spinner />;
    if (!booking) return <Empty resourceName="booking" />;
    const {
            id,
        bookingCabins,
        bookingGuests,
        created_at,
        start_date,
        end_date,
        check_in,
        check_out,
        total_price,
        observations,
        is_paid,
        is_confirmed,
        guests:{
            fullName,
            email,
            nationality,
            countryFlag,
            nationalID,
        }
        
    } = booking;
    const statusToTagName: any = {
        "unconfirmed": "red",
        "غير مؤكد": "red",
        "confirmed | paid Later": "blue",
        "مؤكد | دفع لاحقا": "blue",
        "paid": "yellow",
        "مدفوع": "yellow",
        "checked-in": "green",
        "تم الدخول": "green",
        "checked-out": "silver",
        "تم الخروج": "silver",
    };
    const status = is_paid ? check_out !== null ? Language==="en"?"checked-in":"تم الدخول": check_in !== null
            ? Language==="en"?"checked-in":"تم الدخول"
            : Language==="en"?"paid":"مدفوع"
        : is_confirmed
        ? Language==="en"?"confirmed | paid Later":"مؤكد | دفع لاحقا"
        : Language==="en"?"unconfirmed":"غير مؤكد";
    const daysDiff:any = Math.round(((new Date(end_date).getTime()) - (new Date(start_date).getTime())) / (1000 * 60 * 60 * 24));

    const optionalBreakfastPrice =
        settings?.breakfastPrice * daysDiff * 2;

    function handleCheckin() {
        if (!is_paid) return;
            checkin(id);
    }

    return (
        <>
            <Row>
                <HeadingGroup>
                    <Heading as="h1">Check in Booking #{id}</Heading>
                    <Tag type={statusToTagName[status]}>
                        {status.replace("-", " ")}
                    </Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking as any} />

            {!true && (
                <Box>
                    <Checkbox
                        checked={addBreakfast}
                        onChange={() => {
                            setAddBreakfast((add) => !add);
                            setConfirmPaid(false);
                        }}
                        id="breakfast"
                    >
                        Want to add breakfast for{" "}
                        {formatCurrency(optionalBreakfastPrice)}?
                    </Checkbox>
                </Box>
            )}

            {/* <Box>
                <Checkbox
                    checked={confirmPaid}
                    onChange={() => setConfirmPaid((confirm) => !confirm)}
                    disabled={confirmPaid || isCheckingIn}
                    id="confirm"
                >
                    I confirm that {fullName} has paid the total amount
                    of{" "}
                    {!addBreakfast
                        ? formatCurrency(total_price)
                        : `${formatCurrency(
                              total_price + optionalBreakfastPrice
                          )} (${formatCurrency(total_price)} + ${formatCurrency(
                              optionalBreakfastPrice
                          )})`}
                </Checkbox>
            </Box> */}

            <ButtonGroup>
                <Button
                    onClick={handleCheckin}
                    disabled={!is_paid || isCheckingIn}
                >
                    Check in booking #{id}
                </Button>
                <Button variant="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default CheckinBooking;
