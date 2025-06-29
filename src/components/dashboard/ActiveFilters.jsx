"use client"

import { X } from "lucide-react"

const ActiveFilters = ({ filters, onFilterRemove }) => {
  const getFilterItems = () => {
    const items = []

    if (filters.category) {
      if (filters.category.subcategory) {
        // Show both category and subcategory when subcategory is selected
        items.push({
          type: "category",
          label: `${filters.category.category} > ${filters.category.subcategory}`,
          value: filters.category,
        })
      } else if (filters.category.category) {
        // Show only category when no subcategory is selected
        items.push({
          type: "category",
          label: filters.category.category,
          value: filters.category,
        })
      }
    }

    if (filters.location) {
      items.push({
        type: "location",
        label: filters.location,
        value: filters.location,
      })
    }

    if (filters.date) {
      const dateLabels = {
        "1day": "Last 24 hours",
        "3days": "Last 3 days",
        "1week": "Last week",
        "1month": "Last month",
        "6months": "Last 6 months",
        "1year": "Last year",
      }
      items.push({
        type: "date",
        label: dateLabels[filters.date],
        value: filters.date,
      })
    }

    return items
  }

  const filterItems = getFilterItems()

  if (filterItems.length === 0) {
    return (
      <div className="mb-4">
        <span className="text-gray-500 text-sm">No filters applied</span>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-500 text-sm">Active filters:</span>
        {filterItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="text-gray-400 mx-2">|</span>
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span className="text-gray-700">{item.label}</span>
              <button
                onClick={() => onFilterRemove(item.type)}
                className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActiveFilters
