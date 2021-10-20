const Header: React.FC = () => {
  return (
    <>
      <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
        <div className="px-2 mx-2 navbar-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-5 mr-2 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span className="text-lg font-bold">
            &#123;&nbsp;faster.codes&nbsp;&#125;
          </span>
        </div>
        <div className="hidden px-2 mx-2 navbar-center lg:flex">
          <h2 className=" text-3xl  text-center">
            What runs faster? Find out now!
          </h2>
        </div>
        <div className="navbar-end">
          <div className="flex items-stretch">
            <a className="btn btn-ghost btn-sm rounded-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block w-5 mr-2 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Credits
            </a>
            <a className="btn btn-ghost btn-sm rounded-btn">
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
    </>
  );
};

export default Header;
