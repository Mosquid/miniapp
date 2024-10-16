import { FC, useState } from "react";
import { useCurrentUser } from "./CurrentUserProvider";
import Button from "./Button";

const BOT_URL = "https://t.me/squeezeGameBot?start=";

export interface InviteProps {
  userId: string;
}

const Invite: FC<InviteProps> = ({ userId }) => {
  const { user: currentUser } = useCurrentUser();
  const [copied, setCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    const url = `${BOT_URL}${text}`;
    navigator.clipboard.writeText(url);
  };

  if (!currentUser || !currentUser.referralCode) {
    return null;
  }

  const { referralCode } = currentUser;

  return (
    <div
      style={{
        paddingTop: 20,
        textAlign: "center",
      }}
    >
      <Button
        disabled={copied}
        onClick={() => {
          copyToClipboard(referralCode);
          setCopied(true);
        }}
      >
        {copied ? "Copied!" : "Invite"}
      </Button>
    </div>
  );
};

export default Invite;
