import type { 
  Mask, 
  GenerateMasksRequest, 
  GenerateMasksResponse, 
  ApplyColorRequest, 
  ApplyColorResponse, 
  UploadResponse 
} from "@/types"

// API endpoints configuration
const API_BASE_URL = "https://satvik-katochh--building-segmentation-sam2-generate-mask-cd2bf7.modal.run"

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async uploadImage(image: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', image)

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }

    return await response.json()
  }

  async generateMasks(image: File, clickPoints: number[][]): Promise<GenerateMasksResponse> {
    const formData = new FormData()
    formData.append('file', image)
    formData.append('click_points', JSON.stringify(clickPoints))

    const response = await fetch(`${API_BASE_URL}/generate-masks`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Mask generation failed: ${response.status}`)
    }

    return await response.json()
  }

  async applyColor(maskId: number, color: string): Promise<ApplyColorResponse> {
    return this.makeRequest<ApplyColorResponse>('/apply-color', {
      method: 'POST',
      body: JSON.stringify({
        mask_id: maskId,
        color: color,
      }),
    })
  }

  async downloadResult(filename: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/download/${filename}`)
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`)
    }

    return await response.blob()
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>('/')
  }
}

export const apiService = new ApiService()

// Re-export types for convenience
export type { 
  Mask, 
  GenerateMasksRequest, 
  GenerateMasksResponse, 
  ApplyColorRequest, 
  ApplyColorResponse, 
  UploadResponse 
} from "@/types" 