"use client"

import React, { type ReactNode } from "react"
import { Reorder } from "framer-motion"
import { GripVertical, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface ReorderableItem<T> {
  id: number
  content: ReactNode
  data: T
}

export interface ReorderableListProps<T> {
  items: ReorderableItem<T>[]
  onReorder?: (items: ReorderableItem<T>[]) => void
  onDelete?: (id: number) => void
  className?: string
}

export default function ReorderableList<T>({ items, onReorder, onDelete, className = "" }: ReorderableListProps<T>) {
  const handleReorder = (newItems: ReorderableItem<T>[]) => {
    onReorder?.(newItems)
  }

  const handleDelete = (id: number) => {
    onDelete?.(id)
  }

  return (
    <Reorder.Group axis="y" values={items} onReorder={handleReorder} className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:outline-none rounded-lg"
        >
          <Card className="cursor-grab active:cursor-grabbing group">
            <CardContent className="p-4 flex items-start gap-4">
              <GripVertical className="w-5 h-5 mt-1 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">{item.content}</div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
                onClick={(e) => {
                  e.stopPropagation() // Prevent triggering drag when clicking delete
                  handleDelete(item.id)
                }}
                aria-label="Delete item"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
              </Button>
            </CardContent>
          </Card>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}

