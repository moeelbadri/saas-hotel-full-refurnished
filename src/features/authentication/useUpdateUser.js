import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";
import { useSettingsStore } from "@/components/WizardForm/useStore";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const Language = useSettingsStore(state => state.Language);
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success(Language==="en"?"User account successfully updated.":"تم تحديث حساب المستخدم بنجاح");
      // queryClient.setQueriesData(["user"], user);
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateUser, isUpdating };
}
