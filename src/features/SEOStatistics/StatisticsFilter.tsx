import { SortBy, TableOperations } from "@/components/utils";
import Filter from "@/components/utils/Filter";
import { useSettingsStore } from "@/components/WizardForm/useStore";
export default function StatisticsFilter() {
    const Language = useSettingsStore(state => state.Language);
    return (
                <TableOperations>

        <Filter
            filterField="last"
            options={[
                { value: "1", label: Language==="en"?"Today":"اليوم"  },
                { value: "7", label: Language==="en"?"Last 7 days":"اخر 7 ايام" },
                { value: "30",label: Language==="en"?"Last 30 days":"اخر 30 يوم"  },
                { value: "90", label: Language==="en"?"Last 90 days":"اخر 90 يوم"  },
                { value: "180", label: Language==="en"?"Last 180 days":"اخر 180 يوم"  },
                { value: "365", label: Language==="en"?"Last year":"السنة السابقة"  },
            ]}
        />
        <Filter
        filterField="group"
        options={[
            { value: "hour", label: Language==="en"?"by hour":"بالساعة" },
            { value: "day", label: Language==="en"?"by day":"باليوم" },
            { value: "month", label: Language==="en"?"by month":"بالشهر" }
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
