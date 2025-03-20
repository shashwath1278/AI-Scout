"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FilterSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  const categories = [
    "Development",
    "Chatbots",
    "Design",
    "Marketing",
    "Content Creation",
    "Data Analysis",
    "Productivity",
    "Research",
  ]

  const pricingOptions = ["Free", "Freemium", "Paid", "Enterprise"]

  const useCases = [
    "Code Generation",
    "Image Generation",
    "Text Generation",
    "Data Analysis",
    "Automation",
    "Customer Support",
    "Translation",
    "Summarization",
  ]

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      <Accordion type="multiple" defaultValue={["categories", "pricing", "useCases"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={`category-${category}`} />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pricing">
          <AccordionTrigger className="text-base font-medium">Pricing</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {pricingOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox id={`pricing-${option}`} />
                  <Label htmlFor={`pricing-${option}`} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="useCases">
          <AccordionTrigger className="text-base font-medium">Use Cases</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {useCases.map((useCase) => (
                <div key={useCase} className="flex items-center space-x-2">
                  <Checkbox id={`useCase-${useCase}`} />
                  <Label htmlFor={`useCase-${useCase}`} className="text-sm font-normal">
                    {useCase}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

