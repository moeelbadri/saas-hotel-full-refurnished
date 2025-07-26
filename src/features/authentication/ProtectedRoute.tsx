"use client";
import styled from "styled-components";
import { useUser } from "@/hooks/authentication";
import { Spinner } from "@/components/ui";
import { useRouter } from "next/navigation"; // ✅ Use next/navigation
import { useEffect } from "react";
import { setRolesVar } from "@/components/WizardForm/useStore";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSettings } from "@/hooks/settings";
const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`;

function ProtectedRoute({ children }: { children: React.ReactElement }) {
    const queryClient = useQueryClient();
    const navigate = useRouter();
    
    // 1. Load the authenticated user
    const { isLoading, data, isAuthenticated, error } = useUser();
    const { isLoading: isLoadingSettings, settings } = useSettings();
    
    const {
        hotel_name = "",
        address1 = "",
        address2 = "",
        vat = 0,
        starting_police_case_id = 0,
        id_scan = false,
    } = settings!.data!.settings || {};
    
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            navigate.push("/login");
            queryClient.clear();
        }
        if (error instanceof Error && error.message === "JWT expired") {
            navigate.push("/login");
            queryClient.clear();
        }
        if (error) {
            toast.error("Error!");
        }
    }, [isAuthenticated, isLoading, navigate, queryClient, error]);

    // 3. While loading, show a spinner
    if (isLoading) {
        return (
            <FullPage>
                <Spinner />
            </FullPage>
        );
    }
    // 4. If there IS a user, render the app
    if (isAuthenticated) return children;

    return null; // Optional fallback if neither condition is met
}

export default ProtectedRoute;
