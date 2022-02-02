const Header: React.FC = () => {
  return (
    <>
      <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
        <div className="container mx-auto h-full">
          <div className="px-2 mx-2 navbar-start">
            <svg
              className="fill-current inline-block"
              viewBox="0 0 24 24"
              height="48"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path d="M16 10.174v-2.174h3v2.174c.689.163 1.335.436 1.92.799l.816-.973 1.532 1.286-.83.989c.974 1.137 1.562 2.613 1.562 4.225 0 3.587-2.913 6.5-6.5 6.5s-6.5-2.913-6.5-6.5c0-3.071 2.135-5.648 5-6.326zm7-9.174v7h-2v-2h-19v15h8.289c.472.754 1.059 1.429 1.736 2h-12.025v-22h23zm-5.5 11c2.484 0 4.5 2.016 4.5 4.5s-2.016 4.5-4.5 4.5-4.5-2.016-4.5-4.5 2.016-4.5 4.5-4.5zm2.368 1.49l-2.076 1.562c-.503-.103-1.045.051-1.413.461-.548.615-.496 1.558.119 2.107.614.55 1.558.497 2.107-.117.367-.412.459-.967.3-1.456l1.303-2.255-.34-.302z" />
            </svg>
            <span className="ml-6 align-middle inline-block text-2xl font-bold">
              &#123;&nbsp;faster.codes&nbsp;&#125;
            </span>
          </div>
          <div className="hidden px-2 mx-2 navbar-center lg:flex">
            <h2 className=" text-3xl  text-center"></h2>
          </div>
          <div className="navbar-end">
            <div className="text-right items-stretch">
              <a
                className="btn btn-ghost btn-sm rounded-btn"
                href="https://github.com/anuragashok/faster.codes"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-5 mr-2 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Github
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
