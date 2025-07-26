import { Button, Modal } from "@/components/ui";
import  CreateAlertForm from "./CreateAlertForm";
import {useSettingsStore} from "@/components/WizardForm/useStore";
import { Column } from "@/components/layout";
function AddAlert() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <div>
            <Modal>
                <Modal.Open opens="add-alert">
                    <Column align="stretch">
                    <Button>{Language==="en"?"Add":"اضافة"}</Button>
                    </Column>
                </Modal.Open>
                <Modal.Window name="add-alert">
                    <CreateAlertForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddAlert;
