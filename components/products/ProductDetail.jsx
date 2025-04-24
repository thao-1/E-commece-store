import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, MessageSquare, Truck, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ type: '', message: '' });
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Fetch vendor details
        const vendorResponse = await fetch(`/api/vendors/${data.vendorId}`);
        
        if (!vendorResponse.ok) {
          throw new Error('Failed to fetch vendor details');
        }
        
        const vendorData = await vendorResponse.json();
        setVendor(vendorData);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId]);
  
  const handleImageChange = (index) => {
    setSelectedImage(index);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = async () => {
    if (!user) {
      setCartMessage({
        type: 'error',
        message: 'Please log in to add items to your cart'
      });
      return;
    }
    
    setAddingToCart(true);
    setCartMessage({ type: '', message: '' });
    
    try {
      // Add to cart using context
      await addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        maxQuantity: product.stock
      });
      
      setCartMessage({
        type: 'success',
        message: 'Product added to cart successfully!'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setCartMessage({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage({
        type: 'error',
        message: error.message || 'Failed to add to cart'
      });
    } finally {
      setAddingToCart(false);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-100 ${
                  selectedImage === index ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => handleImageChange(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
          
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">{product.rating}</span> 
              <span className="mx-1">•</span>
              <span>{product.reviewCount} reviews</span>
            </p>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              {product.compareAtPrice && (
                <p className="ml-3 text-lg text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</p>
              )}
              {product.compareAtPrice && (
                <p className="ml-3 text-sm font-medium text-green-600">
                  Save ${(product.compareAtPrice - product.price).toFixed(2)}
                </p>
              )}
            </div>
            
            <p className="mt-1 text-sm text-gray-500">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
              {product.stock > 0 && product.stock < 10 && (
                <span className="ml-2 text-orange-500">Only {product.stock} left!</span>
              )}
            </p>
          </div>
          
          <div className="mt-6 space-y-6">
            <p className="text-base text-gray-700">{product.description}</p>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <p className="text-sm text-gray-500">{product.stock} available</p>
            </div>
            
            <div className="mt-2 flex items-center">
              <button 
                onClick={decreaseQuantity}
                className="rounded-l-md border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 border-t border-b border-gray-300 px-3 py-2 text-center text-gray-700"
              />
              <button 
                onClick={increaseQuantity}
                className="rounded-r-md border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-100"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
            >
              <ShoppingCart size={20} className="mr-2" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <Heart size={20} className="mr-2" />
              Wishlist
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
          
          {cartMessage.message && (
            <div className={`p-3 rounded-md mt-4 ${
              cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {cartMessage.message}
            </div>
          )}
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <Truck size={20} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Free shipping over $100</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck size={20} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">2-year warranty</span>
              </div>
              <div className="flex items-center">
                <RefreshCw size={20} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vendor Info */}
      {vendor && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sold by</h2>
          <div className="flex items-center">
            <img 
              src={vendor.logo} 
              alt={vendor.name} 
              className="h-12 w-12 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
              <p className="text-sm text-gray-500">{vendor.location}</p>
            </div>
            <Link 
              to={`/vendors/${vendor._id}`}
              className="ml-auto text-orange-500 hover:text-orange-600 font-medium"
            >
              View Store
            </Link>
          </div>
        </div>
      )}
      
      {/* Reviews Section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
            <MessageSquare size={18} className="mr-1" />
            Write a Review
          </button>
        </div>
        
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm font-medium text-gray-900">{review.title}</p>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  By <span className="font-medium">{review.author}</span> on {new Date(review.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
            <p className="text-gray-500 mb-6">Be the first to review this product</p>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
