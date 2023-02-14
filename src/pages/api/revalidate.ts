import { NextApiHandler } from "next";

const revalidate: NextApiHandler = (req, res) => {
  res.revalidate("/product/tomato");

  return res.status(200).json({ revalidate: "Successful" });
};

export default revalidate;
