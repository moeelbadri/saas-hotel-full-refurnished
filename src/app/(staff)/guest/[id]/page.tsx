"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import styled from "styled-components";
import { getGuestById } from "@/services/apiGuests";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { User, Phone, Mail, MapPin, Calendar, CreditCard, Users, Receipt } from "lucide-react";
import { JSX } from "react";
import { formatCurrency } from "@/utils/helpers";
import Link from "next/link";

// Type Definitions
interface Child {
  id: string;
  full_name: string;
  nationality: string;
  country_flag: string;
  email: string | null;
  national_id: string | null;
  hotel_id: string;
  phone_number: string | null;
  city: string | null;
  address: string | null;
  guest_p: string;
  birth_date: string;
  gender: string;
  last_edit_time: string;
  last_edit_userid: string;
  last_booking: string;
  uploaded: boolean;
  passport_image: string | null;
}

interface Booking {
  id: number;
  created_at: string;
  check_in: string | null;
  check_out: string | null;
  guest_p: string;
  is_paid: boolean;
  observations: string | null;
  total_price: number;
  last_edit_user: string;
  last_edit_time: string;
  hotel_id: string;
  paid_in: string | null;
  is_confirmed: boolean;
  currently_guest_p: string;
  total_paid_price: number;
}

interface Guest {
  full_name: string;
  nationality: string;
  country_flag: string;
  email: string | null;
  national_id: string;
  phone_number: string;
  city: string | null;
  address: string | null;
  birth_date: string;
  gender: string;
  last_edit_userid: string;
  last_booking: string;
  uploaded: boolean;
  passport_image: string;
  id: string;
  created_at: string;
  check_in: string | null;
  check_out: string | null;
  guest_p: string;
  is_paid: boolean;
  observations: string | null;
  total_price: number;
  last_edit_user: string;
  last_edit_time: string;
  hotel_id: string;
  paid_in: string | null;
  is_confirmed: boolean;
  currently_guest_p: string;
  total_paid_price: number;
  child: Child[];
  bookings: Booking[];
}

interface ApiResponse {
  data: {
    guest: Guest[];
  };
}

interface BadgeProps {
  $variant: 'confirmed' | 'pending' | 'paid' | 'unpaid';
}

interface InfoItemProps {
  $iconColor?: string;
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: var(--color-grey-50);
  direction: ${props => props.dir};
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
`;

const HeaderCard = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  border: 1px solid var(--color-grey-100);
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const ImageSection = styled.div`
  flex-shrink: 0;
  position: relative;
`;

const ProfileImage = styled.div`
  width: 14rem;
  height: 14rem;
  border-radius: var(--border-radius-lg);
  background: var(--color-grey-100);
  border: 4px solid var(--color-grey-0);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    color: var(--color-grey-400);
    width: 6rem;
    height: 6rem;
  }
`;

const GuestInfo = styled.div`
  flex: 1;
