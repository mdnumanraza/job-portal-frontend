export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export const successResponse = <T>(data: T, message: string = 'Success', status: number = 200) => {\
  return NextResponse.json({\
    success: true,
    message,
    data
  } as ApiResponse<T>, { status });
};

export const errorResponse = (message: string, status: number = 400, error?: string) => {\
  return NextResponse.json({\
    success: false,
    message,
    error
  } as ApiResponse, { status });\
};
