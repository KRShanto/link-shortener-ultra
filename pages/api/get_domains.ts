import Domain from "../../models/Domain";
import User from "../../models/User";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.cookies;

  await dbConnect();

  if (!token) {
    return res.status(400).json({
      message: "Token is not provided",
      type: "UNAUTHORIZED",
    });
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  // check if the user is in the database
  // @ts-expect-error
  const userInDatabase = await User.findOne({ username: decode.username });

  if (!userInDatabase) {
    return res.status(400).json({
      message: "User is not in the database",
      type: "UNAUTHORIZED",
    });
  }

  let domainsToReturn = [];
  // Get the domains of the user
  // if the user is an admin, get all the domains
  if (userInDatabase.role === "admin") {
    // @ts-expect-error
    const domains = await Domain.find({});
    domainsToReturn = domains;
  } else {
    // @ts-expect-error
    const domains = await Domain.find({ domain: userInDatabase.domain });
    domainsToReturn = domains;
  }

  return res.status(200).json({
    message: "Domains fetched successfully",
    data: domainsToReturn,
    type: "SUCCESS",
  });
}
