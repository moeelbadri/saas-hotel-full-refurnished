import { Filter, SortBy, TableOperations } from "@/components/utils";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function BookingsTableOperations() {
    const Language = useSettingsStore(state => state.Language);

    return (
        <TableOperations>
            <Filter
                filterField="status"
                options={[
                    { value: "all", label: Language==="en"? "All bookings":"كل الحجوزات" },
                    { value: "check_out", label: Language==="en"? "Checked out":" تمت المغادرة" },
                    { value: "check_in", label: Language==="en"? "Checked in":" تم الدخول" },
                    { value: "is_not_confirmed", label: Language==="en"? "Unconfirmed":"غير مؤكد" },
                    { value: "is_confirmed", label: Language==="en"? "Confirmed":"مؤكد" },
                    { value: "is_paid", label: Language==="en"? "Paid":"مدفوع" },
                    { value: "is_not_paid", label: Language==="en"? "Unpaid":"غير مدفوع" },
                ]}
            />

            <SortBy
                options={[
                    {
                        value: "created_at-desc",
                        label:Language==="en"? "Sort by date (recent first)":"ترتيب حسب التاريخ (الاحدث اولا)",
                    },
                    {
                        value: "created_at-asc",
                        label: Language==="en"?"Sort by date (earlier first)":"ترتيب حسب التاريخ (الاقدم اولا)",
                    },
                    {
                        value: "start_date-desc",
                        label:Language==="en"? "Sort by start date (recent first)":"ترتيب حسب تاريخ بدا الحجز(الاحدث اولا)",
                    },
                    {
                        value: "start_date-asc",
                        label: Language==="en"?"Sort by start date (earlier first)":"ترتيب حسب تاريخ بدا الحجز(الاقدم اولا)",
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
