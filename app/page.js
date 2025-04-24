import FeaturedVendorsSection from '@/components/sections/featured-vendors-section';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to E-commerce Store</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing products from our verified vendors
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/auth/login"
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg border border-white hover:bg-blue-600 transition-colors"
            >
              Register
            </a>
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <FeaturedVendorsSection />
    </main>
  );
}
