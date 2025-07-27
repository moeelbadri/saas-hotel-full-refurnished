"use client";
import styled from "styled-components";
import { HiSpeakerphone } from "react-icons/hi";
import { Heading } from "@/components/typography";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import useGetAnnouncements from "@/hooks/messages/useGetAnnoucements";
import { formatDistanceFromNow } from "@/utils/helpers";
import { CenteredError } from "@/components/ui";


const StyledSalesChart = styled.div`
    grid-column: 1 / -1;
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    display: flex;
    flex-direction: column;
    &:hover {
        overscroll-behavior-x: contain;
    }
    
    @media (max-width: 1200px) {
        padding: 2.8rem;
        gap: 2rem;
    }

    @media (max-width: 768px) {
        padding: 2.4rem;
        gap: 1.8rem;
        border-radius: var(--border-radius-sm);
    }

    @media (max-width: 480px) {
        padding: 2rem;
        gap: 1.5rem;
        margin: 0 -0.5rem;
        border-left: none;
        border-right: none;
        border-radius: 0;
    }
`;
export default function Announcements() {
  const { Announcements, error, isLoading, refetch } = useGetAnnouncements();
  const Language = useSettingsStore(state => state.Language);
  return (
    <StyledSalesChart>
      <Header>
        <HiSpeakerphone size={20} />
        <Heading as="h2">{Language === "en" ? "Announcements" : "الاعلانات"}</Heading>
      </Header>
  <CenteredError error={error} onRetry={refetch} isLoading={isLoading}>
      <List className="scrollable">
        {Announcements?.data?.announcements?.map((a) => (
          <Card key={a.id} $priority={a.priority} $Language={Language}>
            <Title>{a.topic}</Title>
            <Body>{a.content}</Body>
            <Meta style={{ textAlign: Language === "en" ? "right" : "left" }}>{formatDistanceFromNow(a.created_at,Language)}</Meta>
          </Card>
        ))}
      </List>
  </CenteredError>
    </StyledSalesChart>
  );
}

/* ---------- styles ---------- */
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
  color: var(--color-grey-700);
  font-weight: 600;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); // 220px is minimum card width
  gap: 1.6rem;
  width: 100%;
  max-height: 40vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;


const Card = styled.div<{ $priority: string,$Language?: string }>`
  padding: 2rem;
  border-radius: var(--border-radius-sm);
  ${({ $Language }) => $Language === "en" ? "border-left" : "border-right"}: 4px solid
    ${({ $priority }) =>
      $priority === "high"
        ? "var(--color-red-700)"
        : $priority === "medium"
        ? "var(--color-yellow-700)"
        : "var(--color-green-700)"};
  background-color: var(--color-grey-50);
  max-width: 500px;
  width: 100%; // Ensure it fills its grid cell
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 0.2rem;
`;
const Body = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-600);
`;
const Meta = styled.div`
  font-size: 1rem;
  color: var(--color-grey-500);
  margin-top: 0.5rem;
`;