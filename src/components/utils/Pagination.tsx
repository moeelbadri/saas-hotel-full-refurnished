"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams , useRouter } from "next/navigation";
import styled from "styled-components";
import { PAGE_SIZE } from "@/utils/constants";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useState } from "react";
import { useDarkMode } from "@/hooks";
const StyledPagination = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const P = styled.p`
    font-size: 1.4rem;
    margin-left: 0.8rem;

    & span {
        font-weight: 600;
    }
`;

const Buttons = styled.div`
    display: flex;
    gap: 0.6rem;
`;

const PaginationButton = styled.button<{ active?: any }>`
    background-color: ${(props: { active?: any }) => props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
    color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
    border: none;
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    font-size: 1.4rem;
    
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.6rem 1.2rem;
    transition: all 0.3s;

    &:has(span:last-child) {
        padding-left: 0.4rem;
    }

    &:has(span:first-child) {
        padding-right: 0.4rem;
    }

    & svg {
        height: 1.8rem;
        width: 1.8rem;
    }

    &:hover:not(:disabled) {
        background-color: var(--color-brand-600);
        color: var(--color-brand-50);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.3;
    }
`;

function Pagination({ count , oldcount , pageid  }: { count: any ,oldcount : any, pageid : any }) {
    // console.log(count)
    const searchParams = useSearchParams();
    const router = useRouter();
    //  Initialize state based on search params
    const Language = useSettingsStore(state => state.Language);
    // const isDisabled = (calculatedValue > count ? count : calculatedValue) === (count ?? Count);
    
    function nextPage() {
          // Convert read-only SearchParams to mutable
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("pageid", pageid?.toString());
        newParams.set("oldid",searchParams.get("pageid")?.toString() || "0");

        router.replace(`${window.location.pathname}?${newParams.toString()}`);
    }

    function prevPage() {
           // Convert read-only SearchParams to mutable
           const newParams = new URLSearchParams(searchParams.toString());
           if(searchParams.get("pageid") === searchParams.get("oldid")) {
               newParams.set("pageid", "0");
           }else{
               newParams.set("pageid",searchParams.get("oldid")?.toString() || "0");
           }
            router.replace(`${window.location.pathname}?${newParams.toString()}`);
    }
    function setPageCount(pageSizeV: number) {
        // Convert read-only SearchParams to mutable
           const newParams = new URLSearchParams(searchParams.toString());
           newParams.set("limit", pageSizeV.toString());
           router.replace(`${window.location.pathname}?${newParams.toString()}`);
        }
    return (
        <StyledPagination>
            <P> 
                Showing <span>{Number(oldcount) || 0}</span>
                {" "} to {" "}
                <span>
                    {Number(oldcount) + (Number(searchParams.get("limit")) || PAGE_SIZE)  > Number(count) ? count : ((Number(oldcount) + (Number(searchParams.get("limit")) || PAGE_SIZE)) || 0)}
                </span> {" "} of <span>{count}</span> results <span> - </span>
                <select onChange={(e) => setPageCount(Number(e.target.value))}
                    defaultValue={searchParams.get("limit") || PAGE_SIZE}
                    style={{color: "var(--color-grey-800)", backgroundColor: "var(--color-grey-50)"}}>
                    <option value={PAGE_SIZE / 10}>{PAGE_SIZE / 10}</option>
                    <option value={PAGE_SIZE / 2}>{PAGE_SIZE / 2}</option>
                    <option value={PAGE_SIZE * 1}>{PAGE_SIZE * 1}</option>
                    <option value={PAGE_SIZE * 2}>{PAGE_SIZE * 2}</option>
                    <option value={PAGE_SIZE * 5}>{PAGE_SIZE * 5}</option>
                    <option value={PAGE_SIZE * 10}>{PAGE_SIZE * 10}</option>
                </select>
            <span> results per page</span>
            </P>
            <Buttons>
                <PaginationButton
                    onClick={prevPage}
                    disabled={Number(searchParams.get("pageid")) === 0}
                >   
                     {Language === "en" ? <HiChevronLeft /> : <HiChevronRight />}
                   <span>{Language === "en" ? "Prev" : "السابق"}</span>
                </PaginationButton>

                <PaginationButton
                    onClick={nextPage}
                    disabled={Number(count) - Number(oldcount) <= (Number(searchParams.get("limit") || PAGE_SIZE)) || !pageid}
                >
                    <span>{Language === "en" ? "Next" : "التالي"}</span>
                    {Language === "en" ? <HiChevronRight /> : <HiChevronLeft />}
                </PaginationButton>
            </Buttons>
        </StyledPagination>

    );
}

export default Pagination;
