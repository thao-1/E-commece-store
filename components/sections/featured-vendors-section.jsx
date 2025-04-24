"use client";

import SectionTitle from '@/components/ui/section-title';
import TopVendors from '@/components/vendor/top-vendors';

export default function FeaturedVendorsSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Top Rated Vendors" 
          subtitle="Discover our most popular and highly rated vendors"
        />
        <TopVendors />
      </div>
    </section>
  );
}
