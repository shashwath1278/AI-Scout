import { ToolCard } from "@/components/tool-card"
import { aiTools } from "@/lib/data"
import { Flame } from "lucide-react"

export function TrendingTools() {
  // Get the top 3 trending tools (highest rating and review count)
  const trendingTools = [...aiTools].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 3)

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4 gap-2">
        <Flame className="h-5 w-5 text-red-500" />
        <h2 className="text-2xl font-bold">Trending Tools</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}

