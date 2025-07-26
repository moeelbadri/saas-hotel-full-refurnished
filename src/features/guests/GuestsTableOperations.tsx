"use client";
import { Filter,SearchBy, SortBy, TableOperations } from "@/components/utils";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function GuestsTableOperations() {
    const Language = useSettingsStore(state => state.Language);

    return (
        <TableOperations>
            {/* <Filter
                filterField="status"
                options={[
                    { value: "all", label: "All" },
                    { value: "checked-out", label: "Checked out" },
                    { value: "checked-in", label: "Checked in" },
                    { value: "unconfirmed", label: "Unconfirmed" },
                ]}
            /> */}
                 <SearchBy />
            <SortBy
                options={[
                    {
                        value: "full_name-desc",
                        label:Language==="en"? "Sort by name (A-Z)":"ترتيب حسب الاسم (ا-د)",
                    },
                    {
                        value: "full_name-asc",
                        label: Language==="en"?"Sort by name (Z-A)":"ترتيب حسب الاسم (د-ا)",
                    },
                    {
                        value: "created_at-desc",
                        label:Language==="en"? "Sort by last created (recent first)":"ترتيب حسب اخر انشاء (الاحدث اولا)",
                    },
                    {
                        value: "created_at-asc",
                        label: Language==="en"?"Sort by last created (earlier first)":"ترتيب حسب اخر انشاء (الاقدم اولا)",
                    },
                    {
                        value: "last_booking-desc",
                        label:Language==="en"? "Sort by last booking (recent first)":"ترتيب حسب اخر حجز (الاحدث اولا)",
                    },
                    {
                        value: "last_booking-asc",
                        label: Language==="en"?"Sort by last booking (earlier first)":"ترتيب حسب اخر حجز (الاقدم اولا)",
                    },
                    {
                        value: "gender-desc",
                        label:Language==="en"? "Sort by Gender (Male first)":"ترتيب حسب النوع (الذكور اولا)",
                    },
                    {
                        value: "gender-asc",
                        label: Language==="en"?"Sort by Gender (Female first)":"ترتيب حسب النوع (الاناث اولا)",
                    },
                ]}
            />
        </TableOperations>
    );
}

export default GuestsTableOperations;
