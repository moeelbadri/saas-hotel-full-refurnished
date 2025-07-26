import { Button, Modal } from "@/components/ui";
import { Column } from "@/components/layout";
import { CreateBookingForm} from ".";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function AddBooking() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <div>
            <Modal>
                <Modal.Open opens="add-Booking">
                    <Column align="stretch">
                        <Button>{Language==="en"?"Add Booking":"اضافة حجز"}</Button>
                    </Column>
                </Modal.Open>
                <Modal.Window name="add-Booking">
                    <CreateBookingForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddBooking;
