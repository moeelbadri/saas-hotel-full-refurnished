"use client";
import styled from "styled-components";
import type { Alert } from "@/utils/types";
import { formateDate } from "@/utils/helpers";
import { useDeleteAlerts } from "@/hooks/settings";
import { CreateAlertForm } from ".";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { Menus, Modal ,Tag} from "@/components/ui";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Td, Tr } from "@/components/ui/MoeTable";
const TableRow = styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.1fr;
    column-gap: 1.4rem;
    align-items: center;
    padding: 1.0rem 2.5rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const Field = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
    max-width: 10rem;
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

const Name = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

export default function AlertsRow({ Alert }: { Alert:Alert }) {
    console.log(Alert)
    const Language = useSettingsStore(state => state.Language);
    const { deleteAlert, isDeleting, Tpromise: DeletePromise } = useDeleteAlerts();

      const {
        id,
        created_at,
        message,
        priority_level,
        Permanent,
        explain,
        full_name,
        end_date,
        time_resolved
      }= Alert;
      return (
        <Tr key={id}>
            <Td>{id}</Td>
             <Td><>{priority_level === -1 && (
                <Tag type="green">{Language === "en" ? "Notes" : "ملاحظات"}</Tag>
            )}
            {priority_level === 0 && (
                <Tag type="blue">{Language === "en" ? "Low" : "منخفض"}</Tag>
            )}
            {priority_level === 1 && (
                <Tag type="blue">{Language === "en" ? "Important" : "مهم"}</Tag>
            )}
            {priority_level === 2 && (
                <Tag type="red">{Language === "en" ? "Urgent" : "عاجل"}</Tag>
            )}</></Td>
            <Td><Stacked><span>{formateDate(created_at,Language)?.[0]}</span><span>{formateDate(created_at,Language)?.[1]}</span></Stacked></Td>
            <Td><Stacked><span>{formateDate(end_date,Language)?.[0]}</span><span>{formateDate(end_date,Language)?.[1]}</span></Stacked></Td>
            <Td>{message}</Td>
            <Td><Stacked><span>{formateDate(time_resolved,Language)?.[0]}</span><span>{formateDate(time_resolved,Language)?.[1]}</span></Stacked></Td>
            <Td>{full_name}</Td>
            <Td>{explain}</Td>
            <Td>
              <Menus>
                 <Modal>
                        <Menus.Menu>
                            <Menus.Toggle id={id.toString()} />

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
                                <CreateAlertForm alertToEdit={{ alertData: Alert }}/>
                            </Modal.Window>

                            <Modal.Window name="delete">
                                <ConfirmDelete
                                    resourceName="alert"
                                    disabled={isDeleting}
                                    onConfirm={() => deleteAlert(Alert)}
                                    isLoading={isDeleting}
                                    promise={DeletePromise}
                                />
                            </Modal.Window>
                        </Menus.Menu>
                    </Modal>
                </Menus>
            </Td>
         </Tr>
    );
}

