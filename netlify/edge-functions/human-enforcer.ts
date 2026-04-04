import { PXEnforcer, PXRawConfig } from "perimeterx-node-core-ts";
import type { Context, EdgeFunction } from "@netlify/edge-functions";

const getPxCredentials = () => {
  const pxAppId = Netlify.env.get("PX_APP_ID");
  const pxCookieSecret = Netlify.env.get("PX_COOKIE_SECRET");
  const pxAuthToken = Netlify.env.get("PX_AUTH_TOKEN");

  if (!pxAppId || !pxCookieSecret || !pxAuthToken) {
    return null;
  }

  return {
    px_app_id: pxAppId,
    px_cookie_secret: pxCookieSecret,
    px_auth_token: pxAuthToken,
  };
};

const handler: EdgeFunction = async (request: Request, context: Context) => {
  const credentials = getPxCredentials();

  if (!credentials) {
    context.log(
      "[PerimeterX] Missing PX_APP_ID/PX_COOKIE_SECRET/PX_AUTH_TOKEN. Bypassing edge enforcement.",
    );
    return context.next(request);
  }

  const pxConfig: PXRawConfig = {
    ...credentials,
    px_extract_user_ip: (incomingRequest: Request) => {
      const forwarded = incomingRequest.headers
        .get("x-forwarded-for")
        ?.split(",")
        ?.at(0)
        ?.trim();

      return forwarded || context.ip;
    },
  };

  try {
    const px = new PXEnforcer(pxConfig);
    const resp = await px.enforce(request);

    if (resp.pxResponse) {
      return new Response(resp.pxResponse.body ?? null, {
        headers: (resp.pxResponse.headers ?? {}) as HeadersInit,
        status: resp.pxResponse.status,
      });
    }

    return await context.next(request);
  } catch (error) {
    context.log("[PerimeterX] Enforcement failed. Bypassing request.", error);
    return context.next(request);
  }
};

export default handler;
