"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useRouter } from "next/navigation"; // ✅ Use next/navigation instead
import { toast } from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useTranslation } from "react-i18next";
import { CustomError } from "@/utils/helpers";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useLogin() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useRouter();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: login, status } = useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => loginApi({ email, password }),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Login in progress... " : "جاري تسجيل الدخول...",
                success : Language==="en"?`Successfully logged in`:`تم تسجيل الدخول بنجاح`,
                error: (error) => {
                    if (error.code === 401) return t("authUnauthorized");
                    if (error.code === 403) return t("authForbidden");
                    if (error.code === 404) return t("authNotFound");
                    if (error.code === 500) return t("authCredentialsError");
                    if (error.code === undefined) return t("networkError");
                    return t("networkError");
                }
            })
        },
        onSuccess: (user) => {
            promise.resolve(user);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.setQueryData(["user"], user);
            navigate.push("/dashboard");
        },

        onError: (err: CustomError) => {
            promise.reject(err);
            console.log("Auth error:", err.code, err.message); // ✅ Code should now appear
        },
    });
    const isLoading = status === "pending";
    return { login, isLoading, Tpromise };
}
