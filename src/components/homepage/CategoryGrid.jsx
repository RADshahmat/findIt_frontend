import { useState } from "react"
import {
  Smartphone, ShoppingBag, Gem, Watch, Users, FileText, Key, Gamepad2, Laptop, Tv,Camera,Book,
  Glasses, Shirt, Dog, Dumbbell, FolderOpen, Car, Search,
} from "lucide-react"
import { useNavigate } from "react-router-dom"



const categories = [
  { label: "Phones & Tablets", count: 47, icon: Smartphone, color: "from-blue-500 to-cyan-400", bgColor: "bg-blue-50" },
  { label: "Bags", count: 167, icon: ShoppingBag, color: "from-amber-500 to-orange-400", bgColor: "bg-teal-50" },
  { label: "Jewelry", count: 15, icon: Gem, color: "from-purple-500 to-pink-400", bgColor: "bg-purple-50" },
  { label: "Watches", count: 2, icon: Watch, color: "from-gray-600 to-gray-500", bgColor: "bg-gray-50" },
  { label: "People", count: 246, icon: Users, color: "from-green-500 to-emerald-400", bgColor: "bg-green-50" },
  { label: "Documents", count: 218, icon: FileText, color: "from-blue-600 to-indigo-500", bgColor: "bg-blue-50" },
  { label: "Keys", count: 27, icon: Key, color: "from-yellow-500 to-amber-400", bgColor: "bg-green-50" },
  { label: "Toys", count: 3, icon: Gamepad2, color: "from-pink-500 to-rose-400", bgColor: "bg-pink-50" },
  { label: "Laptop", count: 3, icon: Laptop, color: "from-slate-600 to-slate-500", bgColor: "bg-slate-50" },
  { label: "Fashion Accessories", count: 1, icon: Glasses, color: "from-teal-500 to-emerald-400", bgColor: "bg-teal-50" },
  { label: "Clothes & Shoes", count: 1, icon: Shirt, color: "from-cyan-500 to-sky-400", bgColor: "bg-cyan-50" },
  { label: "Pets", count: 345, icon: Dog, color: "from-orange-500 to-amber-400", bgColor: "bg-orange-50" },
  { label: "Sports Equipment", count: 1, icon: Dumbbell, color: "from-red-500 to-rose-400", bgColor: "bg-red-50" },
  { label: "Other", count: 19, icon: FolderOpen, color: "from-gray-500 to-slate-400", bgColor: "bg-gray-50" },
  { label: "Automobile", count: 18, icon: Car, color: "from-blue-500 to-indigo-400", bgColor: "bg-blue-50" },
  { label: "Television", count: 11, icon: Tv, color: "from-indigo-500 to-violet-400", bgColor: "bg-indigo-50" },
  { label: "Camera", count: 7, icon: Camera, color: "from-pink-500 to-rose-400", bgColor: "bg-pink-50" },
  { label: "Books", count: 23, icon: Book, color: "from-yellow-600 to-amber-500", bgColor: "bg-yellow-50" },
]

const CategoryGridModern = () => {
  const navigate = useNavigate()

const handleCategoryClick = (label) => {
  const encodedCategory = encodeURIComponent(label)
  navigate(`/dashboard?category=${encodedCategory}`)
}
  const [searchTerm, setSearchTerm] = useState("")
  const [showAll, setShowAll] = useState(false)

  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const visibleCategories = showAll ? filteredCategories : filteredCategories.slice(0, 15)

  return (
    <section className="p-8 bg-white rounded-2xl shadow-lg m-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold flex">
            <div className="h-8 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-full mr-3"></div>
            <span> Browse by&nbsp;</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Category</span>
          </h2>
          <p className="text-gray-500 mt-1">Find lost items by selecting a category</p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowAll(false) // Reset view when searching
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visibleCategories.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
                onClick={() => handleCategoryClick(item.label)}
              className={`group cursor-pointer flex flex-col items-center justify-center p-5 rounded-xl 
                        ${item.bgColor} border border-gray-100 transition-all duration-300 
                        hover:shadow-lg hover:-translate-y-1`}
            >
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full mb-4
                              bg-gradient-to-br ${item.color} text-white p-2.5
                              transform transition-all duration-300 group-hover:scale-110`}
              >
                <Icon className="w-6 h-6" strokeWidth={1.5} />
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} 
                                opacity-0 group-hover:opacity-30 scale-0 group-hover:scale-125
                                transition-all duration-500 blur-sm`}
                ></div>
              </div>

              <span className="font-semibold text-gray-800 text-center group-hover:text-black transition-colors duration-300">
                {item.label}
              </span>

              <div className="flex items-center justify-center mt-1 space-x-1">
                <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-gray-600 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  {item.count}
                </span>
                <span className="text-xs text-gray-500">items</span>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCategories.length > 15 && !showAll && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="text-sm font-medium text-red-500 hover:underline"
          >
            View all categories
          </button>
        </div>
      )}

      {filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No categories found matching "{searchTerm}"</p>
        </div>
      )}
    </section>
  )
}

export default CategoryGridModern
