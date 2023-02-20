import { NextApiHandler } from "next";
import { PREVIEW_TOKEN_PRIVATE } from "@/config";
import { fetchProductSlugByEntryId } from "@/lib/contentfulAPI";
import { paths } from "@/paths";
import { getVercelNoCacheCookieAddValue } from "@/lib/ssrUtils";

const preview: NextApiHandler = async (req, res) => {
  const token = req.query?.token;
  const entryId = req.query?.entry_id;

  if (
    token !== PREVIEW_TOKEN_PRIVATE ||
    typeof entryId !== "string" ||
    !entryId
  ) {
    return res.status(401).json("Invalid token or entry_id");
  }

  const entrySlug = await fetchProductSlugByEntryId(entryId, true);

  if (!entrySlug) {
    return res.status(404).json("No post with this entry id");
  }

  return res
    .setHeader("Cache-Control", "no-store, no-store, max-age=0")
    .setHeader("Set-Cookie", getVercelNoCacheCookieAddValue())
    .setPreviewData("", { maxAge: 60 * 60 })
    .redirect(302, `${paths.product}/${entrySlug}`);
};

export default preview;
