import { SearchBar } from "@/components/search-bar"
import { ToolsGrid } from "@/components/tools-grid"
import { FilterSection } from "@/components/filter-section"
import { TrendingTools } from "@/components/trending-tools"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <HeroSection />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <SearchBar />
        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <FilterSection />
          </div>
          <div className="lg:col-span-3">
            <TrendingTools />
            <ToolsGrid />
          </div>
        </div>
      </div>
    </main>
  )
}

