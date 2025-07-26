"use client";
import { Button, Modal } from "@/components/ui";
import { Column } from "@/components/layout";
import {useSettingsStore} from "@/components/WizardForm/useStore";
import {CreateDiscountForm} from ".";

function AddDiscount() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <div>
            <Modal>
                <Modal.Open opens="add-discount">
                    <Column align="stretch">
                    <Button>{Language==="en"?"Add Discount":"اضافة خصم"}</Button>
                    </Column>
                </Modal.Open>
                <Modal.Window name="add-discount">
                    <CreateDiscountForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddDiscount;
