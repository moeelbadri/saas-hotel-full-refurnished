"use client";
import styled from "styled-components";
import { formatCurrency, formateDate } from "@/utils/helpers";
import { ConfirmConsumption, ConfirmDelete,ConfirmReplinch, Menus, Modal, SpinnerMini } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { HiEye, HiMinus, HiPlus, HiTrash } from "react-icons/hi2";
import { useGetProfile } from "@/hooks/authentication";

import { useDeleteStorageActivity } from "@/hooks/reports";
import { useRef } from "react";
const TableRow = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 0.1fr 1fr 0.5fr 0.5fr 0.5fr 0.5fr 0.8fr 1fr 1fr 0.1fr;
    column-gap: 3.0rem;
    align-items: center;
    padding: 1.4rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Div = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;
const Stacked = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    & span:first-child {
        font-weight: 600;
    }

    & span:last-child {
        color: var(--color-grey-500);
        font-size: 1.5rem;
    }
`;

// const Hotel = styled.div`
//     font-family: "Sono";
//     font-weight: 500;
//     color: var(--color-green-700);
// `;

export default function ReportRow({ Report }: { Report: any}) {
    const {DeleteStorageActivity,isDeleting,isSuccess}=useDeleteStorageActivity();
    const Language = useSettingsStore(state => state.Language);
          const {
            item_id: storage_item_id,
            id,
            total_cost,
            created_at,
            name,
            img,
            full_name,  
            quantity,
            description,
            }: any = Report;
            const date = new Date(created_at);
            const rowRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <TableRow ref={rowRef}>
                <Div>{id}</Div>
                <Img src={img} />
                <Div>{name}</Div>
                <Div>{quantity}</Div>
                <Div>{total_cost?total_cost:"-"}</Div>
                <Div> {!(total_cost > 0)?<HiMinus/>:<HiPlus/>} {!(total_cost > 0)?(Language==="en"?"Consumption":"استهلاك"):Language==="en"?"Replenish":"تعبئة"}</Div>
                <Stacked><span>{formateDate(date,Language)[0]}</span><span>{formateDate(date,Language)[1]}</span></Stacked>
                 <Div>{full_name}</Div>
                <Div>{description}</Div>
                {isDeleting?<SpinnerMini/>:
               <Modal>
               <Menus.Menu>
                   <Menus.Toggle id={id.toString()}/>
                   <Menus.List id={id.toString()}>
                       
                     {(true)&&  <Modal.Open opens="delete">
                           <Menus.Button icon={<HiTrash />}>
                              {Language === "en" ? "Delete" : "حذف"}
                           </Menus.Button>
                       </Modal.Open>}
                       
                   </Menus.List>
               </Menus.Menu>
               <Modal.Window name="delete">
                   <ConfirmDelete
                       resourceName={`${!(quantity > 0) ?
                        Language==="en"?"Consumption":"استهلاك":
                        Language==="en"?"Replenish":"تعبئة"} ${Language==="en"?"For":"ل"} ${name}`}
                       Language={Language}
                       disabled={false}
                       onConfirm={() => {DeleteStorageActivity(id)}}
                   />
               </Modal.Window>
               </Modal>
                }
            </TableRow>
            
        </>
    );
}

