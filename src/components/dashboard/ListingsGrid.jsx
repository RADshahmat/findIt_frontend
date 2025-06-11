"use client"

import { useState } from "react"
import { Grid3X3, List, SortAsc, Filter } from "lucide-react"
import ListingCard from "./ListingCard"

import ActiveFilters from "./ActiveFilters"
import Pagination from "../Pagination"

const ListingsGrid = ({
  listings,
  filters,
  onSortChange,
  onTabChange,
  activeTab,
  counts,
  onFilterRemove,
  onFilterToggle,
}) => {
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "location", label: "Location" },
    { value: "category", label: "Category" },
  ]
    const tabs = [
    { id: "all", label: "All Listings", count: counts.all },
    { id: "lost", label: "Lost", count: counts.lost },
    { id: "found", label: "Found", count: counts.found },
  ]

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    onSortChange(newSort)
    setCurrentPage(1) // Reset to first page when sorting
  }



  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Calculate pagination
  const totalPages = Math.ceil(listings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentListings = listings.slice(startIndex, endIndex)

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.location) count++
    if (filters.date) count++
    return count
  }

  return (
    <div className="flex-1">
      {/* Active Filters */}
      <ActiveFilters filters={filters} onFilterRemove={onFilterRemove} />


      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {tabs.map((tab) => (
                      <button
                          key={tab.id}
                          onClick={() => onTabChange(tab.id)}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              activeTab === tab.id ? "bg-white/20" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>

                    ))}
                  </div>

            {/* Mobile Filter Button */}
            <button
              onClick={onFilterToggle}
              className="lg:hidden flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white rounded-full text-xs">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm text-cyan-600" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm text-cyan-600" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 
        <div className="mt-3 text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, listings.length)} of {listings.length} results
          {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div> */}
      </div> 

      {/* Listings Grid */}
      {currentListings.length > 0 ? (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {currentListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}

export default ListingsGrid
