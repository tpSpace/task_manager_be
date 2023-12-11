import { Response } from "express";

export enum HttpStatusCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  NOTFOUND = 404,
  CONFLICT = 409,
  SERVERERROR = 500,
}

interface ApiResponse<T> {
  status: string;
  statusCode?: HttpStatusCode;
  data?: T | T[];
  error?: string;
}

export default class FastResponse {
  private response: Response;
  private name: string;

  private statusMessage: Record<HttpStatusCode, string> = {
    [HttpStatusCode.SUCCESS]: "success",
    [HttpStatusCode.UNAUTHORIZED]: "unauthorized",
    [HttpStatusCode.NOTFOUND]: "not found",
    [HttpStatusCode.CONFLICT]: "conflict",
    [HttpStatusCode.SERVERERROR]: "server error",
  };
  /**
   * Create a new instance of CustomResponse.
   * @param {Response} response - The Express response object.
   */
  constructor(response: Response, entity: string) {
    this.response = response;
    this.name = entity;
  }
  /**
   * Build a success response with the provided data.
   * @param {any} data - The data to include in the success response.
   * @returns {Response} The Express response object.
   */
  buildSuccess(data: any): Response {
    return this.response.status(HttpStatusCode.SUCCESS).json({
      status: "success",
      data: data,
    });
  }
  /**
   * Build an error response with the specified status code and optional custom message.
   * @param {HttpStatusCode} statusCode - The HTTP status code for the error response.
   * @param {string} [custom] - Optional custom error message.
   * @returns {Response} The Express response object.
   */
  buildError(statusCode: HttpStatusCode, custom?: string): Response {
    return this.response.status(statusCode).json({
      status: this.statusMessage[statusCode] || "unknown",
      error: custom ?? `Failed to get ${this.name}.`,
    });
  }
}
