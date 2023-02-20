import { useIsLoggedIn } from "@/hooks/login";
import { useRouter } from "next/router";

export const LoginButton: React.FC = ({}) => {
  const isLoggedIn = useIsLoggedIn();
  const { reload } = useRouter();

  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
    });

    const body = await response.json();
    const isLoginSuccessful = body.login === "Successful";
    if (!isLoginSuccessful) {
      // handle errors
    }

    reload();
  };

  const handleLogOut = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    const body = await response.json();
    const isLogOutSuccessful = body.logout === "Successful";
    if (!isLogOutSuccessful) {
      // handle errors
    }

    reload();
  };

  const buttonText = isLoggedIn ? "Log out" : "Log in";

  const handleLoginClick = isLoggedIn ? handleLogOut : handleLogin;

  return <button onClick={handleLoginClick}>{buttonText}</button>;
};
