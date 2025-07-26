import {
    HiOutlineBanknotes,
    HiOutlineBriefcase,
    HiOutlineCalendarDays,
    HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency,getDaysDiff,getIntersectionDays } from "@/utils/helpers";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { DashboardStats } from "@/services/apiStatistics";

function Statistics({ stats , isLoading }: { stats: DashboardStats; isLoading: boolean }) {
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
            <Stat
                isLoading={isLoading}
                title={Language==="en"?"Bookings":"الحجوزات"}
                color="blue"
                icon={<HiOutlineBriefcase />}
                value={`${stats?.confirmed_bookings || 0} (${stats?.unconfirmed_bookings || 0})`}
            />
            <Stat
                isLoading={isLoading}
                title={Language==="en"?"Expenses":"المصاريف"}
                color="green"
                icon={<HiOutlineBanknotes />}
                value={`${formatCurrency(stats?.total_expenses || 0)}`}
            />
            <Stat
                isLoading={isLoading}
                title={Language==="en"?"Check-ins":"النزل في الفندق"}
                color="indigo"
                icon={<HiOutlineCalendarDays />}
                value={stats?.checkins || 0 }
            />
            <Stat
                isLoading={isLoading}
                title={Language==="en"?"Occupation":"نسبة التواجد"}
                color="yellow"
                icon={<HiOutlineChartBar />}
                value={Math.round(stats?.occupancy_percentage || 0) + "%"}
            />
        </>
    );
}

export default Statistics;
