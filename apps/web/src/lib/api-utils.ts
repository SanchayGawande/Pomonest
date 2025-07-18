/**
 * Utility functions for API error handling and response formatting
 */

export interface ApiError {
  message: string
  code?: string
  status: number
}

export class ApiErrorHandler {
  static formatError(error: unknown, defaultMessage: string = 'An error occurred'): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      }
    }
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return {
        message: (error as any).message,
        status: (error as any).status || 500
      }
    }
    
    return {
      message: defaultMessage,
      status: 500
    }
  }

  static createResponse(data: any, status: number = 200) {
    return Response.json(data, { status })
  }

  static createErrorResponse(error: ApiError) {
    return Response.json(
      { error: error.message },
      { status: error.status }
    )
  }
}

/**
 * Enhanced token validation utility
 */
export function validateBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.replace('Bearer ', '').trim()
  return token.length > 0 ? token : null
}