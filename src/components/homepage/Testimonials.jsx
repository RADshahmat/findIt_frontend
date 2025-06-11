"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const TestimonialCard = ({ name, location, text, rating, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
          <img src={image || `/placeholder.svg?height=48&width=48`} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-slate-800">{name}</h4>
          <p className="text-sm text-slate-500">{location}</p>
        </div>
      </div>

      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
        ))}
      </div>

      <p className="text-slate-600 italic flex-grow">{text}</p>
    </div>
  )
}

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, NY",
      text: "I lost my wedding ring at the beach and was devastated. Within 24 hours of posting on FindIt, someone had found it! The platform made it so easy to connect safely and recover my precious ring.",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA",
      text: "Left my laptop on the train and thought it was gone forever. Posted on FindIt and was connected with the person who found it within hours. The location tracking feature was incredibly helpful!",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Emily Rodriguez",
      location: "Chicago, IL",
      text: "Found a wallet while hiking and wanted to return it to its owner. The FindIt platform made it simple to report it and connect with the owner without sharing personal information.",
      rating: 4,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "David Thompson",
      location: "Austin, TX",
      text: "My dog ran away during a storm, and I was heartbroken. Posted on FindIt, and a family 3 miles away had found him! The notification system alerted me immediately when they posted.",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Aisha Patel",
      location: "Seattle, WA",
      text: "Lost my passport right before an international trip. Someone found it and reported it on FindIt. The secure messaging system helped us arrange a safe meetup. Literally saved my vacation!",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "James Wilson",
      location: "Boston, MA",
      text: "Found an expensive camera in a park. Used FindIt to locate the owner and return it. The platform made the whole process smooth and rewarding. Great to help someone get their memories back!",
      rating: 4,
      image: "/placeholder.svg?height=48&width=48",
    },
  ]

  const slidesToShow = 3
  const totalSlides = Math.ceil(testimonials.length / slidesToShow)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getVisibleTestimonials = () => {
    const start = currentSlide * slidesToShow
    return testimonials.slice(start, start + slidesToShow)
  }

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            Success{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Stories</span>
          </h2>
          <p className="text-lg text-slate-600">
            Hear from people who have successfully recovered their lost items through our platform.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Testimonials */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                location={testimonial.location}
                text={testimonial.text}
                rating={testimonial.rating}
                image={testimonial.image}
              />
            ))}
          </div>

          {/* Mobile Testimonials */}
          <div className="md:hidden">
            <TestimonialCard
              name={testimonials[currentSlide].name}
              location={testimonials[currentSlide].location}
              text={testimonials[currentSlide].text}
              rating={testimonials[currentSlide].rating}
              image={testimonials[currentSlide].image}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 md:mt-12 space-x-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex space-x-2">
              {[...Array(totalSlides)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentSlide ? "bg-gradient-to-r from-cyan-500 to-teal-500" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
