import { Button, Modal ,Select} from "@/components/ui";
import { Column } from "@/components/layout";
import { CreateGuestForm } from ".";
import { useSettingsStore } from "@/components/WizardForm/useStore";
function AddGuest() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <div>
            <Modal>
                <Modal.Open opens="add-Guest">
                    <Column align="stretch">
                        <Button>{Language==="en"?"Add Guest":"اضافة زائر"}</Button>
                    </Column>
                </Modal.Open>
                <Modal.Window name="add-Guest">
                    <CreateGuestForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddGuest;
