import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FilterSidebar({ categories, initialFilters = {} }) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([initialFilters.minPrice || 0, initialFilters.maxPrice || 1000]);
  const [selectedCategories, setSelectedCategories] = useState(initialFilters.categories || []);
  const [ratings, setRatings] = useState(initialFilters.ratings || []);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleRatingChange = (rating) => {
    setRatings(prev => {
      if (prev.includes(rating)) {
        return prev.filter(r => r !== rating);
      } else {
        return [...prev, rating];
      }
    });
  };

  const applyFilters = () => {
    const query = {
      ...router.query,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categories: selectedCategories.join(','),
      ratings: ratings.join(',')
    };

    // Remove empty filters
    Object.keys(query).forEach(key => {
      if (!query[key]) delete query[key];
    });

    router.push({
      pathname: router.pathname,
      query
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setRatings([]);
    
    const { q } = router.query; // Keep search query if exists
    router.push({
      pathname: router.pathname,
      query: q ? { q } : {}
    });
  };

  return (
    <Card className="h-auto">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <Slider
            defaultValue={priceRange}
            max={1000}
            step={5}
            onValueChange={setPriceRange}
            className="my-6"
          />
          <div className="flex justify-between">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-medium">Ratings</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={ratings.includes(rating)}
                  onCheckedChange={() => handleRatingChange(rating)}
                />
                <Label htmlFor={`rating-${rating}`}>
                  {rating}⭐ & Above
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-2 pt-4">
          <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}