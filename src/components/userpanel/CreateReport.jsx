"use client"

import { useState } from "react"
import { Search, Plus, ArrowLeft } from "lucide-react"
import ReportLostItem from "./ReportLostItem"
import ReportFoundItem from "./ReportFoundItem"

const CreateReport = () => {
  const [currentView, setCurrentView] = useState("selection") // "selection", "lost", "found"

  const handleBackToSelection = () => {
    setCurrentView("selection")
  }

  if (currentView === "lost") {
    return <ReportLostItem onBack={handleBackToSelection} />
  }

  if (currentView === "found") {
    return <ReportFoundItem onBack={handleBackToSelection} />
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-2">Create New Report</h1>
        <p className="text-gray-600 mb-8">Choose the type of report you want to create</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => setCurrentView("lost")}
            className="p-8 border-2 border-dashed border-red-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Report Lost Item</h3>
              <p className="text-gray-600 leading-relaxed">
                Lost something valuable? Create a detailed report to help others identify and return your item. Include
                photos, location details, and offer a reward if desired.
              </p>
              <div className="mt-4 inline-flex items-center text-red-600 font-medium">
                Get Started <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView("found")}
            className="p-8 border-2 border-dashed border-green-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Plus className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Report Found Item</h3>
              <p className="text-gray-600 leading-relaxed">
                Found something that doesn't belong to you? Help return it to its rightful owner by creating a found
                item report with photos and details.
              </p>
              <div className="mt-4 inline-flex items-center text-green-600 font-medium">
                Get Started <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </div>
            </div>
          </button>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Tips for Better Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">📸 Add Clear Photos</h3>
              <p className="text-sm text-gray-600">High-quality images from multiple angles help with identification</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">📍 Be Specific About Location</h3>
              <p className="text-sm text-gray-600">
                Include landmarks and specific areas where the item was lost/found
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">📝 Detailed Description</h3>
              <p className="text-sm text-gray-600">Include brand, color, size, and any unique identifying features</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">⏰ Report Quickly</h3>
              <p className="text-sm text-gray-600">The sooner you report, the better the chances of recovery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateReport
