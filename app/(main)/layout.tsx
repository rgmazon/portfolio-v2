import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer/Footer";
import ChatBot from "@/components/chat/ChatBot";
import { getFooterData } from "@/lib/db";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getFooterData();

  return (
    <>
      <Navbar />
      {children}
      <Footer data={footerData} />
      <ChatBot />
    </>
  );
}
