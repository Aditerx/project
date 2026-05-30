import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

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

const requestMiddleware = createMiddleware({ type: "request" }).server(async (options) => {
  const { requestMiddleware } = await import("./lib/request-middleware.server");
  return requestMiddleware.options.server!(options);
});

export const startInstance = createStart(() => ({
  // The request middleware stack intentionally stays small:
  // - errorMiddleware normalizes unexpected SSR failures into our branded error page
  // - requestMiddleware owns auth, storage delivery, and protected route checks
  requestMiddleware: [errorMiddleware, requestMiddleware],
}));
