import { toast } from 'sonner';

export interface ApiResponse<T> {
  result: {
    code: number;
    message: string;
  };
  data: T | null;
}

export async function handleApiResponse<T>(
  response: Response,
  options: {
    showSuccessToast?: boolean;
    successMessage?: string;
    errorMessage?: string;
  } = {}
): Promise<T> {
  const { showSuccessToast = false, successMessage, errorMessage } = options;

  // Get the raw response text first
  const responseText = await response.text();
  
  // Try to parse as JSON
  let data: ApiResponse<T>;
  try {
    data = JSON.parse(responseText);
  } catch (error) {
    console.error('Failed to parse API response:', error);
    console.error('Raw response:', responseText);
    const message = errorMessage || 'Invalid response from server';
    toast.error(message);
    throw new Error(message);
  }

  // Check the result code
  if (data.result.code !== 200) {
    const message = data.result.message || errorMessage || 'Operation failed';
    toast.error(message);
    throw new Error(message);
  }

  // Check if we have data
  if (data.data === null) {
    const message = errorMessage || 'No data received from server';
    toast.error(message);
    throw new Error(message);
  }

  // Show success message if requested
  if (showSuccessToast) {
    toast.success(successMessage || data.result.message || 'Operation successful');
  }

  return data.data;
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit & {
    showSuccessToast?: boolean;
    successMessage?: string;
    errorMessage?: string;
  } = {}
): Promise<T> {
  const { showSuccessToast, successMessage, errorMessage, ...fetchOptions } = options;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...fetchOptions.headers,
      },
    });

    return handleApiResponse<T>(response, {
      showSuccessToast,
      successMessage,
      errorMessage,
    });
  } catch (error) {
    // If it's not an Error from handleApiResponse, it's a network/other error
    if (!(error instanceof Error)) {
      const message = errorMessage || 'Request failed';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
} 