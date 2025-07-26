"use client";
import { Column, Row } from "@/components/layout";
import { Heading } from "@/components/typography";
import { GuestsTable,AddGuest,UploadGuests, GuestsTableOperations} from "@/features/guests";
import { useSettingsStore } from "@/components/WizardForm/useStore";
function Guests() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
            <Row style={{ marginBottom: "2.5rem" }}>
                <Heading as="h1">{Language==="en"?"All Guests":"جميع النزلاء"}</Heading>
                <GuestsTableOperations />
                </Row>
                <Column style={{ marginBottom: "20.5rem" }}>
                <Row>
                <AddGuest />
                <UploadGuests/>
                </Row> 
            <GuestsTable />
            </Column>
        </>
    );
}

export default Guests;
