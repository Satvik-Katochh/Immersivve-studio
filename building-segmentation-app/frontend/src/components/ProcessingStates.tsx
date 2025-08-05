"use client"

import { Building2, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface ProcessingStatesProps {
  isProcessing: boolean
  progress?: number
  status?: string
  error?: string
  masksGenerated?: number
}

export function ProcessingStates({ 
  isProcessing, 
  progress = 0, 
  status = "Ready", 
  error,
  masksGenerated = 0 
}: ProcessingStatesProps) {
  const getStatusIcon = () => {
    if (error) return <AlertCircle className="h-5 w-5 text-destructive" />
    if (isProcessing) return <Loader2 className="h-5 w-5 animate-spin" />
    if (masksGenerated > 0) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <Building2 className="h-5 w-5" />
  }

  const getStatusColor = () => {
    if (error) return "destructive"
    if (isProcessing) return "secondary"
    if (masksGenerated > 0) return "default"
    return "secondary"
  }

  const getStatusText = () => {
    if (error) return "Error"
    if (isProcessing) return "Processing"
    if (masksGenerated > 0) return "Complete"
    return "Ready"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>AI Processing</span>
        </CardTitle>
        <CardDescription>
          {isProcessing 
            ? "Click on building sections to generate masks" 
            : "Upload an image to start processing"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <Badge variant={getStatusColor()}>
            {masksGenerated > 0 ? `${masksGenerated} masks` : status}
          </Badge>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          </div>
        )}

        {/* Processing Steps */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Processing steps:
            </div>
            <div className="space-y-1">
              {[
                { step: "Uploading image", done: progress > 0 },
                { step: "Analyzing building structure", done: progress > 20 },
                { step: "Generating segmentation masks", done: progress > 50 },
                { step: "Preparing for coloring", done: progress > 80 },
                { step: "Ready for interaction", done: progress >= 100 }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    item.done ? 'bg-green-500' : 'bg-muted-foreground/30'
                  }`} />
                  <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!isProcessing && !error && masksGenerated === 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Upload an image and click on different building sections to generate AI-powered masks for coloring.
            </p>
          </div>
        )}

        {/* Success Message */}
        {masksGenerated > 0 && !isProcessing && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Successfully generated {masksGenerated} mask{masksGenerated !== 1 ? 's' : ''}. 
                Click on masks to apply colors.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 