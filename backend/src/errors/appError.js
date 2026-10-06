export class AppError extends Error{

    constructor(message, statusCode){
        super(message);
        this.statusCode =statusCode;
        this.isOperationalError=true;

        Error.captureStackTrace(this, this.constructor);

    }
}

export class UnauthorizedError extends AppError{
    constructor(message = "Unauthorized access"){
        super(message,401)
    }
}
export class BadRequestError extends AppError{
    constructor(message = "Bad Request"){
        super(message,400)
    }
}
export class ForbiddenError extends AppError{
    constructor(message = "Forbidde: Action not allowed"){
        super(message,403)
    }
}
export class NotFoundError extends AppError{
    constructor(message = "Requested resource not found"){
        super(message,404)
    }
}