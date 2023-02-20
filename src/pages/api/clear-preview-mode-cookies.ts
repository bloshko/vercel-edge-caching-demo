import { NextApiHandler } from "next";

const clearPreviewModeCookies: NextApiHandler = (req, res) =>
  res.clearPreviewData({}).status(200).json("Successful");

export default clearPreviewModeCookies;
