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
  const shareUrl = "https://faster.codes/" + router.pathname;
  const title = "Checkout this comparision on faster.codes";
  return (
    <>
      <div className="text-base text-center z-50 text-center w-100px">
        <div className="text-info m-auto">TO SHARE RESULTS</div>
        <div className="m-auto">COPY URL</div>
        <div className="m-auto">or</div>
      </div>
      <div className="flex flex-row text-center z-50">
        <EmailShareButton url={shareUrl} className="mr-2">
          <EmailIcon size={32} round />
        </EmailShareButton>
        <TwitterShareButton url={shareUrl} title={title} className="mr-2">
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={shareUrl} title={title} className="">
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
    </>
  );
};

export default Social;
