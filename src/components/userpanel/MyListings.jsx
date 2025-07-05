
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Edit, Trash2, AlertTriangle, CheckCircle, Search, Filter, MoreVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchCatagories } from "../../features/catagory/catagory"
import AddItemModal from "./modals/my_listings/AddItemModal"
import EditItemModal from "./modals/my_listings/EditItemModal"
import DeleteConfirmModal from "./modals/my_listings/DeleteConfirmModal"
import ReportLostModal from "./modals/my_listings/ReportLostModal"

const MyListings = () => {
  const dispatch = useDispatch()
  const { catagory, status } = useSelector((state) => state.catagory)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // UI states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data for user's items
  const [myItems, setMyItems] = useState([
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      category: "Electronics",
      subcategory: "Mobile Phones",
      description: "Space Black iPhone 15 Pro Max 256GB with clear case",
      images: ["/placeholder.svg?height=100&width=100"],
      status: "active",
      dateAdded: "2024-01-15",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      title: "Gold Wedding Ring",
      category: "Jewelry",
      subcategory: "Rings",
      description: "18k gold wedding band with engraved initials 'M&J'",
      images: ["/placeholder.svg?height=100&width=100"],
      status: "lost_reported",
      dateAdded: "2024-01-10",
      lastUpdated: "2024-01-20",
      reportedDate: "2024-01-20",
    },
    {
      id: 3,
      title: "Black Leather Wallet",
      category: "Personal Items",
      subcategory: "Wallets",
      description: "Black leather bifold wallet with multiple card slots",
      images: ["/placeholder.svg?height=100&width=100"],
      status: "active",
      dateAdded: "2024-01-05",
      lastUpdated: "2024-01-05",
    },
  ])

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCatagories())
    }
  }, [status, dispatch])

  const handleAddItem = (newItem) => {
    const item = {
      id: Date.now(),
      ...newItem,
      status: "active",
      dateAdded: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    }
    setMyItems((prev) => [item, ...prev])
    setShowAddModal(false)
  }

  const handleEditItem = (updatedItem) => {
    setMyItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              ...updatedItem,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setShowEditModal(false)
    setSelectedItem(null)
  }

  const handleDeleteItem = () => {
    setMyItems((prev) => prev.filter((item) => item.id !== selectedItem.id))
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  const handleReportLost = () => {
    setMyItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: "lost_reported",
              reportedDate: new Date().toISOString().split("T")[0],
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setShowReportModal(false)
    setSelectedItem(null)
  }

  const openEditModal = (item) => {
    setSelectedItem(item)
    setShowEditModal(true)
  }

  const openReportModal = (item) => {
    setSelectedItem(item)
    setShowReportModal(true)
  }

  const openDeleteModal = (item) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-medium border border-green-200"
          >
            Active
          </motion.span>
        )
      case "lost_reported":
        return (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-full text-xs font-medium border border-red-200"
          >
            Lost Reported
          </motion.span>
        )
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Unknown</span>
    }
  }

  const filteredItems = myItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 backdrop-blur-sm"
>
  {/* Top row */}
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
  >
    {/* Title */}
    <div className="flex-shrink-0">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        My Items
      </h1>
    </div>

    {/* Search bar */}
    <div className="flex-1 relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-half pl-12 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 hover:bg-white transition-all"
      />
    </div>

    {/* Filter */}
    <div className="relative min-w-[170px]">
      <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="pl-12 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none bg-gray-50 hover:bg-white transition-all w-full"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="lost_reported">Lost Reported</option>
      </select>
    </div>

    {/* Add Item Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowAddModal(true)}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full hover:from-cyan-600 hover:to-teal-600 transition-all font-medium shadow-lg hover:shadow-xl whitespace-nowrap"
    >
      <Plus className="h-5 w-5" />
      Add Item
    </motion.button>
  </motion.div>

  {/* Description row */}
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="text-gray-600 mt-4"
  >
    Make list of your personal daily items which may lost and report them if lost
  </motion.p>
</motion.div>


      {/* Items Grid */}
      <AnimatePresence mode="wait">
        {filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={item.images[0] || "/placeholder.svg?height=200&width=300"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">{getStatusBadge(item.status)}</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                  >
                    <motion.div initial={{ scale: 0 }} whileHover={{ scale: 1 }} className="bg-white rounded-full p-2">
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </motion.div>
                  </motion.div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    {item.category} • {item.subcategory}
                  </p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg p-2">
                    <span>Added: {new Date(item.dateAdded).toLocaleDateString()}</span>
                    <span>Updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(item)}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openDeleteModal(item)}
                      className="flex items-center justify-center px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all text-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </motion.button>
                    {item.status === "active" ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openReportModal(item)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all text-sm font-medium shadow-md"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Report Lost
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium shadow-md"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />I Found This
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 mb-4"
            >
              <Plus className="h-16 w-16 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">Start by adding your personal items to keep track of them</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all font-medium shadow-lg"
            >
              Add Your First Item
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddItemModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddItem}
            categories={catagory}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && (
          <EditItemModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEditItem}
            categories={catagory}
            item={selectedItem}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteItem}
            item={selectedItem}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReportModal && (
          <ReportLostModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            onSubmit={handleReportLost}
            categories={catagory}
            item={selectedItem}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MyListings
