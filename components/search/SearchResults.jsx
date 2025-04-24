// components/search/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '../products/ProductCard';
import FilterSidebar from './FilterSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

export default function SearchResults() {
  const router = useRouter();
  const { q, minPrice, maxPrice, categories, ratings, sort, page = 1 } = router.query;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (response.ok) {
          setAvailableCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (q) queryParams.append('q', q);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      if (categories) queryParams.append('categories', categories);
      if (ratings) queryParams.append('ratings', ratings);
      if (sort) queryParams.append('sort', sort);
      queryParams.append('page', page);
      queryParams.append('limit', 12);

      try {
        const response = await fetch(`/api/products/search?${queryParams.toString()}`);
        const data = await response.json();
        
        if (response.ok) {
          setProducts(data.products);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchProducts();
    }
  }, [router.isReady, q, minPrice, maxPrice, categories, ratings, sort, page]);

  const handleSortChange = (value) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        sort: value,
        page: 1 // Reset to first page when sorting changes
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {q ? `Search Results for "${q}"` : "All Products"}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full md:w-1/4">
          <FilterSidebar 
            categories={availableCategories}
            initialFilters={{
              minPrice: minPrice ? Number(minPrice) : 0,
              maxPrice: maxPrice ? Number(maxPrice) : 1000,
              categories: categories ? categories.split(',') : [],
              ratings: ratings ? ratings.split(',').map(Number) : []
            }}
          />
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          {/* Sort controls */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              {loading ? 'Loading...' : `Showing ${products.length} results`}
            </p>
            
            <Select onValueChange={handleSortChange} defaultValue={sort || 'newest'}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating_desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Product grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={{
                        pathname: router.pathname,
                        query: { ...router.query, page: pageNum }
                      }}
                      isActive={pageNum === Number(page)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}