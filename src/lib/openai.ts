// OpenAI DALL-E 3 Integration
export interface ImageGenerationRequest {
  prompt: string
  negativePrompt?: string
  style: string
  aspectRatio: string
  quality: string
  numImages: number
}

export interface ImageGenerationResponse {
  success: boolean
  images: string[]
  error?: string
}

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_BASE_URL = 'https://api.openai.com/v1'

export async function generateImages(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const { prompt, negativePrompt, style, aspectRatio, quality, numImages } = request

    // Enhance prompt with style
    const enhancedPrompt = enhancePromptWithStyle(prompt, style)
    
    // Map aspect ratios to DALL-E format
    const size = mapAspectRatioToSize(aspectRatio)
    
    // Map quality settings
    const dallEQuality = quality === 'ultra' ? 'hd' : 'standard'

    const response = await fetch(`${OPENAI_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: Math.min(numImages, 1), // DALL-E 3 only supports 1 image at a time
        size: size,
        quality: dallEQuality,
        style: 'vivid', // or 'natural'
        response_format: 'url'
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to generate images')
    }

    const data = await response.json()
    
    return {
      success: true,
      images: data.data.map((item: any) => item.url)
    }

  } catch (error) {
    console.error('Image generation error:', error)
    return {
      success: false,
      images: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

function enhancePromptWithStyle(prompt: string, style: string): string {
  const styleEnhancements = {
    'photorealistic': 'photorealistic, high quality, detailed, professional photography',
    'abstract': 'abstract art, modern, creative, artistic, colorful',
    'anime': 'anime style, manga, Japanese animation, vibrant colors, detailed',
    'artistic': 'artistic painting, traditional art, brush strokes, artistic style'
  }

  const enhancement = styleEnhancements[style as keyof typeof styleEnhancements] || ''
  return `${prompt}, ${enhancement}`.trim()
}

function mapAspectRatioToSize(aspectRatio: string): string {
  const sizeMap = {
    '1:1': '1024x1024',
    '16:9': '1792x1024',
    '9:16': '1024x1792',
    '4:3': '1024x1024' // DALL-E 3 doesn't support 4:3, using 1:1 instead
  }
  
  return sizeMap[aspectRatio as keyof typeof sizeMap] || '1024x1024'
}

// Fallback to sample images if API fails
export function getSampleImage(): string {
  const sampleImages = [
    "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798664450_707e4044.webp",
    "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798666349_af2b315f.webp",
    "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798669968_cfa053e4.png",
    "https://d64gsuwffb70l.cloudfront.net/68d523187440d1c92f1c0b02_1758798670734_a3f481a4.webp"
  ]
  
  return sampleImages[Math.floor(Math.random() * sampleImages.length)]
}
