"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImageUpload: (file: File, preview: string) => void
  isProcessing?: boolean
}

export function ImageUpload({ onImageUpload, isProcessing = false }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      })
      return false
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      setFileName(file.name)
      onImageUpload(file, result)
      
      toast({
        title: "Image uploaded successfully",
        description: `${file.name} has been uploaded and is ready for processing.`,
      })
    }
    reader.readAsDataURL(file)
  }, [onImageUpload, toast])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleRemoveImage = useCallback(() => {
    setPreview(null)
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Image</span>
        </CardTitle>
        <CardDescription>
          Drag and drop an image or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {!preview ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Drop your image here or click to browse
            </p>
            <Button onClick={handleBrowseClick} disabled={isProcessing}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supports JPEG, PNG, WebP up to 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Uploaded image"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>{fileName}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 