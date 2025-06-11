

import { Search } from "lucide-react"
import { useState } from "react"

const SearchBar = ({ onSearch, className = "" }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for lost items..."
            className="w-full pl-10 pr-20 py-3 rounded-lg border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-md text-sm font-medium hover:from-cyan-600 hover:to-teal-600 transition-all"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
