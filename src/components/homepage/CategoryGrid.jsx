import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCatagories } from '../../features/catagory/catagory';
import { getLucideIcon } from '../../helpers/lucideIcons';
import { useNavigate } from "react-router-dom"
import { Search } from 'lucide-react';


const CategoryGridModern = () => {
  const dispatch = useDispatch();
  const { catagory, status } = useSelector(state => state.catagory);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCatagories());
    }
  }, [status, dispatch]);
  const navigate = useNavigate()

const handleCategoryClick = (label) => {
  const encodedCategory = encodeURIComponent(label)
  navigate(`/dashboard?category=${encodedCategory}`)
}
  const [searchTerm, setSearchTerm] = useState("")
  const [showAll, setShowAll] = useState(false)

  const filteredCategories = catagory.filter((category) =>
    category.lable.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const visibleCategories = showAll ? filteredCategories : filteredCategories.slice(0, 15)
//console.log(catagory)
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
          const Icon = getLucideIcon(item.icon);
          return (
            <div
              key={idx}
                onClick={() => handleCategoryClick(item.lable)}
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
                {item.lable}
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
