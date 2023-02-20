import { useRouter } from "next/router";

export const ClearPreviewCookiesButton: React.FC = () => {
  const { reload } = useRouter();

  const handleClick = async () => {
    await fetch("/api/clear-preview-mode-cookies", { method: "POST" });

    reload();
  };

  return <button onClick={handleClick}>Remove Preview Mode</button>;
};
