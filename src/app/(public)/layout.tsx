import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CursorTrail from "@/components/CursorTrail";
import SmoothScroll from "@/components/SmoothScroll";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CursorTrail />
      <SmoothScroll>
        <Header />
        <main className="flex-1 pb-20">{children}</main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
