"use client";
import { Column, Row } from "@/components/layout";
import { Heading } from "@/components/typography";
import { BookingsTable,AddBooking, BookingsTableOperations } from "@/features/bookings";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useGetProfile } from "@/hooks/authentication";
function Bookings() {
    const { permissions , owner } = useGetProfile();
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
            <Row style={{ marginBottom: "5rem" }}>
                <Heading as="h1">{Language==="en"?"All Bookings":"جميع الحجوزات"}</Heading>
                <BookingsTableOperations />
            </Row>  
                <Column style={{ marginBottom: "20.5rem" }}>
                <Column align="start">
                {(permissions?.BookingWrite || owner) && <AddBooking />}
                </Column >
                <BookingsTable />
            </Column>
        </>
    );
}

export default Bookings;
