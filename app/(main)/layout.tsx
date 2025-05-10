import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";

function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default HomePageLayout;
