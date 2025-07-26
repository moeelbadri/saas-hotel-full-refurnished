import { useMutation ,useQueryClient} from "@tanstack/react-query";
import { updateUserRoles } from "@/services/apiAuth";
import { toast } from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useUpdateUserRoles() {
    const Language = useSettingsStore(state => state.Language);
    const queryClient = useQueryClient();
    
    const { 
        mutate: updateRoles,
        isLoading,
        error,      
    } = useMutation({
        mutationFn: ({ rolesData, id }: any) => updateUserRoles(rolesData, id),
        onMutate: (e) => {
            console.log("Request sent");
            // toast.loading("Updating user roles...");
            toast.promise(Tpromise, {
                loading: Language === "en" ? "Updating user roles..." : "جاري تحديث صلاحيات المستخدم...",
                success: Language === "en" ? "User roles updated successfully!" : "تم تحديث صلاحيات المستخدم بنجاح",
                error:  (error) => Language==="en"?`Failed to update user roles : ${error.message}`:`فشل في تحديث صلاحيات المستخدم : ${error.message}`
            })
        },
        onSuccess: () => {
            promise.resolve(true)
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["users"],exact:true,refetchType:"active" });
        },
        onError: (error: { message: string }) => {
            if(error.message!=="0"){
                promise.reject(error)
            }
        },
    });

    return { updateRoles, isLoading, error, Tpromise };
}
























// import { useQuery } from "@tanstack/react-query";
// import { updateUserRoles } from "@/services/apiAuth";
// import { toast } from "react-hot-toast";

// export default function useUpdateUserRoles( isOwner:boolean, isSEO:boolean, isCashier:boolean, isStorage:boolean,isStatistics:boolean,id:any) {
//     const { 
//         isLoading,
//         fetchStatus,
//         data: userRoles,
//         error,
//     } = useQuery({
//         queryKey: ['updateUserRoles',id],
//         queryFn: () => updateUserRoles(isOwner, isSEO, isCashier, isStorage,isStatistics ,id),
//         retry: false,
//          enabled: id!==0,
//          onSuccess: () => {
//             toast.success("User roles updated successfully!");
//         },
//     });

//     return { isLoading,fetchStatus, error, userRoles };
// }
