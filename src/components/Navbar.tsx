import { useRouter } from "next/router";
import { paths } from "../paths";
import { ClearPreviewCookiesButton } from "./ClearPreviewCookiesButton";

import { NavbarLink } from "./NavbarLink";

export const Navbar: React.FC = () => {
  const { isPreview } = useRouter();
  return (
    <nav>
      <NavbarLink href={paths.home}>Home</NavbarLink>
      {isPreview && <ClearPreviewCookiesButton />}
    </nav>
  );
};
