"use client";
import { Column, Row } from "@/components/layout";
import { Heading } from "@/components/typography";
import {AddAlert,AlertsRow,AlertsTable, AlertsTableOperations } from "@/features/Alerts";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useGetProfile } from "@/hooks/authentication";

export default function Alerts() {
    const { permissions , owner } = useGetProfile();
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
            <Row style={{ marginBottom: "2.5rem" }}>
                <Heading as="h1">{Language==="en"?"All Alerts":"جميع التنبيهات"}</Heading>
                 <AlertsTableOperations/>
                </Row>  
                <Column style={{ marginBottom: "20.5rem" }}>
                <Column align="start">
                       {(permissions?.BookingWrite || owner) && <AddAlert />}
                </Column >
            <AlertsTable />
            </Column>
        </>
    );
}