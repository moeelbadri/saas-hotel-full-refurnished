import { Button, Modal } from "@/components/ui";
import { Column } from "@/components/layout";
import {useSettingsStore} from "@/components/WizardForm/useStore";
import { SignupForm } from "@/features/authentication";

function AddUser({disabled=false}) {
    const Language = useSettingsStore(state => state.Language);
    return (
        <div>
            <Modal>
                <Modal.Open opens="add-user">
                    <Column align="stretch">
                    <div className="tooltip">
                        {/* <span className="tooltiptext">xd</span> */}
                    <Button disabled={disabled}>{Language==="en"?"Add User":"اضافة مستخدم"}</Button>
                    </div>
                    </Column>
                </Modal.Open>
                <Modal.Window name="add-user">
                    <SignupForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddUser;
