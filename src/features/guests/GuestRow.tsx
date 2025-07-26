"use client";
import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";

import { useRouter } from "next/navigation";

import {
  Table,
  ConfirmDelete,
  Modal,
  Menus,
  Tag,
  Flag,
  Button,
} from "@/components/ui";

import { useDeleteBooking } from "@/hooks/bookings";
import { useCheckout } from "@/hooks/check-in-out";
import { useSettingsStore } from "@/components/WizardForm/useStore";

import { useGetProfile } from "@/hooks/authentication";
import { CreateGuestForm } from ".";
import { useEffect, useRef, useState } from "react";
const Name = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
  gap: 0.8rem;
`;
const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  & span:first-child {
    font-weight: 600;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.5rem;
  }
`;

const ExpandButton = styled(Button)`
  font-size: 1.8rem;
  padding: 0.2rem 0.5rem;
  display: flex;
  align-items: center;
`;
const Arrow = styled.span<{ expanded: boolean; language: string }>`
  display: inline-block;
  margin-left: 0.3rem;
  transform: ${(props: { expanded: boolean; language: string }) =>
    props.expanded
      ? `rotate(${props.language === "en" ? 90 : -90}deg)`
      : "rotate(0deg)"};
  transition: transform 0.5s ease;
`;
const ExpandableWrapper = styled.div<{
  expanded: string;
  contentheight: string;
}>`
  height: ${(props: { expanded: string; contentheight: string }) =>
    props.expanded === "true" ? `${Number(props.contentheight)}px` : "0"};
  overflow: hidden;
  transition: height 0.5s ease;
`;
type GuestRowPropType = {
  Guest: {
    id: number;
    guestp: number;
    national_id: number;
    full_name: string;
    country_flag: string;
    nationality: string;
    phone_number: number;
    address: string;
    email: string;
    gender: string;
    city: string;
    child: [];
  };
};

export default function GuestRow({ Guest }: GuestRowPropType) {
  const {
    id: GuestId,
    national_id,
    full_name,
    country_flag,
    nationality,
    phone_number,
    email,
    gender,
    city,
    guestp,
    child,
  } = Guest;
  // const navigate = useNavigate();

  const { deleteBooking, isDeleting } = useDeleteBooking();
  const [expanded, setExpanded] = useState(false);
  const [contentheight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  // Set the content height dynamically based on content ref
  useEffect(() => {
    if (contentRef.current) {
      // Calculate the content height
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);
  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };
  const Language = useSettingsStore(state => state.Language);
  const { permissions, owner } = useGetProfile();
  return (
    <>
      <Table.Row
        style={{ backgroundColor: guestp ? "var(--color-grey-300)" : "" }}
      >
        {child?.length > 0 ? (
          <ExpandButton style={{ fontSize: "1.8rem" }} onClick={toggleExpand}>
            {expanded ? "اخفاء" : "اظهار"}
            <Arrow language={Language} expanded={expanded}>
              {Language === "en" ? "→" : "←"}
            </Arrow>
          </ExpandButton>
        ) : (
          <div></div>
        )}
        <Name>{GuestId}</Name>
        <Name>{guestp ? `-> ${full_name}` : full_name}</Name>

        <Stacked>
          <span>
            {/* {country_flag && (
                        <Flag src={country_flag} alt={`Flag of ${nationality}`} />
                    )} */}
            {nationality}
          </span>
          <span>{city ? city : "-"}</span>
        </Stacked>

        <Stacked>
          <span>{national_id}</span>
          <span>{gender}</span>
        </Stacked>
        <Name>{phone_number ? phone_number : "-"}</Name>
        <Name>{email ? email : "-"}</Name>

        <Modal>
          <Menus.Menu>
            <Menus.Toggle
              id={GuestId.toString()}
            />
            <Menus.List id={GuestId.toString()}>
              {/* <Menus.Button
                            icon={<HiEye />}
                            onClick={() => navigate(`/Guests/${GuestId}`)}
                        >
                            {Language === "en" ? "Details" : "تفاصيل"}
                        </Menus.Button> */}
              <Modal.Open opens="add-Guest">
                <Menus.Button icon={<HiPencil />}>
                  {Language === "en" ? "Edit" : "تعديل"}
                </Menus.Button>
              </Modal.Open>

              {(owner || permissions?.GuestsDelete) && (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>
                    {Language === "en" ? "Delete" : "حذف"}
                  </Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>
          </Menus.Menu>
          <Modal.Window name="add-Guest">
            <CreateGuestForm GuestToEdit={Guest} />
          </Modal.Window>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="Guest"
              disabled={isDeleting}
              onConfirm={() => deleteBooking(GuestId)}
            />
          </Modal.Window>
        </Modal>
      </Table.Row>
      <ExpandableWrapper
        expanded={expanded.toString()}
        contentheight={contentheight.toString()}
      >
        <div ref={contentRef}>
          {child?.map((child: any) => {
            return <GuestRow key={child.id} Guest={child} />;
          })}
        </div>
      </ExpandableWrapper>
    </>
  );
}
