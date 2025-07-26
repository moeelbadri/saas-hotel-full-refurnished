"use client";
import { HiMinus, HiPencil, HiPlus, HiTrash } from "react-icons/hi2";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { formateDate } from "@/utils/helpers";
import {
  SpinnerMini,
  Menus,
  ConfirmDelete,
  Modal,
  Tag,
  Button,
  Flag,
} from "@/components/ui";
import { useGetProfile } from "@/hooks/authentication";
import Link from "next/link";
const Img = styled.img`
  display: block;
  width: 4.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.8);
`;

const Div = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
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
const Td = styled.td<{ Language?: string }>`
  // border: 0.2px solid;
  // borderRadius:4px;
  padding: 1.4rem 2.4rem;
  max-width: 250px;
  background-color: var(--color-grey-000);
  white-space: normal;
  word-wrap: break-word;
  text-align: ${(props) => (props?.Language === "en" ? "center" : "center")};

  &:empty::before {
    content: "-";
  }
  //&:not(:last-child) {
  //     border-bottom: 1px solid var(--color-grey-100);
  //    }
`;
const ExpandButton = styled(Button)`
  font-size: 1.8rem;
  padding: 0.2rem 0.5rem;
  display: flex;
  align-items: center;
`;
const Arrow = styled.span<{ expanded: string; language: string }>`
  display: inline-block;
  margin-left: 0.3rem;
  transform: ${(props: { expanded: string; language: string }) =>
    props.expanded === "true"
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
  id: number;
  guest_p: number;
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
type GuestMoeRowProps = {
  GuestItem: GuestRowPropType;
  isLoading?: boolean;
};

export default function GuestMoeRow({
  GuestItem,
  isLoading,
}: GuestMoeRowProps) {
  //    // if (!StorageItems?.data.storage && !isLoading) return <Empty>No data to show at the moment</Empty>;
  const Language = useSettingsStore(state => state.Language);
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
  const rowRef = useRef<HTMLTableRowElement>(null);
  const { permissions, owner } = useGetProfile();
  const menuId = `guest-menu-${GuestItem.id}`;
  return (
    <>
      <tr key={GuestItem.id} ref={rowRef} style={{ position: "relative" }}>
        <Td>
          <Div>
            {(!GuestItem.guest_p && GuestItem.child?.length > 0) ? (
              <ExpandButton
                style={{ fontSize: "2rem" }}
                onClick={toggleExpand}
              >
                {expanded ? "اخفاء" : "اظهار"}
                <Arrow language={Language} expanded={expanded.toString()}>
                  {Language === "en" ? "→" : "←"}
                </Arrow>
              </ExpandButton>
            ) : (
              <div>-------&gt;</div>
            )}
          </Div>
        </Td>
        {/* <Td><Img src={GuestItem.img} /></Td> */}
        <Td>
          <Link
                href={`/guest/${GuestItem.id}`}
                style={{
                textDecoration: "underline",
                color: "inherit",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")} // blue-500
                onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
            >
                {GuestItem.guest_p ? `${GuestItem.full_name}` : GuestItem.full_name}
            </Link>
        </Td>
        <Td>
          <Div>
            <Stacked>
              <span>
                {GuestItem.country_flag && (
                        <Flag src={GuestItem.country_flag} alt={`Flag of ${GuestItem.nationality}`} />
                    )}
                {GuestItem.nationality}
              </span>
              <span>{GuestItem.city ? GuestItem.city : "-"}</span>
            </Stacked>
          </Div>
        </Td>

        <Td>
          <Div>
            <Stacked>
              <span>{GuestItem.national_id}</span>
              <span>{GuestItem.gender}</span>
            </Stacked>
          </Div>
        </Td>
        <Td>
          <Div>{GuestItem.phone_number}</Div>
        </Td>
        <Td>
          <Div>{GuestItem.email ? GuestItem.email : "-"}</Div>
        </Td>
        <Td>
          {false ? (
            <SpinnerMini />
          ) : (
                <Menus>
                  <Modal >
                      <Menus.Menu>
                          {/* The Toggle button with a unique ID */}
                          <Menus.Toggle id={menuId} />

                          {/* The List that opens, with the SAME ID and the row ref */}
                          <Menus.List id={menuId} >

                              {/* Action Button 1: Delete (opens a modal) */}
                              {(owner || permissions?.BookingDelete) && (
                                  <Modal.Open opens="delete">
                                      <Menus.Button icon={<HiTrash />}>{Language === "en" ? "Delete" : "حذف"}</Menus.Button>
                                  </Modal.Open>
                              )}
                          </Menus.List>

                          {/* The Modal Window for the delete confirmation */}
                          <Modal.Window name="delete">
                            <></>
                              {/* <ConfirmDelete
                                  resourceName={`Booking #${GuestItem.id}`}
                                  Language={Language}
                                  disabled={false}
                                  onConfirm={() => deleteBooking(BookingItem.id)} // Pass your delete mutation function here
                              /> */}
                          </Modal.Window>

                      </Menus.Menu>
                  </Modal>
              </Menus>
          )}
        </Td>
        
      </tr>
      {expanded && GuestItem.child?.map((child: any) => {
            return <GuestMoeRow key={child.id} GuestItem={child} />;
      })}
    </>
  );
}
