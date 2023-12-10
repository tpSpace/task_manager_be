export enum HttpStatusCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  NOTFOUND = 404,
  SERVERERROR = 500,
}

interface ApiResponse<T> {
  status: string;
  statusCode?: HttpStatusCode;
  data?: T | T[];
  error?: string;
}

export default class ApiResponseBuilder {
  private static statusMessage: Record<HttpStatusCode, string> = {
    [HttpStatusCode.SUCCESS]: "success",
    [HttpStatusCode.UNAUTHORIZED]: "unauthorized",
    [HttpStatusCode.NOTFOUND]: "not found",
    [HttpStatusCode.SERVERERROR]: "server error",
  };

  /**
   * Builds a success response for API calls.
   *
   * @template T - The type of data to be included in the response.
   * @param {T} data - The data to be included in the response body.
   * @returns {ApiResponse<T>} - The constructed API response with a success status.
   */
  public static buildSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      status: this.statusMessage[HttpStatusCode.SUCCESS],
      data,
    };
  }
  /**
   * Builds an error response for API calls.
   *
   * @template T - The type of data to be included in the response.
   * @param {HttpStatusCode} statusCode - The HTTP status code representing the error.
   * @param {string} error - The error message describing the nature of the failure.
   * @param {T | undefined} [data] - Optional additional data to be included in the response body.
   * @returns {ApiResponse<T>} - The constructed API response with an error status.
   */
  public static buildErrorResponse<T>(
    statusCode: HttpStatusCode,
    error: string
  ): ApiResponse<T> {
    return {
      status: this.statusMessage[statusCode] || "unknown",
      error: error,
    };
  }
}
