"use client";
import styled from "styled-components";
import { formatCurrency } from "@/utils/helpers";
import { ConfirmConsumption, ConfirmDelete,ConfirmReplinch, Menus, Modal, SpinnerMini } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import {useAddStorageActivity, useDeleteStorageItem,useGetStorageItemsCategories} from "@/hooks/storage";
import { HiEye, HiMinus, HiPlus, HiTrash ,HiPencil} from "react-icons/hi2";
import { useGetProfile } from "@/hooks/authentication";

import { useRouter } from 'next/navigation';
import CreateStorageItemForm from "./CreateStorageItemForm";
import { useRef } from "react";
const TableRow = styled.div`
    display: grid;
    grid-template-columns: 0.8fr 1.8fr 2fr 1.1fr 1.1fr 1.1fr 1fr 0.1fr;
    column-gap: 2.4rem;
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

// const Hotel = styled.div`
//     font-family: "Sono";
//     font-weight: 500;
//     color: var(--color-green-700);
// `;

function StorageRow({ Storage }: { Storage: any}) {
          const {
            id: storage_item_id,
            name,
            img,
            location,
            cost,
            category,
            quantity: net_quantity
            }: any = Storage;
    const { permissions , owner } = useGetProfile();
    const router = useRouter();
    const Language = useSettingsStore(state => state.Language);
    const {addActivity,isAdding,Tpromise : TpromiseAdd}=useAddStorageActivity();
    const {deleteItem,isDeleting,Tpromise : TpromiseDelete}=useDeleteStorageItem();
    const {StorageItemsCategories,error,isLoading}=useGetStorageItemsCategories();
    const type = Language==="en"?"name":"ar_name";
    const rowRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <TableRow ref={rowRef}>
                <Div>{storage_item_id}</Div>
                <Img src={img} />
                <Div>{name}</Div>
                <Div>{isAdding?<SpinnerMini/>:net_quantity}</Div>
                <Price>{formatCurrency(cost)}</Price>
                <Div>{isLoading?<SpinnerMini/>:StorageItemsCategories?.data.storage.find((categoryD:any)=>categoryD.id===category)?.[type]}</Div>
                <Div>{location}</Div>
                {(false)?<SpinnerMini/>: //isAdding||isDeleting
                <Modal>
                <Menus.Menu>
                    <Menus.Toggle id={storage_item_id.toString()}/>
                    <Menus.List id={storage_item_id.toString()}>
                        <Menus.Button
                            icon={<HiEye />}
                            onClick={() => router.push(`/reports?itemId=${storage_item_id}`)}
                        >
                        {Language === "en" ? "Details" : "تفاصيل"}
                        </Menus.Button>
                        {(permissions?.StorageEdit||owner) &&
                       <>
                         <Modal.Open opens="edit">
                         <Menus.Button icon={<HiPencil />}>
                             {Language === "en" ? "Edit" : "تعديل"}
                         </Menus.Button>
                     </Modal.Open>
                      <Modal.Open opens="replinch">
                      <Menus.Button icon={<HiPlus />}>
                         {Language === "en" ? "Replenish" : "تعبئة"}
                      </Menus.Button>
                  </Modal.Open>
                  <Modal.Open opens="Consumption">
                      <Menus.Button icon={<HiMinus />}>
                         {Language === "en" ? "Consumption" : "استهلاك"}
                      </Menus.Button>
                  </Modal.Open>
                  </> } 
                      {(permissions?.StorageDelete||owner)&&
                      <Modal.Open opens="delete">
                            <Menus.Button icon={<HiTrash />}>
                               {Language === "en" ? "Delete" : "حذف"}
                            </Menus.Button>
                        </Modal.Open>}
                    </Menus.List>
                </Menus.Menu>

                <Modal.Window name="edit">
                    <CreateStorageItemForm ItemToEdit={{...Storage}}/>
                </Modal.Window>
                 <Modal.Window name="replinch">
                    <ConfirmReplinch
                        resourceName={name}
                        disabled={false}
                        onConfirm={(e) => { addActivity({ id: storage_item_id, newItemData: e, isReplinching: true })}}
                        isLoading={isAdding}
                        promise={TpromiseAdd}
                        />
                </Modal.Window>
                <Modal.Window name="Consumption">
                    <ConfirmConsumption
                        resourceName={name}
                        resourceQty={net_quantity}
                        disabled={false}
                        onConfirm={(e) => { addActivity({ id: storage_item_id, newItemData: e, isReplinching: false }) }}
                        isLoading={isAdding}
                        promise={TpromiseAdd}
                        />
                </Modal.Window>
                <Modal.Window name="delete">
                    <ConfirmDelete
                        resourceName={name}
                        disabled={false}
                        onConfirm={() => {deleteItem({storage_item_id,img})}}
                        isLoading={isDeleting}
                        promise={TpromiseDelete}
                    />
                </Modal.Window>
            </Modal>
}
            </TableRow>
            
        </>
    );
}

export default StorageRow;
