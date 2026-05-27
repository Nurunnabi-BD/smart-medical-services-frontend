import { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaUpload,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaSlidersH,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaPrescriptionBottleAlt,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";

const Pharmacy = () => {
  const { addToCart, setShowCartDrawer, cartCount } = useCart();
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("popular"); // popular, price-asc, price-desc, newest
  const [brandSearch, setBrandSearch] = useState("");

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);

  // Mock list of categories for banner slides (matching mockup)
  const categoriesList = [
    { name: "Prescription Medicines", color: "bg-pink-50 text-pink-600 border-pink-100", icon: "📄" },
    { name: "Pain Relief", color: "bg-red-50 text-red-600 border-red-100", icon: "💊" },
    { name: "Vitamins & Supplements", color: "bg-blue-50 text-blue-600 border-blue-100", icon: "🥛" },
    { name: "Skin Care", color: "bg-orange-50 text-orange-600 border-orange-100", icon: "🧴" },
    { name: "Hair Care", color: "bg-purple-50 text-purple-600 border-purple-100", icon: "💇" },
    { name: "Personal Care", color: "bg-yellow-50 text-yellow-600 border-yellow-100", icon: "🧼" },
    { name: "Baby Care", color: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: "🍼" },
    { name: "Health Devices", color: "bg-teal-50 text-teal-600 border-teal-100", icon: "🩺" },
    { name: "Ayurveda & Herbal", color: "bg-green-50 text-green-600 border-green-100", icon: "🌿" },
  ];

  // Static options for filters
  const brandsList = ["GSK", "Square Pharmaceuticals", "Beximco", "Cipla", "Incepta", "Renata", "Healthcare", "Himalaya", "Dabur", "Omron", "Dettol", "Savlon"];
  const formsList = ["Tablet", "Capsule", "Syrup", "Ointment", "Device", "Powder"];

  // Toggle brand selections
  const handleBrandChange = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
    setCurrentPage(1);
  };

  // Toggle form selections
  const handleFormChange = (formName) => {
    setSelectedForms((prev) =>
      prev.includes(formName)
        ? prev.filter((f) => f !== formName)
        : [...prev, formName]
    );
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearAll = () => {
    setSearch("");
    setSelectedCategory("All Categories");
    setSelectedBrands([]);
    setSelectedForms([]);
    setMaxPrice(5000);
    setSortBy("popular");
    setCurrentPage(1);
  };

  // Toggle wishlist
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: wishlist.includes(id) ? "Removed from Wishlist" : "Added to Wishlist",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Fetch medicines from API based on active filters
  const fetchFilteredMedicines = useCallback(async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
        maxPrice,
      };

      if (search) params.search = search;
      if (selectedCategory !== "All Categories") params.category = selectedCategory;

      // Note: Backend endpoint handles singular string matches.
      // If multiple are selected on client, we send the first one as filter or pass array.
      // For simplicity, we send first item from selected list or pass none if list is empty.
      if (selectedBrands.length > 0) params.brand = selectedBrands[0];
      if (selectedForms.length > 0) params.form = selectedForms[0];

      const res = await api.get("/medicines", { params });
      setMedicines(res.data.medicines);
      setTotalProducts(res.data.total);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Failed to load medicines:", err);
      Swal.fire("Error", "Failed to fetch pharmacy stock.", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, maxPrice, search, selectedCategory, selectedBrands, selectedForms]);

  // Trigger fetch when state variables change
  useEffect(() => {
    fetchFilteredMedicines();
  }, [fetchFilteredMedicines]);

  // Search submit trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFilteredMedicines();
  };

  // Prescription Upload click simulation
  const handlePrescriptionUpload = () => {
    Swal.fire({
      title: "Upload Prescription",
      text: "Please select a scanned image or PDF of your doctor's prescription.",
      input: "file",
      inputAttributes: {
        accept: "image/*,application/pdf",
        "aria-label": "Upload your prescription",
      },
      showCancelButton: true,
      confirmButtonText: "Upload & Verify",
      confirmButtonColor: "#0C8CE9",
      showLoaderOnConfirm: true,
      preConfirm: (file) => {
        if (!file) {
          Swal.showValidationMessage("Please select a file first");
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1500);
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Prescription Uploaded Successfully!",
          text: "Our registered pharmacist will review your prescription and add the required medicines directly to your cart.",
          confirmButtonColor: "#0C8CE9",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-main">
      
      {/* 1. HERO SEARCH BANNER */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-6 lg:p-12 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Slogans */}
          <div className="space-y-6 max-w-xl relative z-10">
            <h1 className="text-3xl lg:text-5xl font-black leading-tight">
              Your Health, Delivered <br /> to Your <span className="underline decoration-yellow-400">Doorstep</span>
            </h1>
            <p className="text-sm text-blue-100 font-semibold leading-relaxed">
              Order medicines online from our wide range of prescription and wellness products. Sourced directly from verified brands.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search medicines, healthcare products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white text-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold shadow outline-none border border-transparent focus:border-yellow-400 transition"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition duration-300"
              >
                Search
              </button>
            </form>

            {/* Checkpoints */}
            <div className="flex flex-wrap gap-4 text-xs font-bold text-blue-50 pt-2">
              <p className="flex items-center gap-1.5">
                <FaCheckCircle className="text-yellow-400" /> 100% Genuine Medicines
              </p>
              <p className="flex items-center gap-1.5">
                <FaCheckCircle className="text-yellow-400" /> Fast Home Delivery
              </p>
              <p className="flex items-center gap-1.5">
                <FaCheckCircle className="text-yellow-400" /> Secure Payment
              </p>
            </div>
          </div>

          {/* Right Upload Prescription widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center w-full max-w-xs relative z-10 shrink-0">
            <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <FaUpload size={18} />
            </div>
            <h3 className="font-extrabold text-sm uppercase tracking-wide">Upload Prescription</h3>
            <p className="text-xs text-blue-100 font-semibold mt-2 mb-4 leading-relaxed">
              Upload a valid prescription and our pharmacists will handle the rest.
            </p>
            <button
              onClick={handlePrescriptionUpload}
              className="w-full bg-white hover:bg-slate-100 text-blue-600 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition duration-300"
            >
              Upload Now
            </button>
          </div>
        </div>
      </div>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Shop by Category</h2>
          <button
            onClick={() => {
              setSelectedCategory("All Categories");
              setCurrentPage(1);
            }}
            className="text-[#0C8CE9] text-xs font-bold hover:underline"
          >
            View All
          </button>
        </div>

        {/* Categories Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {categoriesList.map((cat, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedCategory(cat.name);
                setCurrentPage(1);
              }}
              className={`p-4 rounded-2xl border text-center transition duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 ${
                selectedCategory === cat.name
                  ? "border-[#0C8CE9] bg-blue-50 text-[#0C8CE9] shadow-sm font-bold"
                  : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50 font-semibold"
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] uppercase tracking-wider block leading-tight">
                {cat.name.split(" ")[0]} {cat.name.split(" ")[1] || ""}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN STOREFRONT FILTERS & PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-6">
        
        {/* FILTERS PANEL */}
        <div className="w-full lg:w-64 shrink-0 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm h-fit space-y-6">
          <div className="flex justify-between items-center pb-3 border-b">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <FaSlidersH /> Filters
            </h3>
            <button
              onClick={handleClearAll}
              className="text-[#0C8CE9] text-[10px] font-bold uppercase hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === "All Categories"
                    ? "bg-[#0C8CE9]/10 text-[#0C8CE9] font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Categories
              </button>
              {categoriesList.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    selectedCategory === cat.name
                      ? "bg-[#0C8CE9]/10 text-[#0C8CE9] font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Brands</label>
            {/* Search Brand input */}
            <input
              type="text"
              placeholder="Search brands..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full border p-2.5 rounded-xl text-xs bg-slate-50 border-slate-100 outline-none focus:border-[#0C8CE9] font-semibold text-slate-800"
            />
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {brandsList
                .filter((brand) => brand.toLowerCase().includes(brandSearch.toLowerCase()))
                .map((brand) => (
                  <label key={brand} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="rounded border-slate-300 text-[#0C8CE9] focus:ring-[#0C8CE9]"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Price Range</span>
              <span className="text-[#0C8CE9] font-black">৳ 0 - ৳ {maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0C8CE9]"
            />
          </div>

          {/* Form Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medicine Form</label>
            <div className="space-y-1.5">
              {formsList.map((form) => (
                <label key={form} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedForms.includes(form)}
                    onChange={() => handleFormChange(form)}
                    className="rounded border-slate-300 text-[#0C8CE9] focus:ring-[#0C8CE9]"
                  />
                  <span>{form}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT GRID SECTION */}
        <div className="flex-1 space-y-6">
          {/* Header toolbar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-slate-500">
              Showing {medicines.length === 0 ? 0 : (currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, totalProducts)} of {totalProducts} products
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-400 whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="border p-2 rounded-xl text-xs bg-slate-50 border-slate-100 outline-none text-slate-800 font-bold focus:border-[#0C8CE9]"
              >
                <option value="popular">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Loading Loader or Grid */}
          {loading ? (
            <div className="h-96 flex items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <BeatLoader color="#0C8CE9" size={15} />
            </div>
          ) : medicines.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm text-center p-6 gap-3">
              <FaPrescriptionBottleAlt size={48} className="text-slate-200" />
              <h3 className="font-bold text-slate-500">No medicines found</h3>
              <p className="text-xs text-slate-400 font-semibold max-w-sm">No items in the store match your active filters. Try clearing filters or searching for something else.</p>
              <button onClick={handleClearAll} className="mt-2 bg-[#0C8CE9] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase shadow-sm">Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
              {medicines.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-4 border border-slate-100 hover:shadow-lg transition-all duration-300 relative group flex flex-col justify-between"
                >
                  <div>
                    {/* Discount Badge */}
                    {item.discount > 0 && (
                      <span className="absolute top-4 left-4 bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider z-10">
                        {item.discount}% OFF
                      </span>
                    )}

                    {/* Wishlist Heart */}
                    <button
                      onClick={() => toggleWishlist(item._id)}
                      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-50/80 backdrop-blur hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition"
                    >
                      {wishlist.includes(item._id) ? (
                        <FaHeart className="text-red-500" size={14} />
                      ) : (
                        <FaRegHeart size={14} />
                      )}
                    </button>

                    {/* Image */}
                    <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-50/50 mb-3 border relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    {/* Info */}
                    <h3 className="font-extrabold text-slate-800 text-sm leading-tight hover:text-[#0C8CE9] transition cursor-pointer">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#0C8CE9] font-bold mt-0.5">{item.generic}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Brand: {item.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <div className="flex text-amber-400">
                        <FaStar size={10} />
                      </div>
                      <span className="font-extrabold text-slate-800">{item.rating}</span>
                      <span className="text-slate-400 font-semibold">({item.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      {item.discount > 0 && (
                        <span className="text-[10px] text-slate-400 line-through font-semibold leading-none">
                          ৳ {item.originalPrice}
                        </span>
                      )}
                      <span className="text-sm font-black text-slate-800">৳ {item.price}</span>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(item);
                        Swal.fire({
                          title: "Added to Cart!",
                          text: `"${item.name}" has been added to your shopping cart.`,
                          icon: "success",
                          showCancelButton: true,
                          confirmButtonText: "View Cart",
                          cancelButtonText: "Continue Shopping",
                          confirmButtonColor: "#0C8CE9",
                          cancelButtonColor: "#64748B",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            setShowCartDrawer(true);
                          }
                        });
                      }}
                      className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-[#0C8CE9] hover:text-white font-extrabold px-3 py-1.5 rounded-xl text-[10px] tracking-wider transition uppercase shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION WIDGET */}
          {totalPages > 1 && (
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
              >
                <FaChevronLeft size={10} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition ${
                    currentPage === page
                      ? "bg-[#0C8CE9] text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. FOOTER SERVICE BADGES (MATCHING MOCKUP) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0C8CE9] flex items-center justify-center shrink-0 border border-blue-100">
              <FaShieldAlt size={16} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Genuine Medicines</h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
                100% authentic medicines sourced directly from trusted pharmaceutical manufacturers.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0C8CE9] flex items-center justify-center shrink-0 border border-blue-100">
              <FaTruck size={16} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Fast Delivery</h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
                Quick home delivery at your doorstep within 24-48 hours across major cities.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0C8CE9] flex items-center justify-center shrink-0 border border-blue-100">
              <FaShieldAlt size={16} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Secure Payment</h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
                Multiple secure online payment gateways and convenient Cash on Delivery options.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0C8CE9] flex items-center justify-center shrink-0 border border-blue-100">
              <FaUndoAlt size={16} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Easy Returns</h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
                Hassle-free return policy within 7 days of delivery for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Floating View Cart Button (Mobile & Desktop convenience) */}
      {cartCount > 0 && (
        <button
          onClick={() => setShowCartDrawer(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#0C8CE9] hover:bg-blue-600 text-white font-extrabold px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 hover:animate-none"
        >
          <FaShoppingCart className="text-lg animate-bounce" />
          <span className="text-xs uppercase tracking-wider">View Cart</span>
          <span className="bg-white text-[#0C8CE9] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}
    </div>
  );
};

export default Pharmacy;
