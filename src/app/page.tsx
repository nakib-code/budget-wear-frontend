import Header from "@/components/Header";
import SelectionAnnouncement from "@/components/SelectionAnnouncement";
import InfoBar from "@/components/InfoBar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/home/HomePage";

export default function Page() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
        <SelectionAnnouncement />
      </div>

      <InfoBar />
      <HomePage />
      <Footer />
    </>
  );
}
