"use client"

import { ToolCard } from "@/components/tool-card"
import { aiTools } from "@/lib/data"
import { Flame } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TrendingToolsProps {
  categoryFilters: string[]
  pricingFilters: string[]
  useCaseFilters: string[]
}

export function TrendingTools({ categoryFilters, pricingFilters, useCaseFilters }: TrendingToolsProps) {
  const [trendingTools, setTrendingTools] = useState(
    [...aiTools].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 3),
  )

  useEffect(() => {
    // Filter tools based on selected filters
    let filteredTools = [...aiTools]

    if (categoryFilters.length > 0) {
      filteredTools = filteredTools.filter((tool) => categoryFilters.includes(tool.category))
    }

    if (pricingFilters.length > 0) {
      filteredTools = filteredTools.filter((tool) => pricingFilters.includes(tool.pricing))
    }

    if (useCaseFilters.length > 0) {
      filteredTools = filteredTools.filter((tool) => tool.useCases.some((useCase) => useCaseFilters.includes(useCase)))
    }

    // Sort by trending score and take top 3
    const newTrendingTools = filteredTools
      .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
      .slice(0, 3)

    setTrendingTools(newTrendingTools)
  }, [categoryFilters, pricingFilters, useCaseFilters])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4 gap-2">
        <Flame className="h-5 w-5 text-red-500 animate-pulse" />
        <h2 className="text-2xl font-bold">Trending Tools</h2>
      </div>

      {trendingTools.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {trendingTools.map((tool, index) => (
            <motion.div key={tool.id} variants={item}>
              <ToolCard tool={tool} isTrending={true} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed rounded-lg border-primary/20">
          <p className="text-muted-foreground">No trending tools match your filters</p>
        </div>
      )}
    </div>
  )
}

