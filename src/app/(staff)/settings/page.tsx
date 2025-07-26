"use client";
import { Heading } from "@/components/typography";
import { Column } from "@/components/layout";
import { UpdateSettingsForm } from "@/features/settings";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function Settings() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <Column>
        <Heading style={{ textAlign: "center"}}>{Language==="en"?"Update hotel settings":"تحديث بيانات الفندق"}</Heading>
            <UpdateSettingsForm />
        </Column>
    );
}

export default Settings;
