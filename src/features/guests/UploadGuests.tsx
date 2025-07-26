import { Button, Modal ,Select} from "@/components/ui";
import { Column } from "@/components/layout";
import { UploadGuestsForm } from ".";
import { useSettingsStore } from "@/components/WizardForm/useStore";
export default function UploadGuests() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
            <Modal>
                <Modal.Open opens="add-uploadGuests">
                    <Column align="stretch">
                        <Button>{Language==="en"?"Upload Guests Data&bookings":"تحميل البيانات والحجوزات"}</Button>
                    </Column>
                </Modal.Open>
                <Modal.Window name="add-uploadGuests">
                    <UploadGuestsForm />
                </Modal.Window>
            </Modal>
        </>
    );
}