"use client"

import { Star, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { AITool } from "@/lib/types"

interface ToolCardProps {
  tool: AITool
}

export function ToolCard({ tool }: ToolCardProps) {
  const handleVisitClick = () => {
    window.open(tool.url, '_blank')
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50 flex flex-col justify-between bg-card/50 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
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
                      className={`h-4 w-4 ${i < tool.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({tool.reviewCount})</span>
              </div>
            </div>
          </div>
          <Badge variant={tool.pricing === "Free" ? "secondary" : "outline"}>{tool.pricing}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{tool.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          <Badge variant="outline" className="bg-primary/5">
            {tool.category}
          </Badge>
          {tool.useCases.slice(0, 2).map((useCase) => (
            <Badge key={useCase} variant="outline" className="bg-primary/5">
              {useCase}
            </Badge>
          ))}
          {tool.useCases.length > 2 && (
            <Badge variant="outline" className="bg-primary/5">
              +{tool.useCases.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          Details
        </Button>
        <Button size="sm" className="gap-1" onClick={handleVisitClick}>
          Visit <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}

