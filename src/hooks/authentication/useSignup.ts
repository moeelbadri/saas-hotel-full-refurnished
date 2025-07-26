"use client";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { Signup } from "@/services/apiAuth";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useSignup() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: signup, status } = useMutation({
        mutationFn: Signup,
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Signup in progress... " : "جاري التسجيل...",
                success : Language==="en"?`Account successfully created! Please verify the new account from the user's email address.`:`تم انشاء حسابك بنجاح! يرجى التحقق من الحساب الجديد من خلال عنوان البريد الالكتروني للمستخدم.`,
                error : Language==="en"?"There was an error while signing up":"حدث خطأ اثناء التسجيل"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["users"],exact:true,refetchType:"active" });
        },
        onError: (err) => {
            promise.reject();
            toast.error(Language==="en"?"There was an error while signing up":"حدث خطأ اثناء التسجيل");
        },
    });
    const isLoading = status === "pending";
    return { signup, isLoading, Tpromise };
}
