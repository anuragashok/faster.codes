import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faCode,
  faList,
  faBug,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <>
      <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
        <div className="container mx-auto h-full">
          <div className="px-2 mx-2 navbar-start">
            <Link href="/">
              <a className="link">
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
              </a>
            </Link>
          </div>
          <div className="hidden px-2 mx-2 navbar-center lg:flex">
            <h2 className=" text-3xl  text-center"></h2>
          </div>
          <div className="navbar-end text-right">
            <div className="text-right items-stretch inline-block">
              <Link href="/about">
                <a className="btn btn-ghost btn-sm rounded-btn">
                  <FontAwesomeIcon
                    className="inline-block w-5 mr-2 stroke-current align-middle"
                    icon={faInfoCircle}
                  />
                  About
                </a>
              </Link>
            </div>
            <div className="text-right items-stretch inline-block">
              <a
                className="btn btn-ghost btn-sm rounded-btn"
                href="https://forms.gle/U4ZrUXwT9GCfFKcv6"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  className="inline-block w-5 mr-2 stroke-current align-middle"
                  icon={faEnvelope}
                />
                Contact
              </a>
            </div>
            <div className="text-right items-stretch inline-block">
              <Link href="/examples">
                <a className="btn btn-ghost btn-sm rounded-btn">
                  <FontAwesomeIcon
                    className="inline-block w-5 mr-2 stroke-current align-middle"
                    icon={faList}
                  />
                  Examples
                </a>
              </Link>
            </div>
            <div className="text-right items-stretch inline-block">
              <a
                className="btn btn-ghost btn-sm rounded-btn"
                href="https://github.com/anuragashok/faster.codes/issues/new"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  className="inline-block w-5 mr-2 stroke-current align-middle"
                  icon={faBug}
                />
                Report Issue
              </a>
            </div>
            <div className="text-right items-stretch inline-block">
              <a
                className="btn btn-ghost btn-sm rounded-btn"
                href="https://github.com/anuragashok/faster.codes"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  className="inline-block w-5 mr-2 stroke-current align-middle"
                  icon={faCode}
                />
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
