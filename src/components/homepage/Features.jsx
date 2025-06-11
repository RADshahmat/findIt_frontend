import { Shield, MapPin, Bell, Clock, Award, Users } from "lucide-react"

const FeatureCard = ({ icon, title, description, gradient }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-100 group">
      <div
        className={`w-12 h-12 rounded-lg ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-slate-800">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}

const Features = () => {
  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-white" />,
      title: "Location Tracking",
      description: "Pinpoint exactly where items were lost or found to increase chances of recovery.",
      gradient: "bg-gradient-to-r from-cyan-500 to-teal-500",
    },
    {
      icon: <Bell className="h-6 w-6 text-white" />,
      title: "Instant Notifications",
      description: "Get alerted immediately when someone reports finding an item matching your description.",
      gradient: "bg-gradient-to-r from-teal-500 to-emerald-500",
    },
    {
      icon: <Shield className="h-6 w-6 text-white" />,
      title: "Secure Communication",
      description: "Connect safely with finders through our encrypted messaging system.",
      gradient: "bg-gradient-to-r from-cyan-500 to-blue-500",
    },
    {
      icon: <Clock className="h-6 w-6 text-white" />,
      title: "Quick Recovery",
      description: "Our matching algorithm helps reunite you with your belongings faster.",
      gradient: "bg-gradient-to-r from-orange-400 to-pink-500",
    },
    {
      icon: <Award className="h-6 w-6 text-white" />,
      title: "Reward System",
      description: "Offer and manage rewards for returned items directly through our platform.",
      gradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Community Trust",
      description: "User verification and ratings build a trustworthy community of helpers.",
      gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
  ]

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-18">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            Features Designed to{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Reunite</span>
          </h2>
          <p className="text-lg text-slate-600">
            Our platform is built with powerful features to maximize the chances of recovering your lost items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
