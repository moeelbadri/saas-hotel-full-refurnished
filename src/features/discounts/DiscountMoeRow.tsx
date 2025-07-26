"use client";
import { ConfirmDelete, Menus, Modal, SpinnerMini, Tag } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useDarkMode } from "@/hooks";
import { useGetAllDiscounts } from "@/hooks/discounts";
import { useGetProfile } from "@/hooks/authentication";

import { formateDate } from "@/utils/helpers";
import { discounts } from "@/utils/types";
import { HiPencil, HiTrash } from "react-icons/hi2";
import styled from "styled-components";
import { CreateDiscountForm } from ".";
import { Tr, Td } from "@/components/ui/MoeTable";
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
const Discount = styled.div`
    font-family: "Sono";
    font-weight: 600;
    color: var(--color-green-700);
`;
export default function DiscountMoeRow({discount}:{discount:discounts}) {
    // const { discounts } = useGetAllDiscounts();
        const Language = useSettingsStore(state => state.Language);
        const { owner, permissions } = useGetProfile();
        const statusToTagName: any = {
          "ended": "red",
          "active": "green",
          "soon": "yellow",
          "انتهى": "red",
          "فعال": "green",
          "قريبا": "yellow",
      };
     const status = (new Date(discount.start_date) <= new Date() && new Date() <= new Date(discount.end_date)) ? (Language==="en"?"active":"فعال") : (new Date() > new Date(discount.end_date) ? (Language==="en"?"ended":"انتهى") : (Language==="en"?"soon":"قريبا"));
     const menuId = `discount-menu-${discount.id}`;
    return (
       <>
    <Tr key={discount.id}>
        <Td>{discount.id}</Td>
        <Td>
        <Stacked>
            <span>{formateDate(discount.created_at,Language)[0]}</span>
            <span>{formateDate(discount.created_at,Language)[1]}</span>
        </Stacked>
        </Td>
        <Td><Discount>{discount.discount}%</Discount></Td>
        <Td><span>{formateDate(discount.start_date,Language)[0]}</span></Td>
        <Td><span>{formateDate(discount.end_date,Language)[0]}</span></Td> 
        <Td><Tag type={statusToTagName[status]}>
            {status?.replace("-", " ")}
        </Tag></Td>
        <Td>{discount.description}</Td>
         <Td>
             {false ? (
            <SpinnerMini />
          ) : (
                <Menus>
                  <Modal >
                      <Menus.Menu>
                          {/* The Toggle button with a unique ID */}
                          <Menus.Toggle id={menuId} />

                          {/* The List that opens, with the SAME ID and the row ref */}
                          <Menus.List id={menuId} >
                              {/* Action Button 1: Edit (opens a modal) */}
                              {(owner || permissions?.BookingEdit) && (
                                  <Modal.Open opens="edit">
                                      <Menus.Button icon={<HiPencil />}>{Language === "en" ? "Edit" : "تعديل"}</Menus.Button>
                                  </Modal.Open>
                              )}
                              {/* Action Button 1: Delete (opens a modal) */}
                              {(owner || permissions?.BookingDelete) && (
                                  <Modal.Open opens="delete">
                                      <Menus.Button icon={<HiTrash />}>{Language === "en" ? "Delete" : "حذف"}</Menus.Button>
                                  </Modal.Open>
                              )}
                          </Menus.List>

                          {/* The Modal Window for the delete confirmation */}
                          <Modal.Window name="delete">
                              <ConfirmDelete
                                  resourceName={`Discount #${discount.id}`}
                                  Language={Language}
                                  disabled={false}
                                  onConfirm={() => console.log("Delete")}
                                  // onConfirm={() => deleteBooking(BookingItem.id)} // Pass your delete mutation function here
                              />
                          </Modal.Window>
                            <Modal.Window name="edit">
                                <CreateDiscountForm DiscountToEdit={{ DiscountData: discount }}/>
                            </Modal.Window>
                      </Menus.Menu>
                  </Modal>
              </Menus>
          )}
         </Td>
        </Tr>
       </>
    );
}