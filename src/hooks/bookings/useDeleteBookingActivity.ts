import { deleteBookingActivity } from "@/services/apiBookings";
import { Booking } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient,QueryCache } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useRouter } from "next/navigation";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useDeleteBookingActivity() {
    
    const { mutateAsync: deleteActivity, status } = useMutation({
        mutationFn: deleteBookingActivity,
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: "Deleting ...",
                success: "Deleted successfully",
                error: "There was an error while deleting",
            })
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
   },     
        onError: (err: { message: string }) => {
            promise.reject();
            toast.error(err.message);
        },
    });
 const isLoading = status === "pending";
    return {
        isDeleting: isLoading,
        deleteActivity,
        Tpromise,
    };
}