`;

const GuestHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 3rem;
    font-weight: var(--fw-bold);
    color: var(--color-grey-800);
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 1.5rem;
    color: var(--color-grey-500);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InfoItem = styled.div<InfoItemProps>`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${props => props.$iconColor || 'var(--color-grey-500)'};
  }

  span {
    font-size: 1.1rem;
    color: var(--color-grey-700);
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;

  @media (min-width: 1280px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SectionCard = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  border: 1px solid var(--color-grey-100);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  svg {
    width: 1.75rem;
    height: 1.75rem;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: var(--fw-bold);
    color: var(--color-grey-800);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: var(--color-grey-50);

  th {
    padding: 1rem 1.25rem;
    text-align: ${props => (props.dir === 'rtl' ? 'right' : 'left')};
    font-size: 1rem;
    font-weight: var(--fw-semibold);
    color: var(--color-grey-600);
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--color-grey-100);

    &:last-child {
      border-bottom: none;
    }

    td {
      padding: 1rem 1.25rem;
      font-size: 1rem;
      color: var(--color-grey-700);

      &:first-child {
        font-weight: var(--fw-medium);
        color: var(--color-grey-800);
      }
    }
  }
`;

const BookingCard = styled.div`
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  border: 1px solid var(--color-grey-100);
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  div:first-child {
    h3 {
      font-weight: var(--fw-semibold);
      color: var(--color-grey-800);
      margin: 0 0 0.5rem 0;
    }

    p {
      font-size: 1rem;
      color: var(--color-grey-500);
      margin: 0;
    }
  }

  div:last-child {
    text-align: right;

    .price {
      font-size: 1.25rem;
      font-weight: var(--fw-bold);
      color: var(--color-green-700);
    }

    .paid {
      font-size: 1rem;
      color: var(--color-grey-500);
    }
  }
`;

const StatusBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Badge = styled.span<BadgeProps>`
  padding: 0.35rem 1rem;
  border-radius: var(--border-radius-lg);
  font-size: 0.8rem;
  font-weight: var(--fw-medium);
  text-transform: uppercase;

  ${props => {
    switch (props.$variant) {
      case 'confirmed':
        return `
          background: var(--color-green-100);
          color: var(--color-green-700);
        `;
      case 'pending':
        return `
          background: var(--color-yellow-100);
          color: var(--color-yellow-700);
        `;
      case 'paid':
        return `
          background: var(--color-blue-100);
          color: var(--color-blue-700);
        `;
      case 'unpaid':
        return `
          background: var(--color-red-100);
          color: var(--color-red-700);
        `;
      default:
        return `
          background: var(--color-grey-200);
          color: var(--color-grey-700);
        `;
    }
  }}
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const DetailCard = styled.div`
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;

  h3 {
    font-weight: var(--fw-semibold);
    color: var(--color-grey-600);
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
  }

  p {
    color: var(--color-grey-800);
    margin: 0;
    font-size: 1.2rem;
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-grey-50);
`;

const LoadingContent = styled.div`
  text-align: center;
  padding: 2.5rem;

  &.error {
    .emoji {
      font-size: 5rem;
      margin-bottom: 1.5rem;
    }

    p {
      font-size: 1.5rem;
      color: var(--color-grey-500);
      margin: 0;
    }
  }

  &.loading {
    .spinner {
      width: 5rem;
      height: 5rem;
      background: var(--color-grey-200);
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      animation: pulse 2s infinite;
    }

    p {
      font-size: 1.5rem;
      color: var(--color-grey-500);
      margin: 0;
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

export default function GuestPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const Language = useSettingsStore(state => state.Language);
  const { data, error, isLoading } = useSWR<ApiResponse>(id, () => getGuestById(id), { suspense: true });

  if (error) return (
    <LoadingContainer>
      <LoadingContent className="error">
        <div className="emoji">🤕</div>
        <p>Couldn't load guest</p>
      </LoadingContent>
    </LoadingContainer>
  );

  if (isLoading || !data) return (
    <LoadingContainer>
      <LoadingContent className="loading">
        <div className="spinner"></div>
        <p>Loading guest profile...</p>
      </LoadingContent>
    </LoadingContainer>
  );

  const guest: Guest = data.data.guest[0];

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString(Language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string | null): string | number => {
    if (!birthDate) return "Unknown";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Container dir={Language === 'ar' ? 'rtl' : 'ltr'}>
      <ContentWrapper>
        {/* Header Section */}
        <HeaderCard>
          <HeaderContent>
            {/* Profile Image Section */}
            <ImageSection>
              <ProfileImage>
                {guest?.passport_image ? (
                  <img
                    src={guest.passport_image}
                    alt={`${guest.full_name} passport`}
                  />
                ) : (
                  <User />
                )}
              </ProfileImage>
             
            </ImageSection>

            {/* Guest Info Section */}
            <GuestInfo>
              <GuestHeader>
                <h1>{guest?.full_name}</h1>
             <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {guest?.country_flag && (
                <img
                  src={guest.country_flag}
                  alt={`${guest.nationality} flag`}
                  style={{ width: '24px', height: '16px', objectFit: 'cover' }}
                />
              )}
              {guest?.nationality || "Not provided"}
            </p>

              </GuestHeader>

              <InfoGrid>
                <InfoColumn>
                  <InfoItem $iconColor="var(--color-brand-600)">
                    <Phone />
                    <span>{guest?.phone_number || "Not provided"}</span>
                  </InfoItem>
                  <InfoItem $iconColor="var(--color-brand-600)">
                    <Mail />
                    <span>{guest?.email || "Not provided"}</span>
                  </InfoItem>
                  <InfoItem $iconColor="var(--color-brand-600)">
                    <MapPin />
                    <span>{guest?.city || "Not provided"}</span>
                  </InfoItem>
                </InfoColumn>
                <InfoColumn>
                  <InfoItem $iconColor="var(--color-brand-700)">
                    <Calendar />
                    <span>Age: {calculateAge(guest?.birth_date)}</span>
                  </InfoItem>
                  <InfoItem $iconColor="var(--color-brand-700)">
                    <User />
                    <span>{guest?.gender}</span>
                  </InfoItem>
                  <InfoItem $iconColor="var(--color-brand-700)">
                    <CreditCard />
                    <span>ID: {guest?.national_id || "Not provided"}</span>
                  </InfoItem>
                </InfoColumn>
              </InfoGrid>
            </GuestInfo>
          </HeaderContent>
        </HeaderCard>

        <MainGrid>
          {/* Family Members Section */}

            <SectionCard>
              <SectionHeader>
                <Users style={{ color: 'var(--color-brand-600)' }} />
                <h2>Family Members</h2>
              </SectionHeader>
              <Table>
                <TableHead dir={Language === 'ar' ? 'rtl' : 'ltr'}>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Contact</th>
                  </tr> 
                </TableHead>
                <TableBody>
                  {guest?.child && guest.child.length > 0 && guest.child.map((child: Child) => (
                    <tr key={child.id}>
                      <td><Link
                        href={`/guest/${child.id}`}
                        style={{
                        textDecoration: "underline",
                        color: "inherit",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")} // blue-500
                        onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                    >
                        {child.full_name}
                    </Link></td>
                      <td>{calculateAge(child.birth_date)}</td>
                      <td>{child.gender}</td>
                      <td>{child.phone_number || child.email || "Not provided"}</td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>

          {/* Bookings Section */}
          {guest?.bookings && guest.bookings.length > 0 && (
            <SectionCard>
              <SectionHeader>
                <Receipt style={{ color: 'var(--color-green-700)' }} />
                <h2>Bookings</h2>
              </SectionHeader>
              <div>
                {guest.bookings.map((booking: Booking) => (
                  <BookingCard key={booking.id}>
                    <BookingHeader>
                      <div>
                        <h3>Booking #{booking.id}</h3>
                        <p>Created: {formatDate(booking.created_at)}</p>
                      </div>
                      <div>
                        <div className="price">{formatCurrency(booking.total_price)}</div>
                        <div className="paid">Paid: {formatCurrency(booking.total_paid_price)}</div>
                      </div>
                    </BookingHeader>
                    <StatusBadges>
                      <Badge $variant={booking.is_confirmed ? 'confirmed' : 'pending'}>
                        {booking.is_confirmed ? 'Confirmed' : 'Pending'}
                      </Badge>
                      <Badge $variant={booking.is_paid ? 'paid' : 'unpaid'}>
                        {booking.is_paid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </StatusBadges>
                  </BookingCard>
                ))}
              </div>
            </SectionCard>
          )}
        </MainGrid>

        {/* Additional Details Section */}
        <SectionCard style={{ marginTop: '2.5rem' }}>
          <SectionHeader>
            <h2>Additional Details</h2>
          </SectionHeader>
          <DetailsGrid>
            <DetailCard>
              <h3>Birth Date</h3>
              <p>{formatDate(guest?.birth_date)}</p>
            </DetailCard>
            <DetailCard>
              <h3>Last Booking</h3>
            <p>{formatDate(guest?.bookings?.toSorted?.((a, b) =>
                Math.abs(Date.now() - new Date(a.created_at).getTime()) -
                Math.abs(Date.now() - new Date(b.created_at).getTime())
                )?.[0]?.created_at)}</p>
            </DetailCard>
            <DetailCard>
              <h3>Address</h3>
              <p>{guest?.address || "Not provided"}</p>
            </DetailCard>
            <DetailCard>
              <h3>Created</h3>
              <p>{formatDate(guest?.created_at)}</p>
            </DetailCard>
            <DetailCard>
              <h3>Last Updated</h3>
              <p>{formatDate(guest?.last_edit_time)}</p>
            </DetailCard>
            <DetailCard>
              <h3>Uploaded Status</h3>
              <p>{guest?.uploaded ? "Yes" : "No"}</p>
            </DetailCard>
          </DetailsGrid>
        </SectionCard>
      </ContentWrapper>
    </Container>
  );
}