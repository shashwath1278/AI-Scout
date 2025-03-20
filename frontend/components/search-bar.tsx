"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface Suggestion {
  name: string;
  category: string;
  description: string;
  useCases?: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("q") || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoading(true)
      try {
        // Only fetch local suggestions, not Grok suggestions
        const response = await fetchWithRetry(
          `${API_URL}/api/tools?search=${encodeURIComponent(searchTerm)}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        if (!response) return;
        const data = await response.json();
        setSuggestions(data.slice(0, 5)); // Only show top 5 results
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleSearch = (suggestion?: Suggestion) => {
    const searchQuery = suggestion ? suggestion.name : searchTerm
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-4">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for AI tools (e.g., 'AI for coding', 'image generation')"
          className="pl-10 pr-20 h-12 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          suppressHydrationWarning
        />
        <Button 
          className="absolute right-2" 
          size="sm"
          onClick={() => handleSearch()}
          disabled={isLoading}
          suppressHydrationWarning
        >
          {isLoading ? "Loading..." : "Search"}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-lg z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-muted cursor-pointer"
              onClick={() => handleSearch(suggestion)}
            >
              <div className="font-medium">{suggestion.name}</div>
              <div className="text-sm text-muted-foreground">
                {suggestion.category} • {suggestion.description}
              </div>
              {suggestion.useCases && (
                <div className="text-xs text-muted-foreground mt-1">
                  Use cases: {suggestion.useCases.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

