import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";
export function useLogin() {
  const queryClient = useQueryClient();
  const Language = useSettingsStore(state => state.Language);
  const router = useRouter();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueriesData(["user"], user.user);
      queryClient.setQueriesData(["userData"], user.user);
      router.push("/dashboard");
    },
    onError: (err) => {
      console.log("ERROR", err);
      toast.error(Language==="en"?"Provided email or password are incorrect":"البريد الإلكتروني او كلمة المرور غير صحيحة");
    },
  });

  return { login, isLoading };
}
