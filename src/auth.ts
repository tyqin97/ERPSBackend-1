import { User } from "./entity/User";
import { sign } from "jsonwebtoken";

export const createAccessToken = (user: User ) => {
  return sign({ userId: user.id }, "accessToken", {
    expiresIn: "15min",
  });
};

export const createRefreshToken = (user: User ) => {
  return sign({ userId: user.id }, "refreshToken", {
    expiresIn: "7d",
  });
};
