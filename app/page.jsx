import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeaturedProducts from "@/components/products/featured-products";
import CategoryCarousel from "@/components/ui/category-carousel";
import TopVendors from "@/components/vendor/top-vendors";
import LatestProducts from "@/components/products/latest-products";
import PromoSection from "@/components/ui/promo-section";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="relative bg-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Discover <span className="text-orange-500">Amazing</span> Products
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Shop from thousands of trusted vendors with real-time inventory updates and secure transactions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/categories">Shop Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                  <Link href="/vendor/register">Become a Vendor</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src="/images/hero-image.png"
                alt="Marketplace Hero"
                className="max-w-full rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Browse by Category
        </h2>
        <CategoryCarousel />
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <Link
            href="/products/featured"
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
          >
            View All
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      {/* Promo Section */}
      <PromoSection />

      {/* Top Vendors */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Top Vendors</h2>
          <Link
            href="/vendors"
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
          >
            View All
          </Link>
        </div>
        <TopVendors />
      </section>

      {/* Latest Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Arrivals</h2>
          <Link
            href="/products/latest"
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
          >
            View All
          </Link>
        </div>
        <LatestProducts />
      </section>

      {/* Newsletter */}
      <section className="bg-orange-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            Get the latest updates on new products, special offers, and vendor promotions.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}