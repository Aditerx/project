import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { requestMiddleware } from "./lib/request-middleware.server";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  // The request middleware stack intentionally stays small:
  // - errorMiddleware normalizes unexpected SSR failures into our branded error page
  // - requestMiddleware owns auth, storage delivery, and protected route checks
  requestMiddleware: [errorMiddleware, requestMiddleware],
}));
