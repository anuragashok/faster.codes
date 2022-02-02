import { faClipboard, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import {
  EmailShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";

const Social: React.FC = () => {
  const router = useRouter();
  const shareUrl = "https://faster.codes/?runId=" + router.query.runId;
  const title = "Checkout this comparision on faster.codes";
  return (
    <>
      <div className="flex flex-col z-50 place-items-center place-content-center rounded">
        <EmailShareButton url={shareUrl} className="my-1">
          <EmailIcon size={48} round={true} />
        </EmailShareButton>
        <TwitterShareButton url={shareUrl} title={title} className="my-1">
          <TwitterIcon size={48} round={true} />
        </TwitterShareButton>
        <LinkedinShareButton url={shareUrl} title={title} className="my-1">
          <LinkedinIcon size={48} round={true} />
        </LinkedinShareButton>
      </div>
    </>
  );
};

export default Social;
