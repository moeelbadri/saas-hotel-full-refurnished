"use client";
import { Heading } from "@/components/typography";
import { UsersTable } from "@/features/users";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Row, Column } from "@/components/layout";
function NewUsers() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
        <Row style={{ marginBottom: "2.5rem" }}>
            <Heading as="h1">{Language==="en"?"Users":"المستخدمين"}</Heading>
            {/* <GuestsTableOperations /> */}
        </Row>
            <Column style={{ marginBottom: "20.5rem" }}>

            <UsersTable />
        </Column>
               <Heading as="h1" style={{ marginBottom: "20rem" ,textAlign:"center"}}></Heading>
        </>
    );
}

export default NewUsers;
