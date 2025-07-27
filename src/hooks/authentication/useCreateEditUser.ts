"use client";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useTranslation } from "react-i18next";
import { CustomError } from "@/utils/helpers";
import { createEditUser } from "@/services/apiAuth";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useCreateEditUser() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useRouter();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: CreateEditUser, status } = useMutation({
        mutationFn: ({
            email,
            password,
            full_name,
            phone,
            job,
            permissions
        }: {
            email: string;
            password: string;
            full_name: string;
            phone: string;
            job:any;
            permissions:any
        }) => createEditUser({ email, password, full_name , phone , job , permissions }),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Registration in progress... " : "جاري التسجيل...",
                success : Language==="en"?`Successfully registered`:`تم التسجيل بنجاح`,
                error : Language==="en"?"There was an error while registering":"حدث خطأ اثناء التسجيل"
            })
        },
        onSuccess: (user) => {
            promise.resolve(user);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            // queryClient.setQueryData(["user"], user);
        },

        onError: (err: CustomError) => {
            promise.reject();
            console.log("Auth error:", err.code, err.message);
            if(err.code === 401) toast.error(t("authUnauthorized"));
            if(err.code === 403) toast.error(t("authForbidden"));
            if(err.code === 404) toast.error(t("authNotFound"));
            if(err.code === undefined) toast.error(t("networkError"));
        },
    });
    const isLoading = status === "pending";
    return { CreateEditUser, isLoading, Tpromise };
}
