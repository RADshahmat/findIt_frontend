"use client"

import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import FilterSidebar from "../components/dashboard/FilterSidebar"
import ListingsGrid from "../components/dashboard/ListingsGrid"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useSelector, useDispatch } from "react-redux"
import { fetchPost } from "../features/posts/fetchPost"

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryFromURL = searchParams.get("category")
  const subcategoryFromURL = searchParams.get("subcategory")
  const locationFromURL = searchParams.get("location")
  const dateFromURL = searchParams.get("date")
  const sortByFromURL = searchParams.get("sortBy") || "newest"
  const tabFromURL = searchParams.get("tab") || "all"

  const { postData = [] } = useSelector((state) => state.fetchPost)
  const [filteredListings, setFilteredListings] = useState(postData || [])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (postData == null || postData.length === 0) {
      console.log("Fetching posts for dashboard...")
      dispatch(fetchPost({ reqFrom: "dashboard", limit: 200 }))
    }
    setFilteredListings(postData || [])
  }, [postData, dispatch])

  const [filters, setFilters] = useState({
    category: null,
    location: null,
    date: null,
  })
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Load initial state from URL
  useEffect(() => {
    setFilters({
      category:
        categoryFromURL || subcategoryFromURL
          ? {
              category: categoryFromURL,
              subcategory: subcategoryFromURL,
            }
          : null,
      location: locationFromURL || null,
      date: dateFromURL || null,
    })
    setSortBy(sortByFromURL)
    setActiveTab(tabFromURL)
  }, [categoryFromURL, subcategoryFromURL, locationFromURL, dateFromURL, sortByFromURL, tabFromURL])

  // Sync filters, sort, and tab to URL
  useEffect(() => {
    const newParams = {}

    if (filters.category?.category) newParams.category = filters.category.category
    if (filters.category?.subcategory) newParams.subcategory = filters.category.subcategory
    if (filters.location) newParams.location = filters.location
    if (filters.date) newParams.date = filters.date

    setSearchParams(newParams)
  }, [filters, sortBy, activeTab, setSearchParams])

  const handleFilterChange = (filterType, value) => {
    if (filterType === "clear") {
      setFilters({
        category: null,
        location: null,
        date: null,
      })
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }))
    }
  }

  const handleFilterRemove = (filterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: null,
    }))
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false)
  }

  useEffect(() => {
    let filtered = [...(postData || [])]

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((listing) => listing.status === activeTab)
    }

    // Apply category filter
    if (filters.category) {
      if (filters.category.subcategory) {
        // Filter by subcategory (which implicitly includes the category)
        filtered = filtered.filter((listing) => listing.subcategory === filters.category.subcategory)
      } else if (filters.category.category) {
        // Filter by category only
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
  }, [filters, sortBy, activeTab, dispatch, postData])

  // Calculate counts for tabs
  const getCounts = () => {
    let baseListings = [...(postData || [])]

    // Apply current filters (except tab filter) to get accurate counts
    if (filters.category) {
      if (filters.category.subcategory) {
        baseListings = baseListings.filter((listing) => listing.subcategory === filters.category.subcategory)
      } else if (filters.category.category) {
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

export default DashboardPage
