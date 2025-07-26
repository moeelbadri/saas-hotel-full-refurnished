"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "@/services/apiAuth";
import { useRouter } from "next/navigation"; // Use Next.js router instead of react-router-dom
import { toast } from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useLogout() {
    const navigate = useRouter();
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);

    const { mutate: logout, status } = useMutation({
        mutationFn: logoutApi,
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Logout in progress... " : "جاري تسجيل الخروج...",
                success : Language==="en"?`Successfully logged out`:`تم تسجيل الخروج بنجاح`,
                error : Language==="en"?"There was an error while logging out":"حدث خطأ اثناء تسجيل الخروج"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.removeQueries();
            // remove auth from coookies
            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate.replace("/login");
        },
        onError: (err) => {
            promise.reject();
            toast.error(Language==="en"?"There was an error while logging out":"حدث خطأ اثناء تسجيل الخروج");
        },
    });
     const isLoading = status === "pending";
    return { logout, isLoading, Tpromise };
}
