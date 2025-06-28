


// Demo listings data
const demoListings = [
  {
    id: 1,
    title: "Lost iPhone 15 Pro Max",
    category: "Bicycle",
    subcategory: "iPhone",
    location: "Dhaka",
    date: "2024-01-15T10:30:00Z",
    status: "lost",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "John Doe",
    views: 45,
    reward: 5000,
  },
  {
    id: 2,
    title: "Found Black Leather Wallet",
    category: "Documents",
    subcategory: "Wallets",
    location: "Chattogram",
    date: "2024-01-14T15:20:00Z",
    status: "found",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "Jane Smith",
    views: 32,
  },
  {
    id: 3,
    title: "Missing Golden Retriever Dog",
    category: "Pets",
    subcategory: "Dogs",
    location: "Sylhet",
    date: "2024-01-13T08:45:00Z",
    status: "lost",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "Mike Johnson",
    views: 78,
    reward: 10000,
  },
  {
    id: 4,
    title: "Found Samsung Galaxy Watch",
    category: "Watches",
    subcategory: "Smart Watches",
    location: "Khulna",
    date: "2024-01-12T12:15:00Z",
    status: "found",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "Sarah Wilson",
    views: 23,
  },
  {
    id: 5,
    title: "Lost Blue Backpack with Laptop",
    category: "Bags",
    subcategory: "Backpacks",
    location: "Rajshahi",
    date: "2024-01-11T16:30:00Z",
    status: "lost",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "David Brown",
    views: 56,
    reward: 3000,
  },
  {
    id: 6,
    title: "Found Car Keys with BMW Keychain",
    category: "Keys",
    subcategory: "Car Keys",
    location: "Rangpur",
    date: "2024-01-10T09:20:00Z",
    status: "found",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "Lisa Davis",
    views: 19,
  },
  {
    id: 7,
    title: "Lost Diamond Ring",
    category: "Jewelry",
    subcategory: "Rings",
    location: "Barisal",
    date: "2024-01-09T14:10:00Z",
    status: "lost",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "Emily Chen",
    views: 67,
    reward: 15000,
  },
  {
    id: 8,
    title: "Found MacBook Pro 16 inch",
    category: "Phones & Tablets",
    subcategory: "iPad",
    location: "Mymensingh",
    date: "2024-01-08T11:45:00Z",
    status: "found",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "Alex Rodriguez",
    views: 89,
  },
  {
    id: 9,
    title: "Found MacBook Pro 16 inch",
    category: "Phones & Tablets",
    subcategory: "iPad",
    location: "Mymensingh",
    date: "2024-01-08T11:45:00Z",
    status: "found",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "Alex Rodriguez",
    views: 89,
  },
  {
    id: 10,
    title: "Found MacBook Pro 16 inch",
    category: "Phones & Tablets",
    subcategory: "iPad",
    location: "Mymensingh",
    date: "2024-01-08T11:45:00Z",
    status: "found",
    image: "https://sm.pcmag.com/pcmag_au/review/a/apple-ipho/apple-iphone-16_mm22.jpg",
    postedBy: "Alex Rodriguez",
    views: 89,
  },
  /* 
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 9,
    title: `Demo Item ${i + 9}`,
    category: "Other",
    subcategory: "Miscellaneous",
    location: "Dhaka",
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    status: i % 2 === 0 ? "lost" : "found",
    image: "/placeholder.svg?height=200&width=300",
    postedBy: `User ${i + 9}`,
    views: Math.floor(Math.random() * 100),
    reward: i % 3 === 0 ? Math.floor(Math.random() * 10000) + 1000 : null,
  })),
  */
]

