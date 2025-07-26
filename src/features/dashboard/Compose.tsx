import { Button, Modal } from "@/components/ui";
import  ComposeMessageForm from "./ComposeMessageForm";
import {useSettingsStore} from "@/components/WizardForm/useStore";
import { Column } from "@/components/layout";
function Compose() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <div>
            <Modal>
                <Modal.Open opens="compose-message">
                    <Column align="stretch">
                    <Button>{Language==="en"?"Compose":"إنشاء"}</Button>
                    </Column>
                </Modal.Open>
                <Modal.Window name="compose-message">
                    <ComposeMessageForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default Compose;
