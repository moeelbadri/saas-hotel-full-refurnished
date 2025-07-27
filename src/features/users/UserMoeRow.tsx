"use client";

import styled from "styled-components";
import { formatCurrency, formateDate } from "@/utils/helpers";
import { HiPencil, HiSquare2Stack, HiTrash, HiUserCircle } from "react-icons/hi2";
import { Menus, Modal, SpinnerMini } from "@/components/ui";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import { getRolesVar, useSettingsStore } from "@/components/WizardForm/useStore";
import {RolesForm} from "@/features/authentication";
import {useDeleteUser} from "@/hooks/authentication";
import { useGetProfile } from "@/hooks/authentication";
import { Tr,Td,ImageComponent,TdImage } from "@/components/ui/MoeTable";


const UserAvatar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: var(--color-brand-100);
    color: var(--color-brand-600);
    font-size: 2rem;
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Stacked = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    & span:first-child {
        font-weight: 600;
        font-size: 1.4rem;
    }

    & span:last-child {
        color: var(--color-grey-500);
        font-size: 1.2rem;
    }
`;

const Badge = styled.span<{ color?: string; textColor?: string }>`
    display: inline-block;
    padding: 0.2rem 0.8rem;
    border-radius: 100px;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    background-color: ${props => props.color || 'var(--color-grey-100)'};
    color: ${props => props.textColor || 'var(--color-grey-700)'};
    margin-right: 0.4rem;
    margin-bottom: 0.2rem;
`;

const PermissionsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    max-width: 15rem;
`;

const StatusBadge = styled(Badge)<{ isActive: boolean }>`
    background-color: ${props => props.isActive ? 'var(--color-green-100)' : 'var(--color-grey-100)'};
    color: ${props => props.isActive ? 'var(--color-green-700)' : 'var(--color-grey-600)'};
`;

const OwnerBadge = styled(Badge)`
    background-color: var(--color-yellow-100);
    color: var(--color-yellow-700);
`;

