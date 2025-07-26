// app/layout.tsx
import { Breadcrumb } from "@/components/layout";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { AppLayout, Main } from "@/components/layout/styled/styles";
// (Optional) You can export some metadata if you like
export const metadata = {
  title: "The Wild Oasis",
  description: "Hotel Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <Header />
      <Sidebar />
      <Main>
        <Breadcrumb />
        {children}
      </Main>
    </AppLayout>
  );
}
