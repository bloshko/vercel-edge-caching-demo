import { paths } from "../paths";
import { ClearPreviewCookiesButton } from "./ClearPreviewCookiesButton";

import { NavbarLink } from "./NavbarLink";

interface Navbar {
  isPreviewMode?: boolean;
}

export const Navbar: React.FC<Navbar> = ({ isPreviewMode }) => {
  return (
    <nav>
      <NavbarLink href={paths.home}>Home</NavbarLink>
      {isPreviewMode && <ClearPreviewCookiesButton />}
    </nav>
  );
};
