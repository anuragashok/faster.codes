const Footer: React.FC = () => {
  return (
    <>
      <footer className="p-10 footer bg-base-200 text-base-content footer-center">
        <div className="grid grid-flow-col gap-4">
          <a className="">Examples: </a>
          <a className="link link-hover">for-loop vs streams</a>
          <a className="link link-hover">parallel vs serial streams</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
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

            <p>
              Apart from the excellent and cost-effective edge hosting and
              computing provided by Cloudflare, this app uses a lot of
              free/open-source libraries by various awesome programmers around
              the world. Thank you everyone!
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
