"use client";
import styled from "styled-components";
import Link from "next/link";
import { Button, Flag, Tag } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const StyledTodayItem = styled.li`
    display: flex;
    gap: 1.2rem;
    justify-content: space-between;

    gap: 1.2rem;
    align-items: center;

    font-size: 1.4rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--color-grey-100);

    &:first-child {
        border-top: 1px solid var(--color-grey-100);
    }
`;

const Guest = styled.div`
    min-width: 7rem;
    max-width: 15rem;
    font-weight: 500;
`;

function CriticalItem({ item }: any) {
    const { id, img, name, total_quantity, criticality } = item;
    const Language = useSettingsStore(state => state.Language);
    return (
        <StyledTodayItem>
            <Tag type="red">{Language === "en" ? "Critical" : "حرج"}</Tag>
            <Guest>{name}</Guest>
            <div>
                {Language === "en" ? "Qty:" : "الكمية:"}
                {total_quantity}
            </div>
            <div>&lt;{criticality}</div>
            <Button
                size="small"
                variant="primary"
                as={Link}
                href={`/storage?id=${id}`}
            >
                {Language === "en" ? "Replinch" : "تعبئة"}
            </Button>
        </StyledTodayItem>
    );
}

export default CriticalItem;
