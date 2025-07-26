"use client";
import { HiMinus, HiPencil, HiPlus, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { formatCurrency, formateDate } from "@/utils/helpers";
import {
  SpinnerMini,
  Menus,
  ConfirmDelete,
  Modal,
  Tag,
  Button,
} from "@/components/ui";
import { useGetProfile } from "@/hooks/authentication";
import { useDeleteCabin, useCreateCabin } from "@/hooks/cabins";
import { Cabin } from "@/utils/types";
import { CreateCabinForm } from ".";
import { Tr,Td, ImageComponent, TdImage } from "@/components/ui/MoeTable";
const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;


export default function CabinMoeRow({ cabin,groupedObject }: { cabin: Cabin;groupedObject:any }) {
    const { isDeleting, deleteCabin } = useDeleteCabin();
    const { isLoading: isDuplicating, createCabin: duplicateCabin } = useCreateCabin();
          const {
            id: cabinId,
            name,
            roomtype,
            type_name_en,
            type_name_ar,
            regular_price,
            hotel_name,
            discounts,
            description,
            image,
        }: Cabin = cabin;
  const Language = useSettingsStore(state => state.Language);
  const { permissions, owner } = useGetProfile();
  const menuId = `cabin-menu-${cabinId}`;
  const discountP=(100-discounts?.[0]?.discount)/100;
     function handleDuplicate() {
        duplicateCabin({
            name: `Copy of ${name}`,
            // maxCapacity,
            regular_price,
            // discounts,
            image,
            description,
            roomtype,
        } as Cabin);
    }
  return (
    <>
      <Tr key={cabinId.id}>
        <Td>
            {cabinId}
        </Td>
        <TdImage>
         <ImageComponent src={window.location.origin+"/istockphoto-1756553862-612x612.jpg"} alt={"image alt"} />
        </TdImage>
         <Td>
           {name}
        </Td>
        <Td>
         {Language==="en" ? type_name_en : type_name_ar}
        </Td>
        <Td>
        {(discounts && discounts.length > 0) ? (
        <div>
            <span
                style={{
                    textDecoration: "line-through",
                    marginRight: "0.5em",
                }}
            >
                {formatCurrency(regular_price)}
            </span>
            <Discount>{formatCurrency(regular_price*discountP)}</Discount>
        </div>
        ) : (
            formatCurrency(regular_price)
        )}
        </Td>

        <Td>
        {(discounts && discounts.length > 0) ? (
            <Discount>{discounts?.[0]?.discount}%</Discount>
        ) : (
            <span>&mdash;</span>
        )}
        </Td>
        {/* <Td>
          <Div>{hotel_name}</Div>
        </Td> */}
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

                              {/* Action Button 1: Delete (opens a modal) */}
                              {(owner || permissions?.BookingDelete) && (
                                  <Modal.Open opens="delete">
                                      <Menus.Button icon={<HiTrash />}>{Language === "en" ? "Delete" : "حذف"}</Menus.Button>
                                  </Modal.Open>
                              )}
                              <Menus.Button
                                icon={<HiSquare2Stack />}
                              onClick={handleDuplicate}
                              disabled={isDuplicating}
                          >
                              {Language ==="en" ? "Duplicate" : "تكرار"}
                          </Menus.Button>
                           <Modal.Open opens="edit">
                          <Menus.Button icon={<HiPencil />}>
                              {Language ==="en" ? "Edit" : "تعديل"}
                          </Menus.Button>
                      </Modal.Open>
                      <Modal.Open opens="edit-Category">
                          <Menus.Button icon={<HiPencil />}>
                              {Language==="en" ? "Edit All Rooms By Category " : "تعديل جميع الغرف بالفئة"}
                          </Menus.Button>
                      </Modal.Open>
                          </Menus.List>
                              <Modal.Window name="edit">
                                <CreateCabinForm cabinToEdit={{ cabinData:cabin }}/>
                            </Modal.Window>

                            <Modal.Window name="edit-Category">
                                <CreateCabinForm cabinToEdit={{ cabinData:cabin,Cabins:groupedObject }}/>
                            </Modal.Window>
                          {/* The Modal Window for the delete confirmation */}
                          <Modal.Window name="delete">
                              <ConfirmDelete
                                  resourceName={`Cabin #${cabinId}`}
                                  Language={Language}
                                  disabled={false}
                                  onConfirm={() => deleteCabin(cabinId)}
                                  // onConfirm={() => deleteBooking(BookingItem.id)} // Pass your delete mutation function here
                              />
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
