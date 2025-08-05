"use client"

import { useState, useCallback } from "react"
import { Palette, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ColorPaletteProps {
  onColorSelect: (color: string) => void
  selectedColor?: string
  disabled?: boolean
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#A8E6CF', '#FF8B94', '#FFC3A0', '#FFAFBD',
  '#C7CEEA', '#F7CAC9', '#92A8D1', '#F7DC6F'
]

export function ColorPalette({ onColorSelect, selectedColor, disabled = false }: ColorPaletteProps) {
  const [customColor, setCustomColor] = useState('#000000')
  const [recentColors, setRecentColors] = useState<string[]>([])
  const [showCustomPicker, setShowCustomPicker] = useState(false)

  const handleColorSelect = useCallback((color: string) => {
    onColorSelect(color)
    
    // Add to recent colors
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color)
      return [color, ...filtered.slice(0, 7)] // Keep last 8 colors
    })
  }, [onColorSelect])

  const handleCustomColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomColor(color)
    handleColorSelect(color)
  }, [handleColorSelect])

  const handleCustomColorSubmit = useCallback(() => {
    if (customColor) {
      handleColorSelect(customColor)
      setShowCustomPicker(false)
    }
  }, [customColor, handleColorSelect])

  const removeRecentColor = useCallback((colorToRemove: string) => {
    setRecentColors(prev => prev.filter(color => color !== colorToRemove))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Color Palette</span>
        </CardTitle>
        <CardDescription>
          Select colors to apply to building sections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TooltipProvider>
          {/* Preset Colors */}
          <div>
            <h4 className="text-sm font-medium mb-3">Preset Colors</h4>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <Tooltip key={color}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-8 h-8 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform ${
                        selectedColor === color 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => !disabled && handleColorSelect(color)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{color}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Custom Color</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomPicker(!showCustomPicker)}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showCustomPicker ? 'Hide' : 'Add'}
              </Button>
            </div>
            
            {showCustomPicker && (
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-16 h-10 p-1"
                  disabled={disabled}
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                  disabled={disabled}
                />
                <Button size="sm" onClick={handleCustomColorSubmit} disabled={disabled}>
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Recent Colors</h4>
              <div className="grid grid-cols-8 gap-2">
                {recentColors.map((color, index) => (
                  <Tooltip key={`${color}-${index}`}>
                    <TooltipTrigger asChild>
                      <div className="relative group">
                        <div
                          className={`w-8 h-8 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform ${
                            selectedColor === color 
                              ? 'border-primary ring-2 ring-primary/20' 
                              : 'border-border hover:border-primary/50'
                          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => !disabled && handleColorSelect(color)}
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-1 -right-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeRecentColor(color)}
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </TooltipProvider>
      </CardContent>
    </Card>
  )
} 