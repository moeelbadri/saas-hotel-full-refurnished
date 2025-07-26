import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

export function useSignup() {
  const Language = useSettingsStore(state => state.Language);
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      toast.success(
        Language==="en"?"Account successfully created! Please verify the new account from the email address of the user.":
        "تم انشاء حسابك بنجاح! يرجى التحقق من الحساب  الجديد من خلال عنوان البريد الالكتروني للمستخدم.",
      );
    },
  });

  return { signup, isLoading };
}
