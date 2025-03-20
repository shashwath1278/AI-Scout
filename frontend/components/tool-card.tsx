"use client"

import { Star, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { AITool } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  tool: AITool
  isTrending?: boolean
}

export function ToolCard({ tool, isTrending = false }: ToolCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg border-border hover:border-primary/20 group",
        "transform hover:-translate-y-1",
        isTrending && "border-2 border-primary/20 dark:border-primary/30 relative",
      )}
    >
      {isTrending && (
        <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md transform rotate-12 z-10">
          Trending
        </div>
      )}
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
              {tool.icon ? (
                <span className="text-xl">{tool.icon}</span>
              ) : (
                <span className="font-bold text-primary">{tool.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{tool.name}</h3>
              <div className="flex items-center mt-1 space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < tool.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"
                      } transition-all duration-300 group-hover:scale-110`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({tool.reviewCount})</span>
              </div>
            </div>
          </div>
          <Badge
            variant={tool.pricing === "Free" ? "secondary" : "outline"}
            className="transition-all duration-300 group-hover:bg-primary/10"
          >
            {tool.pricing}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{tool.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          <Badge variant="outline" className="bg-primary/5 transition-colors group-hover:bg-primary/10">
            {tool.category}
          </Badge>
          {tool.useCases.slice(0, 2).map((useCase) => (
            <Badge key={useCase} variant="outline" className="bg-primary/5 transition-colors group-hover:bg-primary/10">
              {useCase}
            </Badge>
          ))}
          {tool.useCases.length > 2 && (
            <Badge variant="outline" className="bg-primary/5 transition-colors group-hover:bg-primary/10">
              +{tool.useCases.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="transition-all duration-300 hover:bg-primary/10">
          Details
        </Button>
        <Button size="sm" className="gap-1 transition-all duration-300 hover:scale-105">
          Visit <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}

