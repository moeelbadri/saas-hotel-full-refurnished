import { Filter,SearchBy, SortBy, TableOperations } from "@/components/utils";
import { useSettingsStore } from "@/components/WizardForm/useStore";

export default function AlertsableOperations() {
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
                        value: "created_at-desc",
                        label:Language==="en"? "Sort by last Alert (recent first)":"ترتيب حسب اول تنبيه (الاحدث اولا)",
                    },
                    {
                        value: "created_at-asc",
                        label: Language==="en"?"Sort by last Alert (earlier first)":"ترتيب حسب اخر تنبيه (الاقدم اولا)",
                    },
                ]}
            />
        </TableOperations>
    );
}