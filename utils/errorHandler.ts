import { NextResponse } from "next/server";
import { ZodError, ZodIssue } from "zod";

export const handleError = (error: unknown, defaultMessage: string) => {
  console.error(defaultMessage, error);

  const errorMessage =
    error instanceof Error
      ? error.message
      : "An unexpected error occurred while processing the request.";

  return NextResponse.json(
    {
      error: defaultMessage,
      message: errorMessage,
      details: error instanceof Error ? error.stack : undefined,
    },
    { status: 500 }
  );
};

export const handleCustomError = (defaultMessage: string, status: number) => {
  console.error(defaultMessage);
  return NextResponse.json({ error: defaultMessage }, { status: status });
};

export const handleValidationError = (result: ZodError) => {
  return NextResponse.json(
    {
      errors: result.errors.map((err: ZodIssue) => ({
        message: err.message,
        path: err.path.map((p) => p.toString()),
      })),
    },
    { status: 400 }
  );
};
