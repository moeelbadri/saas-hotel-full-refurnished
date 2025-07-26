"use client";
import styled from "styled-components";
import Link from "next/link";
import { Button, Flag, Tag } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { usePutAlerts } from "@/hooks/settings";

const StyledTodayItem = styled.li`
    display: flex;
    justify-content: space-between;
    gap: 2.2rem;
    align-items: center;
    font-size: 1.6rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--color-grey-100);

    &:first-child {
        border-top: 1px solid var(--color-grey-100);

    }
`;

const Message = styled.div`
    font-weight: 500;

    `;
const DateF = styled.div`
    font-weight: 500;
    min-width: 100px;
    max-width: 200px;
`;
// function getDaysDiff(end:Date, start:Date){
//     return  Math.round(((new Date(end).getTime()) - (new Date(start).getTime())) / (1000 * 60 * 60 * 24));
// }
function formateDate(Language: string, date: string) {
    const options = {
        year: "numeric" as const,
        month: "long" as const,
        day: "numeric" as const,
        hour: "2-digit" as const,
        minute: "2-digit" as const,
        hour12: true,
    };
    const DateLanguage = Language === "en" ? "en-US" : "ar";
    const formattedDate = new Intl.DateTimeFormat(DateLanguage, options).format(
        new Date(date)
    );
    return formattedDate
        .replace("، ", " في ")
        .split(Language === "en" ? "at" : "في");
}
export default function Alert({ Alert }: any) {
    const {
        id,
        created_at,
        Amenities_ids,
        Cabins_ids,
        message,
        priority_level,
        Permanent,
        end_date,
    } = Alert;
    const Language = useSettingsStore(state => state.Language);
    const { isPutting, PutAlerts } = usePutAlerts();
    return (
        <StyledTodayItem>
            <div className="priority">
            {priority_level === -1 && (
                <Tag type="green">{Language === "en" ? "Notes" : "ملاحظات"}</Tag>
            )}
            {priority_level === 1 && (
                <Tag type="blue">{Language === "en" ? "Important" : "مهم"}</Tag>
            )}
            {priority_level === 2 && (
                <Tag type="red">{Language === "en" ? "Urgent" : "عاجل"}</Tag>
            )}
            </div>
            <div className="date"><DateF>{formateDate(Language, created_at)}</DateF></div>
            <Message>{message}</Message>
            {priority_level > -1 && (
                <Button onClick={() => PutAlerts(Alert)} style={{maxWidth:"100px"}}>
                    {Language === "en" ? "Resolved?" : "تم؟"}
                </Button>
            )}
        </StyledTodayItem>
    );
}
