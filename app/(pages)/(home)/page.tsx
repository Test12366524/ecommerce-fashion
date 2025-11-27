import AboutStore from "@/components/main/home-page/about-store";
import NewArrival from "@/components/main/home-page/arrival-product-grid";
import ProductCategories from "@/components/main/home-page/category-grid";
import Campaign from "@/components/main/home-page/new/campaign";
import CTA from "@/components/main/home-page/new/CTA";
import ProductSale from "@/components/main/home-page/product-sale";
import RunningCarousel from "@/components/main/home-page/running-carousel";
import Testimonials from "../testimonials/page";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="w-full p-2 md:mt-10">
        <RunningCarousel />
      </div>
      <Campaign />
      <div className="px-3 md:px-10">
        <AboutStore />
        <NewArrival />
        <ProductCategories />
        <ProductSale />
      </div>
      <CTA />
      <Testimonials />
    </div>
  );
}
