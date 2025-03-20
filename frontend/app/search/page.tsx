import { SearchBar } from "@/components/search-bar"
import { SearchResults } from "@/components/search-results"

export default function SearchPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <SearchBar />
      <SearchResults />
    </main>
  )
}
