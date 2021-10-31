const Footer: React.FC = () => {
  return (
    <>
      <footer className="p-10 footer bg-base-200 text-base-content footer-center mt-4">
        <div className="grid grid-flow-col gap-4">
          <a className="">Examples: </a>
          <a className="link link-hover" href="/31n1">
            for-loop vs streams
          </a>
          <a className="link link-hover" href="/31n1">
            parallel vs serial streams
          </a>
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
