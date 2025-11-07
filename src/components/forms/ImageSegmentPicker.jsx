"use client"

import { useState } from "react"
import SubjectSelectionModal from "./subjectSelectionModal"

export default function ImageSegmentPicker({ onAddExtractedImage }) {
  const [segments, setSegments] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)

  // call segmentation microservice
  const callSegmentService = async (file) => {
    const fd = new FormData()
    fd.append("image", file)

    const res = await fetch("http://localhost:8000/segment", {
      method: "POST",
      body: fd,
    })

    if (!res.ok) throw new Error("Segmentation failed")
    return res.json()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)

    try {
      const data = await callSegmentService(file)
      setSegments(data.segments || [])
      setModalOpen(true)
    } catch (err) {
      console.error(err)
      alert("Segmentation service error: " + err.message)
    }
  }

  const handleSelect = async (segment) => {
    setModalOpen(false)

    // ask python service to return extracted PNG for this mask
    const res = await fetch("http://localhost:8000/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mask_id: segment.id }),
    })

    const data = await res.json()
    // data.cropped_image is base64 png
    onAddExtractedImage({
      preview: `data:image/png;base64,${data.cropped_image}`,
      extracted: true,
      maskId: segment.id,
    })
  }

  return (
    <div>
      <input id="seg-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      <label htmlFor="seg-upload" className="cursor-pointer inline-block px-4 py-2 bg-gray-100 rounded">
        Upload & extract subject
      </label>

      <SubjectSelectionModal
        isOpen={isModalOpen}
        imagePreview={imagePreview}
        segments={segments}
        onSelect={handleSelect}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
