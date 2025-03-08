"server-only";

import { JWTVerifyResult, jwtVerify } from "jose";
import { cookies } from "next/headers";

type TokenResponse = {
  user_id: number;
  is_staff: boolean;
};

class TokenService {
  public async readToken() {
    const cookie = (await cookies()).get("access-token");

    if (!cookie) {
      return {
        data: null,
        error: "no access-token",
      };
    }

    const token = cookie.value;

    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);

    try {
      const verifyToken: JWTVerifyResult<TokenResponse> = await jwtVerify(token, secret);
      return {
        data: verifyToken.payload,
        error: null,
      };
    } catch (e: unknown) {
      const error = e as { code: string };
      switch (error.code) {
        case "ERR_JWT_EXPIRED": {
          return {
            data: null,
            error: {
              message: "Token expired",
            },
          };
        }
        default: {
          return {
            data: null,
            error: {
              message: error.code,
            },
          };
        }
      }
    }
  }
}

export default new TokenService();
