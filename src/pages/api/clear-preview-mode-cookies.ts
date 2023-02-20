import { getVercelNoCacheCookieDeleteValue } from "@/lib/ssrUtils";
import { NextApiHandler } from "next";

const clearPreviewModeCookies: NextApiHandler = (req, res) => {
  if (req.method === "POST") {
    res
      .setHeader("Set-Cookie", getVercelNoCacheCookieDeleteValue())
      .clearPreviewData({})
      .status(200)
      .json("Successful");
  }

  return res.status(400);
};

export default clearPreviewModeCookies;
