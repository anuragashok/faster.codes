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
      <div className="m-auto mt-4">
        <div className="text-lg place-items-center place-content-center m-auto mb-2">
          <div className="text-info m-auto uppercase text-center">
            Share results
          </div>
        </div>
        <div className="flex flex-row place-items-center place-content-center z-50">
          <button className="mr-2" title="Copy link to clipboard">
            <FontAwesomeIcon 
              icon={faCopy}
              fontSize="24"
              size="2x"
              onClick={() => navigator.clipboard.writeText(shareUrl)}
            />
          </button>
          <EmailShareButton url={shareUrl} className="mr-2">
            <EmailIcon size={48} />
          </EmailShareButton>
          <TwitterShareButton url={shareUrl} title={title} className="mr-2">
            <TwitterIcon size={48} />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl} title={title} className="">
            <LinkedinIcon size={48} />
          </LinkedinShareButton>
        </div>
      </div>
    </>
  );
};

export default Social;
