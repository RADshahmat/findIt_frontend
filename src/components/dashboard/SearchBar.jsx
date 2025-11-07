import { useState } from "react";
import { Search, Image as ImageIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { searchByQueryAndImage } from "../../features/search/searchSlice"; // 🔁 Adjust path accordingly

function ImageSearchBar() {
  const [searchText, setSearchText] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store actual file
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("query", searchText);
    if (imageFile) formData.append("search_image", imageFile);

    dispatch(searchByQueryAndImage(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        {/* File Picker Button (Icon OR Preview) */}
        <label className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 h-7 w-7">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-7 w-7 object-cover rounded"
            />
          ) : (
            <ImageIcon className="text-slate-400 h-5 w-5" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* Search Input */}
        <input
          type="text"
          placeholder={preview ? "" : "Search for lost items..."}
          className="w-full pl-10 pr-20 py-2 rounded-md border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded text-xs font-medium hover:from-cyan-600 hover:to-teal-600 transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default ImageSearchBar;
