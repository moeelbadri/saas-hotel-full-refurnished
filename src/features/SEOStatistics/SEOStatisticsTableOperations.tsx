import { Filter, SortBy, TableOperations } from "@/components/utils";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function BookingsTableOperations() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <TableOperations>
            <Filter
                filterField="group"
                options={[
                    { value: "false", label:Language==="en"?"Country":"الدولة" },
                    { value: "true", label: Language==="en"?"City":"المدينة" }
                ]}
            />
            <Filter
                filterField="hotel"
                options={[
                    { value: "false", label: Language==="en"?"Global":"عالمي" },
                    { value: "true", label: Language==="en"?"Hotel":"الفندق" }
                ]}
            />

            <SortBy
                options={[
                    {
                        value: "start_date-desc",
                        label:Language==="en"? "Sort by date (recent first)":"ترتيب حسب التاريخ (الاحدث اولا)",
                    },
                    {
                        value: "start_date-asc",
                        label: Language==="en"?"Sort by date (earlier first)":"ترتيب حسب التاريخ (الاقدم اولا)",
                    },
                    {
                        value: "total_price-desc",
                        label: Language==="en"?"Sort by amount (high first)":"ترتيب حسب المبلغ (الاعلى اولا)",
                    },
                    {
                        value: "total_price-asc",
                        label: Language==="en"?"Sort by amount (low first)":"ترتيب حسب المبلغ (الاقل اولا)",
                    },
                ]}
            />
        </TableOperations>
    );
}

export default BookingsTableOperations;
