import React, { useState } from 'react';
import styled from 'styled-components';
import { HiBell } from 'react-icons/hi';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';
import Badge from '@mui/material/Badge';
import { ButtonIcon } from '.';
import { useGetNotifications, usePatchNotifications } from '@/hooks/notifications';

import CenteredError from './CenteredError';
import { formateDate } from '@/utils/helpers';
import { useSettingsStore } from '@/components/WizardForm/useStore';

const MenuContainer = styled.div`
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-400);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 1000;
  @media (max-width: 768px) {
    width: 250px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MarkAll = styled.button`
  background: none;
  border: none;
  color: var(--color-blue-700);
  cursor: pointer;
  font-size: 0.9rem;
`;

const NotificationItem = styled.div<{ unread: string }>`
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-grey-200);
  background: ${({ unread }) => (unread === 'true' ? 'var(--color-grey-100)' : 'transparent')};
  font-weight: ${({ unread }) => (unread === 'true' ? '600' : '400')};
  &:hover {
    background: var(--color-grey-200);
  }
`;

function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const {Notifications,error,isLoading,refetch} = useGetNotifications();
  const {PatchNotifications} = usePatchNotifications();
  const Language = useSettingsStore(state => state.Language);
  const unreadCount = Notifications?.data?.notifications?.filter(notification => !notification.read_at).length || 0;
  const { refs, floatingStyles } = useFloating({
    placement: window.innerWidth < 768 ? 'bottom' : 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 10 }), shift({ padding: 10 })],
  });

  return (
    <>
      <ButtonIcon ref={refs.setReference} onClick={() => setOpen(o => !o)}>
        <Badge badgeContent={unreadCount} color="info" >
             <HiBell />
        </Badge>
      </ButtonIcon>
      {open && (
            <MenuContainer ref={refs.setFloating} style={floatingStyles} className="scrollable">
                <CenteredError error={error} isLoading={isLoading} onRetry={refetch}>
            <Header>
              <span>Notifications</span>
              {unreadCount > 0 && <MarkAll onClick={() => PatchNotifications(undefined)}>Mark all read</MarkAll>}
            </Header>
            {Notifications?.data?.notifications?.map(notification => (
              <NotificationItem key={notification.id} unread={Boolean(notification.read_at).toString()}>
                {!notification.read_at && <div style={{ fontSize: '1.1rem', textAlign: 'right' }}><button onClick={() => PatchNotifications(notification.id)}>Mark as read</button></div>}
                <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{notification.from}</div>
                <div style={{ fontSize: '1.3rem' }}>{notification.topic}</div>
                <div style={{ fontSize: '1.4rem' }}>{notification.content}</div>
                <div style={{ fontSize: '1.1rem', textAlign: 'right', opacity: 0.8,direction: 'rtl' }}>{formateDate(notification.created_at,Language)[1]}-{formateDate(notification.created_at,Language)[0]}</div>
              </NotificationItem>
            ))}
              </CenteredError>
        </MenuContainer> 
      )}
    </>
  );
}

export default NotificationMenu;
