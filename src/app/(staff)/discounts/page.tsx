"use client";
import { Heading } from "@/components/typography";
import { Column, Row } from "@/components/layout";
// import { CabinTable, AddCabin, CabinTableOperations ,AddDiscount} from "@/features/cabins";
import {AddDiscount,DiscountTable} from "@/features/discounts"
import { useSettingsStore } from "@/components/WizardForm/useStore";
function Discounts() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
            <Row style={{ marginBottom: "2.5rem" }}>
                <Heading as="h1">{Language==="en"?"All Discounts":"جميع الخصومات"}</Heading>
                {/* <CabinTableOperations /> */}
            </Row>
            <Column>
                <Column align="start">
                   <Row>
                   <AddDiscount />
                   </Row>
                </Column>
                <DiscountTable />
            </Column>
        </>
    );
}

export default Discounts;
