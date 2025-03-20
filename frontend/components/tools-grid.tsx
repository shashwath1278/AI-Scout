"use client"

import { aiTools } from "@/lib/data"
import { ToolCard } from "@/components/tool-card"

export function ToolsGrid() {
  // Get trending tools IDs to exclude them from the main grid
  const trendingToolIds = new Set(aiTools
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, 3)
    .map(tool => tool.id)
  );

  // Filter out trending tools from the main grid
  const nonTrendingTools = aiTools.filter(tool => !trendingToolIds.has(tool.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 p-1">
      {nonTrendingTools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

