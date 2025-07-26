"use client";
import { Heading } from "@/components/typography";

import { Column, Row } from "@/components/layout";
import {
  CabinTable,
  AddCabin,
  CabinTableOperations,
  AddDiscount,
} from "@/features/cabins";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useGetProfile } from "@/hooks/authentication";

export default function Rooms() {
  const Language = useSettingsStore((state) => state.Language);
  const { permissions, owner } = useGetProfile();
  return (
    <>
      <Row style={{ marginBottom: "2.5rem" }}>
        <Heading as="h1">
          {Language === "en" ? "All Rooms" : "جميع الغرف"}
        </Heading>
        <CabinTableOperations />
      </Row>
      <Column style={{ marginBottom: "20.5rem" }}>
        <Column align="start">
          <Row>{(owner || permissions?.CabinsWrite) && <AddCabin />}</Row>
        </Column>
        <CabinTable />
      </Column>
    </>
  );
}
