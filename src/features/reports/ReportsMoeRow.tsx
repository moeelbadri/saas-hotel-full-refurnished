"use client";
import { HiMinus, HiPencil, HiPlus, HiTrash } from "react-icons/hi2";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import styled from "styled-components";
import { useRef, useState } from "react";
import { formateDate } from "@/utils/helpers";
import { SpinnerMini, Menus, ConfirmDelete, Modal , Tag } from "@/components/ui";
import { useDeleteStorageActivity } from "@/hooks/reports";
import { ImageComponent, Td, Tr } from "@/components/ui/MoeTable";

const Div = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
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
type ReportMoeRowProps = {
    ReportItem: any;
  };
  
  export default function ReportsMoeRow({ ReportItem }: ReportMoeRowProps) {
    const {DeleteStorageActivity,isDeleting,Tpromise}=useDeleteStorageActivity();
    const Language = useSettingsStore(state => state.Language);
    const menuId = `Reports-menu-${ReportItem.id}`;
    return (
      <>
            <Tr key={ReportItem.id}>
            <Td><Div>{ReportItem.id}</Div></Td>
            <Td><ImageComponent src={ReportItem.img} alt={"image alt"} /></Td>
            <Td><Div>{ReportItem.name}</Div></Td>
            <Td><Div>{ReportItem.quantity}</Div></Td>
            <Td><Div>{ReportItem.total_cost}</Div></Td>
            <Td><Tag type={`${!(ReportItem.total_cost > 0)?"red":"green"}`}>{!(ReportItem.total_cost > 0)?(Language==="en"?"Consumption":"استهلاك"):Language==="en"?"Replenish":"تعبئة"}</Tag></Td>
            {/* <Td><Tag type="red">{!(ReportItem.total_cost > 0)?<HiMinus/>:<HiPlus/>} {!(ReportItem.total_cost > 0)?(Language==="en"?"Consumption":"استهلاك"):Language==="en"?"Replenish":"تعبئة"}</Tag></Td> */}
            <Td><Stacked>
                <span>{formateDate(ReportItem.activity_created_at,Language)[0]}</span>
                <span>{formateDate(ReportItem.activity_created_at,Language)[1]}</span>
            </Stacked></Td>
            <Td><Div>{ReportItem.full_name}</Div></Td>
            <Td><Div>{ReportItem.description}</Div></Td>
            <Td>
          <Menus>
              <Modal>
               <Menus.Menu>
                   <Menus.Toggle id={menuId}/>
                   <Menus.List id={menuId}>
                       
                   <Modal.Open opens="delete">
                           <Menus.Button icon={<HiTrash />}>
                              {Language === "en" ? "Delete" : "حذف"}
                           </Menus.Button>
                       </Modal.Open>
                   </Menus.List>
               </Menus.Menu>
                 <Modal.Window name="delete">
                   <ConfirmDelete
                       resourceName={ReportItem.name}
                       Language={Language}
                       disabled={false}
                       isLoading={isDeleting}
                       onConfirm={() => {DeleteStorageActivity(ReportItem.id)}}
                       promise={Tpromise}
                   />
                 </Modal.Window>
            </Modal>
          </Menus>
         </Td>       
        </Tr>
    </>
)}