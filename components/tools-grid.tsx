"use client"

import { useState, useEffect } from "react"
import { ToolCard } from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { aiTools } from "@/lib/data"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ToolsGridProps {
  categoryFilters: string[]
  pricingFilters: string[]
  useCaseFilters: string[]
}

export function ToolsGrid({ categoryFilters, pricingFilters, useCaseFilters }: ToolsGridProps) {
  const [visibleTools, setVisibleTools] = useState(9)
  const [filteredTools, setFilteredTools] = useState(aiTools)

  useEffect(() => {
    let result = [...aiTools]

    if (categoryFilters.length > 0) {
      result = result.filter((tool) => categoryFilters.includes(tool.category))
    }

    if (pricingFilters.length > 0) {
      result = result.filter((tool) => pricingFilters.includes(tool.pricing))
    }

    if (useCaseFilters.length > 0) {
      result = result.filter((tool) => tool.useCases.some((useCase) => useCaseFilters.includes(useCase)))
    }

    setFilteredTools(result)
    // Reset visible count when filters change
    setVisibleTools(9)
  }, [categoryFilters, pricingFilters, useCaseFilters])

  const loadMore = () => {
    setVisibleTools((prev) => Math.min(prev + 9, filteredTools.length))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">All AI Tools</h2>
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(visibleTools, filteredTools.length)} of {filteredTools.length} tools
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredTools.length > 0 ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredTools.slice(0, visibleTools).map((tool, index) => (
              <motion.div key={tool.id} variants={item}>
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 border-2 border-dashed rounded-lg border-primary/20"
          >
            <h3 className="text-xl font-medium mb-2">No tools found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for</p>
          </motion.div>
        )}
      </AnimatePresence>

      {visibleTools < filteredTools.length && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            variant="outline"
            className="gap-2 group transition-all duration-300 hover:bg-primary/10"
          >
            Load More
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

