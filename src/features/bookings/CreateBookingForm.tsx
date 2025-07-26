"use client";
import { Input, Form, FormRow, Checkbox } from "@/components/form";
import { Button, Select, Spinner, SpinnerMini } from "@/components/ui";
import { useForm } from "react-hook-form";
import { Booking } from "@/utils/types";
import {
  useCreateBooking,
  useEditBooking,
  useGetAvailableCabins,
} from "@/hooks/bookings";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useDarkMode } from "@/hooks";

import "react-nice-dates/build/style.css";
import { useFloating, offset, shift, autoUpdate, flip } from '@floating-ui/react'

import { Step0, Step1, Step2, Step3, Step4 } from "@/components/WizardForm";
import { Wizard } from "react-use-wizard";
import { useSettings } from "@/hooks/settings";
import { useBookingStore } from "@/components/WizardForm/useStore";
import { formatCurrency } from "@/utils/helpers";
function CreateBookingForm({
  bookingToEdit,
  onCloseModal,
}: {
  bookingToEdit?: Booking;
  onCloseModal?: () => void;
}) {
  const { settings } = useSettings();
  const { isCreating, createBooking } = useCreateBooking();
  const { isEditing, editBooking } = useEditBooking();
  const Language = useSettingsStore(state => state.Language);

  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = (bookingToEdit as Booking) || {};
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState, setValue, getValues } =
    useForm<Booking>({
      defaultValues: isEditSession ? editValues : {},
    });

  const {
    familyMembers,
    familyKids,
    orderSummary,
    guestName,
    startDate,
    endDate,
    totalPrice,
    isLastStep,
    setIsLastStep,
    booking_activity,
    resetStore,
  } = useBookingStore();
  function onSubmit(data: Booking) {
    if (isEditSession) {
    }
    // editBooking(
    //     { BookingData: { ...data }, BookingId: editId },
    //     {
    //         onSuccess: () => {
    //             setIsLastStep(false);
    //             reset();
    //             resetStore();
    //             onCloseModal?.();
    //         },
    //     }
    // );
    else
      createBooking(
        {
          familyMembers,
          familyKids,
          orderSummary,
          booking_activity,
        },
        {
          onSuccess: () => {
            setIsLastStep(false);
            reset();
            resetStore();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors: any) {
    errors;
  }
  const { isDarkMode } = useDarkMode();
  const { refs, floatingStyles } = useFloating({
          placement:Language === "en" ? "left-start" : "right-start", // Default placement
          whileElementsMounted: autoUpdate, // Magically keeps position updated on scroll/resize
          strategy: "fixed",
          middleware: [
              offset(8),      // 8px gap between toggle and menu
              flip({ padding: 10 }), // Flip if it overflows, with 10px padding from viewport edge
              shift({ padding: 10 }), // Shift to stay in view, with 10px padding
          ],
      });
  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
      iswidestring={true.toString()}
    >
      <Wizard>
        <Step0 />
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
      </Wizard>
      <div style={{ marginBottom: "5rem" }}></div>
      <FormRow  ref={refs.setReference}>
        <>
          <Button
            type="reset"
            onClick={() => {
              resetStore();
              onCloseModal?.();
            }}
          >
            {Language == "en" ? "Cancel" : "الغاء"}
          </Button>
          {isLastStep && (
            <Button type="submit" disabled={isWorking}>
              {isEditSession
                ? Language === "en"
                  ? "Edit Booking"
                  : "تعديل الحجز"
                : Language === "en"
                ? "Add Booking"
                : "اضافة الحجز"}
            </Button>
          )}
        </>
      </FormRow>
      <div ref={refs.setFloating} style={{ 
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#FFFFFF" : "#000000",
        padding: "15px 20px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        border: `2px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
        minWidth: "200px",
        maxWidth: "300px"
      }}>
        <h1 style={{ margin: "0 0 5px 0", fontSize: "2rem", fontWeight: "bold" }}>
          {Language === "en"
            ? `Total Price: ${formatCurrency(
                Math.round(
                  (totalPrice.rooms + totalPrice.breakfast + totalPrice.amenities) *
                    ((100 + (settings?.data?.settings.vat ?? 0)) / 100)
                )
              )}`
            : `المبلغ الكلي: ${formatCurrency(
                Math.round(
                  (totalPrice.rooms + totalPrice.breakfast + totalPrice.amenities) *
                    ((100 + (settings?.data?.settings?.vat ?? 0)) / 100)
                )
              )}`}
        </h1>
        <h6 style={{ margin: "0", fontSize: "1rem", opacity: "0.7" }}>
          VAT Applied +
        </h6>
      </div>
    </Form>
  );
}

export default CreateBookingForm;
