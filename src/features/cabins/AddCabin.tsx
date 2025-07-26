import { Button, Modal } from "@/components/ui";
import { Column } from "@/components/layout";
import { CreateCabinForm } from ".";
import {useSettingsStore} from "@/components/WizardForm/useStore";
function AddCabin() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <div>
            <Modal>
                <Modal.Open opens="add-cabin">
                    <Column align="stretch">
                    <Button>{Language==="en"?"Add Room":"اضافة غرفة"}</Button>
                    </Column>
                </Modal.Open>
                <Modal.Window name="add-cabin">
                    <CreateCabinForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddCabin;
