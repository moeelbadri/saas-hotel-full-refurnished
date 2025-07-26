import { Filter, SortBy } from "@/components/utils";

import { TableOperations } from "@/components/utils";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function CabinTableOperations() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <TableOperations>
            <Filter
                filterField="filter"
                options={[
                    { value: "all", label: Language === "en" ? "All Rooms" : "كل الغرف"  },
                    { value: "no-discount", label: Language === "en" ? "Without discount" : "بدون خصم" },
                    { value: "with-discount", label: Language === "en" ? "With discount" : "مع خصم" },
                ]}
            />

            <SortBy
                options={[
                    { value: "name-asc", label: Language === "en" ? "Sort by name (A-Z)" : "ترتيب حسب الاسم (ا-د)" },
                    { value: "name-desc", label: Language === "en" ? "Sort by name (Z-A)" : "ترتيب حسب الاسم (د-ا)" },
                    {
                        value: "regular_price-asc",
                        label: Language === "en" ? "Sort by price (low first)" : "ترتيب حسب السعر (اقل اولا)",
                    },
                    {
                        value: "regular_price-desc",
                        label: Language === "en" ? "Sort by price (high first)" : "ترتيب حسب السعر (اعلى اولا)",
                    },
                    // {
                    //     value: "maxCapacity-asc",
                    //     label: Language === "en" ? "Sort by capacity (low first)" : "ترتيب حسب السعر (اقل اولا)",
                    // },
                    // {
                    //     value: "maxCapacity-desc",
                    //     label: Language === "en" ? "Sort by capacity (high first)" : "ترتيب حسب السعر (اعلى اولا)",
                    // },
                ]}
            />
        </TableOperations>
    );
}

export default CabinTableOperations;
