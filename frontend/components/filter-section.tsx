"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"

interface FilterSectionProps {
  onCategoryFilterChange: (categories: string[]) => void
  onPricingFilterChange: (pricing: string[]) => void
  onUseCaseFilterChange: (useCases: string[]) => void
}

export function FilterSection({
  onCategoryFilterChange,
  onPricingFilterChange,
  onUseCaseFilterChange,
}: FilterSectionProps) {
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

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPricing, setSelectedPricing] = useState<string[]>([])
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  useEffect(() => {
    setActiveFiltersCount(selectedCategories.length + selectedPricing.length + selectedUseCases.length)

    onCategoryFilterChange(selectedCategories)
    onPricingFilterChange(selectedPricing)
    onUseCaseFilterChange(selectedUseCases)
  }, [
    selectedCategories,
    selectedPricing,
    selectedUseCases,
    onCategoryFilterChange,
    onPricingFilterChange,
    onUseCaseFilterChange,
  ])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handlePricingChange = (pricing: string) => {
    setSelectedPricing((prev) => (prev.includes(pricing) ? prev.filter((p) => p !== pricing) : [...prev, pricing]))
  }

  const handleUseCaseChange = (useCase: string) => {
    setSelectedUseCases((prev) => (prev.includes(useCase) ? prev.filter((u) => u !== useCase) : [...prev, useCase]))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedPricing([])
    setSelectedUseCases([])
  }

  return (
    <motion.div
      className="p-4 border rounded-lg bg-card sticky top-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs flex items-center gap-1 hover:bg-destructive/10"
          >
            Clear all <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="mb-4 p-2 bg-primary/5 rounded-md">
          <p className="text-sm font-medium mb-2">Active filters ({activeFiltersCount})</p>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((category) => (
              <Badge key={`cat-${category}`} onRemove={() => handleCategoryChange(category)}>
                {category}
              </Badge>
            ))}
            {selectedPricing.map((pricing) => (
              <Badge key={`price-${pricing}`} onRemove={() => handlePricingChange(pricing)}>
                {pricing}
              </Badge>
            ))}
            {selectedUseCases.map((useCase) => (
              <Badge key={`use-${useCase}`} onRemove={() => handleUseCaseChange(useCase)}>
                {useCase}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["categories", "pricing", "useCases"]} className="space-y-2">
        <AccordionItem value="categories" className="border px-2 rounded-md">
          <AccordionTrigger className="text-base font-medium py-2">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pricing" className="border px-2 rounded-md">
          <AccordionTrigger className="text-base font-medium py-2">Pricing</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {pricingOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pricing-${option}`}
                    checked={selectedPricing.includes(option)}
                    onCheckedChange={() => handlePricingChange(option)}
                  />
                  <Label htmlFor={`pricing-${option}`} className="text-sm font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="useCases" className="border px-2 rounded-md">
          <AccordionTrigger className="text-base font-medium py-2">Use Cases</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {useCases.map((useCase) => (
                <div key={useCase} className="flex items-center space-x-2">
                  <Checkbox
                    id={`useCase-${useCase}`}
                    checked={selectedUseCases.includes(useCase)}
                    onCheckedChange={() => handleUseCaseChange(useCase)}
                  />
                  <Label htmlFor={`useCase-${useCase}`} className="text-sm font-normal cursor-pointer">
                    {useCase}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  )
}

function Badge({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-1 bg-primary/10 text-xs px-2 py-1 rounded-full">
      {children}
      <button onClick={onRemove} className="hover:bg-primary/20 rounded-full p-0.5">
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

