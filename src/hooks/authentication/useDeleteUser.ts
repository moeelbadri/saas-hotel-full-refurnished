"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/services/apiAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useDeleteUsers() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const Language = useSettingsStore(state => state.Language);

  const { mutate: DeleteUsers, status } = useMutation({
    mutationFn: deleteUser,
    onMutate: (e) => {
        toast.promise(Tpromise,{
            loading : Language==="en"?"Deleting user in progress... " : "جاري حذف المستخدم...",
            success : Language==="en"?`User deleted successfully`:`تم حذف المستخدم بنجاح`,
            error : Language==="en"?"There was an error while deleting user":"حدث خطأ اثناء حذف المستخدم"
        })
    },
    onSuccess: (data) => {
      promise.resolve(data);
      Tpromise = new Promise((resolve, reject) => {
          promise.resolve = resolve;
          promise.reject = reject;
      });
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false, refetchType: "active" });
      // Optionally, navigate somewhere after deletion if needed:
      // router.push('/some-route');
    },
    onError: (err) => {
      promise.reject();
      toast.error("Something went wrong");
    },
  });

  const isLoading = status === "pending";
  return { DeleteUsers, isLoading, Tpromise };
}
