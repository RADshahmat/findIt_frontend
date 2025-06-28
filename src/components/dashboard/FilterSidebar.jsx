
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCatagories } from '../../features/catagory/catagory';
import { getLucideIcon } from '../../helpers/lucideIcons';
import { fetchLocations } from "../../features/location/location";


import { Filter, X, Smartphone, MapPin, Calendar, ChevronDown, ChevronRight } from "lucide-react";

import districtsData from '../../assets/bd-districts.json';

const locations = districtsData.districts.map((d) => d.name);


const dateRanges = [
  { label: "Last 24 hours", value: "1day" },
  { label: "Last 3 days", value: "3days" },
  { label: "Last week", value: "1week" },
  { label: "Last month", value: "1month" },
  { label: "Last 6 months", value: "6months" },
  { label: "Last year", value: "1year" },
]


const FilterSidebar = ({ filters, onFilterChange, isOpen, onClose, allListings, currentTab }) => {
  const dispatch = useDispatch();
  const { catagory, status } = useSelector(state => state.catagory);
  const { location, status1 } = useSelector((state) => state.location);

  useEffect(() => {
    if (status1 === 'idle') {
      dispatch(fetchLocations());
    }
    if (status === 'idle') {
      dispatch(fetchCatagories());
    }
  }, [status, dispatch, status1]);
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  const toggleCategory = (categoryLabel) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryLabel)) {
      newExpanded.delete(categoryLabel)
    } else {
      newExpanded.add(categoryLabel)
    }
    setExpandedCategories(newExpanded)
  }

  const handleCategoryChange = (category, subcategory = null) => {
    onFilterChange("category", { category, subcategory })
  }

  const handleLocationChange = (location) => {
    onFilterChange("location", location)
  }

  const handleDateChange = (dateRange) => {
    onFilterChange("date", dateRange)
  }

  const clearFilters = () => {
    onFilterChange("clear", null)
  }

  const locationCountMap = useMemo(() => {
        const map = {};
        location.forEach(loc => {
          map[loc.location.toLowerCase()] = loc.count;
        });
        return map;
      }, [location]);

  // Calculate dynamic counts based on current listings and tab
  const getFilteredListings = (additionalFilter = {}) => {
    let filtered = [...(allListings || [])];

    // Apply tab filter
    if (currentTab !== "all") {
      filtered = filtered.filter((listing) => listing.status === currentTab);
    }

    // Apply current filters except the one being overridden by additionalFilter
    if (filters.category && !additionalFilter.category) {
      if (filters.category.subcategory) {
        filtered = filtered.filter(
          (listing) => listing.subcategory === filters.category.subcategory
        );
      } else {
        filtered = filtered.filter(
          (listing) => listing.category === filters.category.category
        );
      }
    }

    if (filters.location && !additionalFilter.location) {
      filtered = filtered.filter((listing) => listing.location === filters.location);
    }

    if (filters.date && !additionalFilter.date) {
      const now = new Date();
      const filterDate = new Date();
      switch (filters.date) {
        case "1day":
          filterDate.setDate(now.getDate() - 1);
          break;
        case "3days":
          filterDate.setDate(now.getDate() - 3);
          break;
        case "1week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "1month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "6months":
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (listing) => new Date(listing.date) >= filterDate
      );
    }

    
    // Apply the additional filter for counts
    if (additionalFilter.category) {
      filtered = filtered.filter(
        (listing) => listing.category === additionalFilter.category
      );
    }

    if (additionalFilter.subcategory) {
      filtered = filtered.filter(
        (listing) => listing.subcategory === additionalFilter.subcategory
      );
    }

    if (additionalFilter.location) {
      filtered = filtered.filter((listing) => listing.location === additionalFilter.location);
    }

    return filtered;
  };


  const getCategoryCount = (category, subcategory = null) => {
    return getFilteredListings({ category, subcategory }).length
  }

  const getLocationCount = (location) => {
    return getFilteredListings({ location }).length
  }
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreLocations, setShowMoreLocations] = useState(false);
  const maxVisibleItems = 4;
  const sidebarContent = (

    <div className="flex-1 overflow-y-auto max-h-full">

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearFilters}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
            >
              Clear All
            </button>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mr-3">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Categories</h3>
          </div>

          <div className="">

            {(showMoreCategories ? catagory : catagory.slice(0, maxVisibleItems)).map((category) => {
              const Icon = getLucideIcon(category.icon);
              const isExpanded = expandedCategories.has(category.lable)
              const isSelected = filters.category?.category === category.lable
              const categoryCount = getCategoryCount(category.lable)


              return (
                <div key={category.lable}>
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-cyan-50 border border-cyan-200" : "hover:bg-gray-50"
                      }`}
                    onClick={() => handleCategoryChange(category.lable)}
                  >
                    <div className="flex items-center flex-1">
                      <div className={`w-6 h-6 rounded-full ${category.bgColor} flex items-center justify-center mr-2`}>
                        <Icon className="h-3 w-3 text-gray-600" />
                      </div>
                      <span className={`text-sm ${isSelected ? "text-cyan-700 font-medium" : "text-gray-700"}`}>
                        {category.lable}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto mr-2">({category.count})</span>
                    </div>
                    {category.subcategories && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCategory(category.lable)
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-3 w-3 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {isExpanded && category.subcategories && (
                    <div className="ml-8 mt-1 space-y-1">
                      {category.subcategories.map((subcategory) => {
                        const isSubSelected = filters.category?.subcategory === subcategory
                        const subCount = getCategoryCount(category.lable, subcategory.name)

                        return (
                          <div
                            key={subcategory.id}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm transition-colors ${isSubSelected ? "bg-cyan-100 text-cyan-700" : "text-gray-600 hover:bg-gray-50"
                              }`}
                            onClick={() => handleCategoryChange(category.label, subcategory.name)}
                          >
                            <span>{subcategory.name}</span>
                            <span className="text-xs text-gray-500">({subcategory.postCount})</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            {catagory.length > maxVisibleItems && (
              <div className="mt-1 text-center">
                <button
                  onClick={() => setShowMoreCategories(!showMoreCategories)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showMoreCategories ? "View Less" : "View More"}
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Locations */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center mr-3">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Locations</h3>
          </div>

          <div className="">
            {(showMoreLocations ? locations : locations.slice(0, maxVisibleItems)).map((location) => {
              const isSelected = filters.location === location;
              const locationCount = locationCountMap[location.toLowerCase()] || 0;

              return (
                <div
                  key={location}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"
                    }`}
                  onClick={() => handleLocationChange(location)}
                >
                  <span className={`text-sm ${isSelected ? "text-green-700 font-medium" : "text-gray-700"}`}>
                    {location}
                  </span>
                  <span className="text-xs text-gray-500">({locationCount})</span>
                </div>
              );
            })}
            {locations.length > maxVisibleItems && (
              <div className="mt-1 text-center">
                <button
                  onClick={() => setShowMoreLocations(!showMoreLocations)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showMoreLocations ? "View Less" : "View More"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Date Posted */}
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center mr-3">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Date Posted</h3>
          </div>

          <div className="space-y-1">
            {dateRanges.map((range) => {
              const isSelected = filters.date === range.value

              return (
                <div
                  key={range.value}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-purple-50 border border-purple-200" : "hover:bg-gray-50"
                    }`}
                  onClick={() => handleDateChange(range.value)}
                >
                  <span className={`text-sm ${isSelected ? "text-purple-700 font-medium" : "text-gray-700"}`}>
                    {range.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden lg:block w-80 bg-white shadow-lg rounded-lg overflow-hidden sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex shadow-lg">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-white bg-opacity-50 shadow-lg" onClick={onClose} />

          {/* Sidebar */}
          <div className="relative w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

export default FilterSidebar
