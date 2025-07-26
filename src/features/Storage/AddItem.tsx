import { Button, Modal ,Select} from "@/components/ui";
import { Column } from "@/components/layout";
import { CreateStorageItemForm } from ".";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function AddItem() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <div>
            <Modal>
                <Modal.Open opens="add-Item">
                    <Column align="stretch">
                        <Button>{Language==="en"?"Add Item":"اضافة عنصر"}</Button>
                    </Column>
                </Modal.Open>
                <Modal.Window name="add-Item">
                    <CreateStorageItemForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddItem;
