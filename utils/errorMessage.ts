export const ERROR_MESSAGES = {
  // Validation Errors
  INVALID_EMAIL: "Invalid email address.",
  INVALID_ID: "Invalid ID format.",
  USERNAME_EMAIL_EXISTS: "Username or Email already exists.",

  // Authentication and Authorization Errors
  USER_NOT_FOUND: "User not found.",

  // User Management Errors
  CREATE_FAILED: "Error creating user.",
  UPDATE_FAILED: "Failed to update user.",
  DELETE_FAILED: "Failed to delete user.",
  REGISTER_FAILED:
    "Registration failed. Username or email might already be in use.",

  // System/Server Errors
  INTERNAL_SERVER_ERROR: "Internal server error.",
  METHOD_NOT_ALLOWED: "Method not allowed.",
  PROCESS_FAILED: "Failed to process request.",

  // Password Reset Errors
  PASSWORD_RESET_FAILED: "Failed to send password reset email.",
  SAME_PASSWORD: "New password cannot be the same as the previous password.",
} as const;
