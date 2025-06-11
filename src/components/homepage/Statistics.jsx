

import { useState, useEffect } from "react"

const StatCard = ({ value, label, suffix = "", gradient }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const interval = 20 // update every 20ms
    const steps = duration / interval
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current > value) {
        current = value
        clearInterval(timer)
      }
      setCount(Math.floor(current))
    }, interval)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 text-center">
      <div className={`text-4xl md:text-5xl font-bold mb-2 ${gradient}`}>
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-slate-600">{label}</div>
    </div>
  )
}

const Statistics = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-100 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-100 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-18 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            Making a{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Real Difference
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Our platform has helped thousands of people recover their lost belongings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            value={15482}
            label="Items Recovered"
            gradient="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent"
          />
          <StatCard
            value={94}
            suffix="%"
            label="Success Rate"
            gradient="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent"
          />
          <StatCard
            value={28756}
            label="Active Users"
            gradient="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
          />
          <StatCard
            value={1250000}
            suffix="+"
            label="Item Value Recovered"
            gradient="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"
          />
        </div>
      </div>
    </section>
  )
}

export default Statistics