export default function UserMoeRow({ User }: { User: any; }) {
 const Language = useSettingsStore(state => state.Language);
    const { permissions , owner } = useGetProfile();
    const {DeleteUsers, isLoading:isDeleting, Tpromise: DeletePromise} = useDeleteUser();
    // Safe date formatting
    const formatLastSignIn = () => {
        if (!User.last_active_at) {
            return {
                date: Language === "en" ? "Never signed in" : "لم يسجل دخول من قبل",
                time: ""
            };
        }
        
        const date = new Date(User.last_active_at);
        const options = {
            year: 'numeric' as const,
            month: 'long' as const,
            day: 'numeric' as const,
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: true
        };
        
        const DateLanguage = (Language === "en" ? "en-US" : "ar");
        const formattedDate = new Intl.DateTimeFormat(DateLanguage, options).format(date);
        const formattedDateString = formattedDate.replace('، ', ' في ').split(Language === "en" ? "at" : "في");
        
        return {
            date: formattedDateString[0] || "",
            time: formattedDateString[1] || ""
        };
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!User.full_name) return "?";
        return User.full_name
            .split(' ')
            .map((name: string) => name.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Get active permissions count and main permissions
    const getPermissionsSummary = () => {
        if (!User.permissions || Object.keys(User.permissions).length === 0) {
            return {
                count: 0,
                mainPermissions: []
            };
        }

        const permissionKeys = Object.keys(User.permissions).filter(key => User.permissions[key] === true);
        const modules = ['Booking', 'Cabins', 'Storage', 'Statistics', 'Guests', 'Reports', 'Users'];
        const mainPermissions: string[] = [];

        modules.forEach(module => {
            const hasAnyPermission = ['Read', 'Write', 'Edit', 'Delete'].some(action => 
                User.permissions[`${module}${action}`] === true
            );
            if (hasAnyPermission) {
                mainPermissions.push(module);
            }
        });

        return {
            count: permissionKeys.length,
            mainPermissions: mainPermissions.slice(0, 3) // Show only first 3
        };
    };

    const { date: lastSignInDate, time: lastSignInTime } = formatLastSignIn();
    const { count: permissionCount, mainPermissions } = getPermissionsSummary();
    const isActive = User.last_active_at && new Date(User.last_active_at) > new Date(Date.now() - 24 * 60 * 60 * 1000); // Active in last 24h


    return (
        <Tr>
            <Td>
                {/* User Avatar */}
                <UserAvatar>
                    {User.full_name ? getUserInitials() : <HiUserCircle />}
                </UserAvatar>
            </Td>
            {/* User Info */}
            <Td><Stacked>
                <span>{User?.full_name || (Language === "en" ? "Unnamed User" : "مستخدم بدون اسم")}</span>
                <span>{User.email ?? "-"}</span>
                <span>{User.phone ?? "-"}</span>
            </Stacked></Td>
             {/* Last Sign In */}
            <Td><Stacked>
                <span>{lastSignInDate}</span>
                <span>{lastSignInTime}</span>
                <span>{User.last_action_at}</span>
            </Stacked></Td>

            <Td>{User.is_owner ? (
                <OwnerBadge>
                    {Language === "en" ? "Owner" : "المالك"}
                </OwnerBadge>
            ) : (
                <StatusBadge isActive={isActive}>
                    {isActive 
                        ? (Language === "en" ? "Active" : "نشط")
                        : (Language === "en" ? "Inactive" : "غير نشط")
                    }
                </StatusBadge>
            )}</Td>
             {/* Permissions Summary */}
            <Td>
                <Stacked>
                   {User.is_owner?<span>{Language === "en" ? "Owner" : "المالك"}</span> : <span>{permissionCount} {Language === "en" ? "permissions" : "صلاحية"}</span>}
                    <PermissionsList>
                        {mainPermissions.map(permission => (
                            <Badge key={permission} color="var(--color-blue-100)" textColor="var(--color-blue-700)">
                                {permission}
                            </Badge>
                        ))}
                        {mainPermissions.length > 3 && (
                            <Badge color="var(--color-grey-100)" textColor="var(--color-grey-600)">
                                +{mainPermissions.length - 3}
                            </Badge>
                        )}
                    </PermissionsList>
                </Stacked>
            </Td>
            {/* Phone */}
            
            <Td>{User.phone ?? "-"}</Td>

            {/* Created Date */}
            <Td>
                <Stacked>
                    <span>{formateDate(User.created_at, Language)}</span>
                </Stacked>
            </Td>
            <Td>
                  <Menus>
                    <Modal>
                        <Menus.Menu>
                            <Menus.Toggle id={User.id.toString()} />
                            <Menus.List id={User.id.toString()}>
                                {(permissions?.isOwner || permissions?.UsersEdit) && (
                                    <Modal.Open opens="Edit">
                                        <Menus.Button icon={<HiPencil />}>
                                            {Language === "en" ? "Edit Roles" : "تعديل الصلاحيات"}
                                        </Menus.Button>
                                    </Modal.Open>
                                )}
                                {(permissions?.isOwner || permissions?.UsersDelete) && !User.is_owner && (
                                    <Modal.Open opens="delete">
                                        <Menus.Button icon={<HiTrash />}>
                                            {Language === "en" ? "Delete" : "حذف"}
                                        </Menus.Button>
                                    </Modal.Open>
                                )}
                            </Menus.List>
                        </Menus.Menu>
                        <Modal.Window name="delete">
                            <ConfirmDelete
                                resourceName={User.full_name || User.email}
                                disabled={false}
                                onConfirm={() => {DeleteUsers(User.id);}}
                                isLoading={isDeleting}
                                promise={DeletePromise}
                            />
                        </Modal.Window>
                        <Modal.Window name="Edit">
                            <RolesForm 
                                User_id={User.id} 
                                hotel_id={User?.hotelId} 
                                User_Permissions={User?.permissions}
                            />
                        </Modal.Window>
                    </Modal>
                </Menus>
            </Td>
        </Tr>
    );
}