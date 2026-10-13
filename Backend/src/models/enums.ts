
 // HTTP status codes used by the backend:
export enum StatusCode {

    // Successful responses:
    OK = 200,
    Created = 201,
    NoContent = 204,

    // Client errors:
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    UnprocessableContent = 422,

    // Server errors:
    InternalServerError = 500

}

// User roles matching the roles table in MySQL:
export enum Role {
    User = 1,
    Admin = 2
}
