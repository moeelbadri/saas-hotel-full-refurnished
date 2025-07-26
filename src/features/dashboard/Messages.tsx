"use client";
import styled from "styled-components";
import { Row } from "@/components/layout";
import { Heading } from "@/components/typography";
import {
  CenteredError,
  Button,
  SpinnerMini,
  Menus,
  TableBox,
  TableContainer,
  Modal,
  ViewMessage,
} from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useGetMessages, usePatchMessages } from "@/hooks/messages";
import Compose from "./Compose";
import { useGetProfile } from "@/hooks/authentication";
import { formateDate } from "@/utils/helpers";
import { Stacked, Td, Th } from "@/components/ui/MoeTable";

// ────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────
// Keep column widths in one place so header & rows stay perfectly aligned 🎯
const GRID_TEMPLATE = "200px 1fr 120px 120px 100px"; // sender ➜ receiver | message | sent | read at | action

// ────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ────────────────────────────────────────────────────────────
const StyledMessages = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
  width: 100%;
  max-height: 70vh;
  overflow: hidden;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

const MessagesList = styled.ul`
  flex: 1;
  min-height: 0;

  overflow-y: auto;
  overflow-x: hidden;
  list-style: none;
  padding: 0;
  margin: 0;

  scrollbar-width: thin;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-300);
    border-radius: 3px;
  }
`;

const HeaderRow = styled.li`
  display: grid;
  grid-template-columns: ${GRID_TEMPLATE};
  align-items: center;
  gap: 1.2rem;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  font-size: 1.3rem;
  background-color: var(--color-grey-100);
  position: sticky; /* stays visible at the top while scrolling */
  top: 0;
  z-index: 1;
`;

const MessageItem = styled.li<{ $unread: boolean }>`
  display: grid;
  grid-template-columns: ${GRID_TEMPLATE};
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1.2rem;
  background-color: ${({ $unread }) =>
    $unread ? "var(--color-primary-50)" : "var(--color-grey-50)"};
  border-radius: var(--border-radius-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CellMeta = styled.span`
  flex-shrink: 0;
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const CellContent = styled.span`
  font-size: 1.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CellAction = styled.button`
  border: none;
  background: none;
  color: var(--color-primary-600);
  font-size: 1.2rem;
  cursor: pointer;
  &:disabled {
    color: var(--color-grey-400);
    cursor: not-allowed;
  }
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
`;

// ────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────
function Messages() {
  const { Messages, error, isLoading, refetch } = useGetMessages();
  const { data } = useGetProfile();
  const Language = useSettingsStore((state) => state.Language);

  const { PatchMessages, isPatching } = usePatchMessages();

  const hasUnread = Messages?.data.messages.some(
    (m: any) => !m.is_read && m.receiver_id === data?.data?.profile.user_id
  );

  return (
    <StyledMessages>
      <Row direction="row" style={{ justifyContent: "space-between" }}>
        <Heading as="h2">{Language === "en" ? "Messages" : "الرسائل"}</Heading>
        <HeaderActions>
          {hasUnread && (
            <Button
              size="medium"
              variant="primary"
              onClick={() => PatchMessages(null)}
              disabled={isPatching}
            >
              {isPatching ? (
                <SpinnerMini />
              ) : Language === "en" ? (
                "Mark all as read"
              ) : (
                "تمييز الكل كمقروء"
              )}
            </Button>
          )}
          <Compose />
        </HeaderActions>
      </Row>

      <CenteredError error={error} onRetry={refetch} isLoading={isLoading}>
        <MessagesList>
          <Menus>
            <Modal>
              <TableContainer>
                <TableBox language={Language}>
                  <thead>
                    <tr>
                      <Th>{Language === "en" ? "From / To" : "من / إلى"}</Th>
                      <Th>{Language === "en" ? "Topic" : "الموضوع"}</Th>
                      <Th>{Language === "en" ? "Sent at" : "أُرسلت في"}</Th>
                      <Th>{Language === "en" ? "Read at" : "قرأت فيه"}</Th>
                      <Th>{Language === "en" ? "Action" : "الإجراء"}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {Messages?.data.messages.map((message: any) => {
                      return (
                        <tr
                          style={
                            message.is_read
                              ? { background: "var(--color-grey-200)" }
                              : { background: "var(--color-primary-50)" }
                          }
                          key={message.id}
                        >
                          <Td compact="true">
                            {message.receiver_id === data?.data?.profile.user_id
                              ? `from: ${message.sender}`
                              :(message.receiver) ? `to: ${message.receiver}`: `to: Announcement` }
                          </Td>
                          <Td compact="true">{message.topic}</Td>
                          <Td compact="true">
                            <Stacked>
                              <span>
                                {formateDate(message.created_at, Language)[0]}
                              </span>
                              <span>
                                {formateDate(message.created_at, Language)[1]}
                              </span>
                            </Stacked>
                          </Td>
                          {message.read_at ? (
                            <Td compact="true">
                              <Stacked>
                                <span>
                                  {formateDate(message.read_at, Language)[0]}
                                </span>
                                <span>
                                  {formateDate(message.read_at, Language)[1]}
                                </span>
                              </Stacked>
                            </Td>
                          ) : (
                            <Td compact="true"></Td>
                          )}
                          <Td compact="true">
                            <Modal.Open opens={`MessageModal-${message.id}`}>
                              <Button onClick={() => PatchMessages(message.id)}>
                                {Language === "en" ? "View" : "عرض"}
                              </Button>
                            </Modal.Open>
                          </Td>
                          <Modal.Window name={`MessageModal-${message.id}`}>
                            <ViewMessage
                              resourceName={{
                                content: message.content,
                                topic: message.topic,
                              }}
                              disabled={isPatching}
                              onConfirm={() =>
                                !message.is_read &&
                                message.receiver_id ===
                                  data?.data?.profile.user_id &&
                                PatchMessages(message.id)
                              }
                            />
                          </Modal.Window>
                        </tr>
                      );
                    })}
                  </tbody>
                </TableBox>
              </TableContainer>
            </Modal>
          </Menus>
        </MessagesList>

        {Messages?.data.messages.length === 0 && (
          <NoActivity>
            {Language === "en" ? "No Messages" : "لا يوجد رسائل"}
          </NoActivity>
        )}
      </CenteredError>
    </StyledMessages>
  );
}

export default Messages;
