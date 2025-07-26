"use client";
import { Column, Row } from "@/components/layout";
import { Heading } from "@/components/typography";
import { StorageTable,AddItem } from "@/features/Storage";
import { useSettingsStore } from "@/components/WizardForm/useStore";
function Storage() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
            <Row style={{ marginBottom: "2.5rem" }}>
                <Heading as="h1">{Language==="en"?"Storage":"المخزن"}</Heading>
                {/* <GuestsTableOperations /> */}
                </Row>
                <Column style={{ marginBottom: "20.5rem" }}>
                <Column align="start">
                        <AddItem />
                </Column> 
            <StorageTable />
            </Column>
        </>
    );
}

export default Storage;
