import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="p-10 footer bg-base-200 text-base-content footer-center mt-4">
        <div className="grid grid-flow-col gap-4">
          <a className="">Examples: </a>
          <Link href="/31n1">
            <a className="link">for-loop vs streams</a>
          </Link>
          <Link href="/31ne">
            <a className="link">parallel vs serial streams</a>
          </Link>
        </div>
        <div className="grid grid-flow-col gap-4 grid-1">
          <div>
            <p className="text-lg mb-4">
              This app was created as an entry to the{" "}
              <a
                className="link"
                href="https://blog.cloudflare.com/developer-summer-challenge/"
              >
                Cloudflare Developer Summer Challenge.
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
