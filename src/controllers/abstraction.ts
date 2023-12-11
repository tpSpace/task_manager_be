import { Response } from "express";

export enum HttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BADREQUEST = 400,
  UNAUTHORIZED = 401,
  NOTFOUND = 404,
  CONFLICT = 409,
  SERVERERROR = 500,
}
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  GET = "get",
  FETCH = "fetch",
  FIND = "find",
  VALIDATE = "validate",
}

function getStatusMessage(statusCode: HttpStatusCode) {
  switch (statusCode) {
    case HttpStatusCode.SUCCESS:
      return "success";
    case HttpStatusCode.CREATED:
      return "created";
    case HttpStatusCode.BADREQUEST:
      return "bad request";
    case HttpStatusCode.UNAUTHORIZED:
      return "unauthorized";
    case HttpStatusCode.NOTFOUND:
      return "not found";
    case HttpStatusCode.CONFLICT:
      return "conflict";
    case HttpStatusCode.SERVERERROR:
      return "server error";
    default:
      return "unknown";
  }
}

function getAction(statusCode: HttpStatusCode) {
  switch (statusCode) {
    case HttpStatusCode.NOTFOUND:
      return "Cannot find";
    default:
      return "Cannot interact with";
  }
}

export class FastResponse {
  private response: Response;
  private name: string;
  /**
   * Create a new instance of CustomResponse.
   * @param {Response} response - The Express response object.
   */
  constructor(response: Response, entity: string = "") {
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
   * Build an error response with the specified status code, action, and optional custom message.
   *
   * @param {HttpStatusCode} statusCode - The HTTP status code for the error response.
   * @param {Action} [action] - Action unable to perform (e.g., create, update, delete). Ommitable if `NOTFOUND`.
   * @param {string} [custom] - Optional custom error message.
   * @returns {Response} The Express response object representing the error response.
   */
  buildError(
    statusCode: HttpStatusCode,
    action?: Action,
    custom?: string
  ): Response {
    return this.response.status(statusCode).json({
      status: getStatusMessage(statusCode) || "unknown",
      error:
        custom ??
        `${action ? "Cannot " + action : getAction(statusCode)} ${this.name}.`,
    });
  }
}
