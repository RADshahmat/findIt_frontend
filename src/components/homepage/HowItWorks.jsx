import { ClipboardList, Search, MessageCircle, ThumbsUp } from "lucide-react"

const StepCard = ({ number, icon, title, description, isLast }) => {
  return (
    <div className="container flex items-start">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {number}
        </div>
        {!isLast && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-teal-500 to-cyan-100"></div>
        )}
      </div>
      <div className="ml-6 pb-12">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-slate-800">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

const HowItWorks = () => {
  const steps = [
    {
      icon: <ClipboardList className="h-6 w-6 text-cyan-600" />,
      title: "Report Your Item",
      description:
        "Provide details about your lost item or the item you found, including photos, location, and description.",
    },
    {
      icon: <Search className="h-6 w-6 text-cyan-600" />,
      title: "Our System Finds Matches",
      description:
        "Our advanced algorithm searches for potential matches based on location, time, and item description.",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-cyan-600" />,
      title: "Connect Securely",
      description:
        "When a match is found, we'll notify both parties and facilitate secure communication through our platform.",
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-cyan-600" />,
      title: "Recover Your Item",
      description: "Arrange a safe meetup or delivery method to recover your item and mark the case as resolved.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            How <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">FindIt</span>{" "}
            Works
          </h2>
          <p className="text-lg text-slate-600">
            Our simple 4-step process makes recovering lost items straightforward and stress-free.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
