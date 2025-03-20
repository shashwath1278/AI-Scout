"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ToolCard } from "@/components/tool-card"
import { aiTools } from "@/lib/data"
import { Loader2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GrokSuggestion {
  name: string;
  description: string;
  category: string;
  link?: string; // Changed from url to link to match API response
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function SearchResults() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [mounted, setMounted] = useState(false)
  const [grokSuggestions, setGrokSuggestions] = useState<GrokSuggestion[]>([])
  const [isLoadingGrok, setIsLoadingGrok] = useState(false)

  const filteredTools = useMemo(() => {
    if (!query) return aiTools
    const searchTerm = query.toLowerCase()
    return aiTools.filter((tool) => (
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      tool.category.toLowerCase().includes(searchTerm) ||
      tool.useCases.some(useCase => useCase.toLowerCase().includes(searchTerm))
    ))
  }, [query])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchGrokSuggestions = async (query: string) => {
      try {
        const response = await fetch(`${API_URL}/api/grok-suggestions?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        // If the response is an error message, treat as empty array
        if (data.error) {
          console.warn('API returned error:', data.error);
          setGrokSuggestions([]);
          return;
        }

        // Ensure we have an array of suggestions
        const suggestions = Array.isArray(data) ? data : [];
        setGrokSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching Grok suggestions:', error);
        setGrokSuggestions([]);
      }
    };

    if (!query || filteredTools.length > 0) {
      setGrokSuggestions([]);
      return;
    }

    setIsLoadingGrok(true);
    fetchGrokSuggestions(query).finally(() => setIsLoadingGrok(false));
  }, [query, filteredTools.length])

  useEffect(() => {
    if (query && pathname === '/') {
      // If there's a search query but we're on home page, go to search page
      router.push(`/search?q=${encodeURIComponent(query)}`)
    } else if (!query && pathname === '/search') {
      // If there's no query but we're on search page, go to home
      router.push('/')
    }
  }, [query, pathname, router])

  if (!mounted) return null

  return (
    <div className="mt-8">
      {pathname === '/search' ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {query ? `Search results for "${query}"` : "All Tools"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push('/')}
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                No exact matches found in our database.
                {isLoadingGrok && " Asking Grok for suggestions..."}
              </p>
              
              {isLoadingGrok && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading Grok suggestions...
                </div>
              )}

              {grokSuggestions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Grok Suggestions</h3>
                  <div className="grid gap-4">
                    {Array.isArray(grokSuggestions) && grokSuggestions.length > 0 ? (
                      grokSuggestions.map((suggestion, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-card">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{suggestion.name}</h4>
                            <span className="text-sm text-muted-foreground">{suggestion.category}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {suggestion.description}
                          </p>
                          {suggestion.link && (
                            <a
                              href={suggestion.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-2 inline-block"
                            >
                              Visit Website →
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No suggestions available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.slice(0, 6).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}
