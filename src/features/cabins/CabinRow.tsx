"use client";
import styled from "styled-components";
import type { Cabin } from "@/utils/types";
import { formatCurrency } from "@/utils/helpers";
import { useCreateCabin, useDeleteCabin } from "@/hooks/cabins";
import { useGetAvailableDiscount } from "@/hooks/discounts";
import { CreateCabinForm } from ".";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { Menus, Modal } from "@/components/ui";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useState } from "react";
const TableRow = styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 0.3fr;
    column-gap: 2.0rem;
    align-items: center;
    padding: 1.4rem 3.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const Img = styled.img<{ isenlarged: boolean }>`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
    &:hover {
        cursor: pointer;
    }
  ${({ isenlarged }: { isenlarged: boolean }) =>
    isenlarged &&
    `
    position: fixed;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    max-width: 90%;
    max-height: 90%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  `}
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;
// const Hotel = styled.div`
//     font-family: "Sono";
//     font-weight: 500;
//     color: var(--color-green-700);
// `;
function CabinRow({ cabin,groupedObject }: { cabin: Cabin;groupedObject:any }) {
    const Language = useSettingsStore(state => state.Language);
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
            discount,
            description,
            image,
        }: Cabin = cabin;

    const discountP=(100-discount)/100;
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
    const ImageComponent = ({ src, alt }: { src: string; alt: string }) => {
        const [isEnlarged, setIsEnlarged] = useState(false);
      
        const handleClickOutside = () => {
          setIsEnlarged(false);
        };
      
        return (
          <>
            {isEnlarged && <Overlay onClick={handleClickOutside} />}
            <Img
              src={src}
              alt={alt}
              isenlarged={isEnlarged}
              onClick={() => setIsEnlarged(true)}
            />
          </>
        );
      };
    return (
        <>
            <TableRow>
                <div>{cabinId}</div>
                <ImageComponent src={image} alt={name} />
                <Cabin>{name}</Cabin>
                <div>{Language==="en" ? type_name_en : type_name_ar}</div>
                {/* <Price>{formatCurrency(reglarPrice)}</Price> */}
                {/* <div>Fits up to {maxCapacity}1 guests</div> */}
                <Price>
                    {(discount) ? (
                        <>
                            <span
                                style={{
                                    textDecoration: "line-through",
                                    marginRight: "0.5em",
                                }}
                            >
                                {formatCurrency(regular_price)}
                            </span>
                            <Discount>{formatCurrency(regular_price*discountP)}</Discount>
                        </>
                    ) : (
                        formatCurrency(regular_price)
                    )}
                </Price>
                {(discount) ? (
                    <Discount>{discount}%</Discount>
                ) : (
                    <span>&mdash;</span>
                )}
                <div>{hotel_name}</div>
                <div>
                    <Modal>
                        <Menus.Menu>
                            <Menus.Toggle id={cabinId.toString()}/>

                            <Menus.List id={cabinId.toString()}>
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

                                <Modal.Open opens="delete">
                                    <Menus.Button icon={<HiTrash />}>
                                        {Language ==="en" ? "Delete" : "حذف"}
                                    </Menus.Button>
                                </Modal.Open>
                            </Menus.List>

                            <Modal.Window name="edit">
                                <CreateCabinForm cabinToEdit={{ cabinData:cabin }}/>
                            </Modal.Window>

                            <Modal.Window name="edit-Category">
                                <CreateCabinForm cabinToEdit={{ cabinData:cabin,Cabins:groupedObject }}/>
                            </Modal.Window>
                            
                            <Modal.Window name="delete">
                                <ConfirmDelete
                                    resourceName="cabins"
                                    disabled={isDeleting}
                                    onConfirm={() => deleteCabin(cabinId)}
                                />
                            </Modal.Window>
                        </Menus.Menu>
                    </Modal>
                </div>
            </TableRow>
        </>
    );
}

export default CabinRow;
