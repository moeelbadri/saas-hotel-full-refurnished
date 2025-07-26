import Filter from "@/components/utils/Filter";
import { useSettingsStore } from "@/components/WizardForm/useStore";
function ReportFilter() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <Filter
            filterField="days"
            options={[
                { value: "7", label: Language==="en"?"Last 7 days":"اخر 7 ايام" },
                { value: "30",label: Language==="en"?"Last 30 days":"اخر 30 يوم"  },
                { value: "90", label: Language==="en"?"Last 90 days":"اخر 90 يوم"  },
                { value: "180", label: Language==="en"?"Last 180 days":"اخر 180 يوم"  },
                { value: "365", label: Language==="en"?"Last year":"السنة السابقة"  },
            ]}
        />
    );
}

export default ReportFilter;
