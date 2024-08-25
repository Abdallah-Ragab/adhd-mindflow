export default  {
    auth: {
        GenericError: {
            message: "An error occurred while authenticating the request",
            code: "100"
        },
        InvalidToken: {
            message: "Invalid token provided",
            code: "101"
        },
        ExpiredToken: {
            message: "Provided token has expired",
            code: "102"
        },
        MissingToken: {
            message: "No token provided",
            code: "103"
        },
        Unauthorized: {
            message: "Unauthorized usage of token",
            code: "104"
        },
        UserDoesNotExist: {
            message: "User does not exist",
            code: "105"
        },
    }
}