import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import FilterSidebar from "../components/dashboard/FilterSidebar";
import ListingsGrid from "../components/dashboard/ListingsGrid";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { fetchPost } from "../features/posts/fetchPost"; // Assuming this is the correct path for your fetchPost action

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromURL = searchParams.get("category");
  const locationFromURL = searchParams.get("location");
  const dateFromURL = searchParams.get("date");
  const sortByFromURL = searchParams.get("sortBy") || "newest";
  const tabFromURL = searchParams.get("tab") || "all";
  const { postData = [] } = useSelector((state) => state.fetchPost);
  const [filteredListings, setFilteredListings] = useState(postData || []);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (postData == null || postData.length === 0) {
      console.log("Fetching posts for dashboard...");
      dispatch(fetchPost({ reqFrom: 'dashboard', limit: 200 }));
    }
    setFilteredListings(postData || []);
  }, [postData, dispatch]);

  const [filters, setFilters] = useState({
    category: null,
    location: null,
    date: null,
  });
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Load initial state from URL
  useEffect(() => {
    setFilters({
      category: categoryFromURL ? { category: categoryFromURL } : null,
      location: locationFromURL || null,
      date: dateFromURL || null,
    });
    setSortBy(sortByFromURL);
    setActiveTab(tabFromURL);
  }, [categoryFromURL, locationFromURL, dateFromURL, sortByFromURL, tabFromURL]);

  // Sync filters, sort, and tab to URL
  useEffect(() => {
    const newParams = {};

    if (filters.category?.category) newParams.category = filters.category.category;
    if (filters.location) newParams.location = filters.location;
    if (filters.date) newParams.date = filters.date;
    //if (sortBy) newParams.sortBy = sortBy;
    //if (activeTab) newParams.tab = activeTab;

    setSearchParams(newParams);
  }, [filters, sortBy, activeTab, setSearchParams]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "clear") {
      setFilters({
        category: null,
        location: null,
        date: null,
      });
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    }
  };

  const handleFilterRemove = (filterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: null,
    }));
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };



  useEffect(() => {
    let filtered = [...(postData || [])];


    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((listing) => listing.status === activeTab)
    }

    // Apply category filter
    if (filters.category) {
      if (filters.category.subcategory) {
        filtered = filtered.filter((listing) => listing.subcategory === filters.category.subcategory)
      } else {
        filtered = filtered.filter((listing) => listing.category === filters.category.category)
      }
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter((listing) => listing.location === filters.location)
    }

    // Apply date filter
    if (filters.date) {
      const now = new Date()
      const filterDate = new Date()

      switch (filters.date) {
        case "1day":
          filterDate.setDate(now.getDate() - 1)
          break
        case "3days":
          filterDate.setDate(now.getDate() - 3)
          break
        case "1week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "1month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "6months":
          filterDate.setMonth(now.getMonth() - 6)
          break
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((listing) => new Date(listing.date) >= filterDate)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case "location":
        filtered.sort((a, b) => a.location.localeCompare(b.location))
        break
      case "category":
        filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
    }

    setFilteredListings(filtered)
  }, [filters, sortBy, activeTab, dispatch, postData]);

  // Calculate counts for tabs
  const getCounts = () => {
    let baseListings = [...(postData || [])];


    // Apply current filters (except tab filter) to get accurate counts
    if (filters.category) {
      if (filters.category.subcategory) {
        baseListings = baseListings.filter((listing) => listing.subcategory === filters.category.subcategory)
      } else {
        baseListings = baseListings.filter((listing) => listing.category === filters.category.category)
      }
    }

    if (filters.location) {
      baseListings = baseListings.filter((listing) => listing.location === filters.location)
    }

    if (filters.date) {
      const now = new Date()
      const filterDate = new Date()

      switch (filters.date) {
        case "1day":
          filterDate.setDate(now.getDate() - 1)
          break
        case "3days":
          filterDate.setDate(now.getDate() - 3)
          break
        case "1week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "1month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "6months":
          filterDate.setMonth(now.getMonth() - 6)
          break
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      baseListings = baseListings.filter((listing) => new Date(listing.date) >= filterDate)
    }

    return {
      all: baseListings.length,
      lost: baseListings.filter((listing) => listing.status === "lost").length,
      found: baseListings.filter((listing) => listing.status === "found").length,
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mt-15 px-4 py-8">
        <div className="flex gap-6">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            isOpen={isMobileFilterOpen}
            onClose={closeMobileFilter}
            allListings={postData}
            currentTab={activeTab}
          />
          <ListingsGrid
            listings={filteredListings}
            filters={filters}
            onSortChange={handleSortChange}
            onTabChange={handleTabChange}
            activeTab={activeTab}
            counts={getCounts()}
            onFilterRemove={handleFilterRemove}
            onFilterToggle={toggleMobileFilter}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DashboardPage;
