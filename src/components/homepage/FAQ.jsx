"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const FaqItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-slate-200 py-5">
      <button className="flex justify-between items-center w-full text-left focus:outline-none" onClick={toggleOpen}>
        <h3 className="text-lg font-medium text-slate-800">{question}</h3>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-cyan-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </span>
      </button>
      <div
        className={`mt-2 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-slate-600">{answer}</p>
      </div>
    </div>
  )
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "How does FindIt work?",
      answer:
        "FindIt connects people who have lost items with those who have found them. When you report a lost item, our system searches for matching found items based on description, location, and time. Similarly, when you report a found item, we look for matching lost item reports. When a potential match is found, both parties are notified and can communicate securely through our platform.",
    },
    {
      question: "Is it free to use FindIt?",
      answer:
        "Basic use of FindIt is completely free. You can report lost or found items, search the database, and connect with potential matches at no cost. We do offer premium features, such as priority matching and extended listing periods, for a small fee.",
    },
    {
      question: "How do I arrange to get my item back?",
      answer:
        "Once you've connected with someone who has found your item, you can use our secure messaging system to arrange a safe meetup or delivery method. We recommend meeting in public places during daylight hours. For valuable items, we offer a secure handover service in select cities.",
    },
    {
      question: "What if I find something but can't identify the owner?",
      answer:
        "Report the found item on our platform with as much detail as possible. Our system will continuously search for matching lost item reports. If no match is found after a certain period, we provide guidance on how to handle the item according to local lost property laws.",
    },
    {
      question: "How does FindIt protect my privacy?",
      answer:
        "We take privacy seriously. Your contact information is never shared without your permission. Our secure messaging system allows you to communicate without revealing personal details. Additionally, location information is only shown at a neighborhood level until you choose to share more specific details.",
    },
    {
      question: "Can I offer a reward for my lost item?",
      answer:
        "Yes, you can offer a reward for the return of your lost item. You can specify the reward amount when creating your lost item report, and it will be displayed to potential finders. Our platform includes a secure reward payment system to facilitate the transaction once your item is returned.",
    },
  ]

  const toggleFaq = (index) => {
    setOpenIndex(index === openIndex ? -1 : index)
  }

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg text-slate-600">
            Find answers to common questions about using our lost and found platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex}
              toggleOpen={() => toggleFaq(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
