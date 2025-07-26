"use client";
import styled from "styled-components";
import type { discounts } from "@/utils/types";
import { formatCurrency, formateDate } from "@/utils/helpers";
import { useCreateCabin, useDeleteCabin } from "@/hooks/cabins";
import { CreateDiscountForm } from ".";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { Menus, Modal ,Tag} from "@/components/ui";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import { useSettingsStore } from "@/components/WizardForm/useStore";
const TableRow = styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1.2fr 1fr 1fr 1fr 1fr 1fr 1fr;
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
export default function DiscountRow({ discount }: { discount: discounts}) {
    const Language = useSettingsStore(state => state.Language);
    const { isDeleting, deleteCabin } = useDeleteCabin();
          const {
            id,
            created_at,
            start_date,
            end_date,
            discount:discountP,
            description,
        }: discounts = discount;
        const statusToTagName: any = {
            "ended": "red",
            "active": "green",
            "soon": "yellow",
            "انتهى": "red",
            "فعال": "green",
            "قريبا": "yellow",
        };
        const status = (new Date(start_date) <= new Date() && new Date() <= new Date(end_date)) ? (Language==="en"?"active":"فعال") : (new Date() > new Date(end_date) ? (Language==="en"?"ended":"انتهى") : (Language==="en"?"soon":"قريبا"));
    return (
        <>
            <TableRow>
                {/* <Img src={image} /> */}
                <Cabin>{id}</Cabin>
                <Stacked>
                    <span>{formateDate(created_at,Language)[0]}</span>
                    <span>{formateDate(created_at,Language)[1]}</span>
                </Stacked>
                <Discount>{discountP}%</Discount>
                <div>{start_date}</div>
                <div>{end_date}</div>
                <Tag type={statusToTagName[status]}>
                        {status.replace("-", " ")}
                    </Tag>
                <div>{description}</div>
                <div>
                    <Modal>
                        <Menus.Menu>
                            <Menus.Toggle id={id.toString()} xpos={Language==="en" ? 18 : 140} />

                            <Menus.List id={id.toString()}>
                          

                                <Modal.Open opens="edit">
                                    <Menus.Button icon={<HiPencil />}>
                                        {Language==="en"?"Edit":"تعديل"}
                                    </Menus.Button>
                                </Modal.Open>

                                <Modal.Open opens="delete">
                                    <Menus.Button icon={<HiTrash />}>
                                        {Language==="en"?"Delete":"حذف"}
                                    </Menus.Button>
                                </Modal.Open>
                            </Menus.List>

                            <Modal.Window name="edit">
                                <CreateDiscountForm DiscountToEdit={{ DiscountData: discount }}/>
                            </Modal.Window>

                            <Modal.Window name="delete">
                                <ConfirmDelete
                                    resourceName="cabins"
                                    disabled={isDeleting}
                                    onConfirm={() => deleteCabin(id)}
                                />
                            </Modal.Window>
                        </Menus.Menu>
                    </Modal>
                </div>
            </TableRow>
        </>
    );
}

