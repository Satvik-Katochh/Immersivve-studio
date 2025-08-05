export interface Mask {
  id: number
  coordinates: number[][]
  color?: string
}

export interface GenerateMasksRequest {
  image: File
  click_points: number[][]
}

export interface GenerateMasksResponse {
  masks: Mask[]
  success: boolean
  message?: string
}

export interface ApplyColorRequest {
  mask_id: number
  color: string
}

export interface ApplyColorResponse {
  success: boolean
  colored_image_url?: string
  message?: string
}

export interface UploadResponse {
  success: boolean
  filename?: string
  message?: string
} 