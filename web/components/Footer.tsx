import React from "react";
import Link from "next/link";
import examples from "resources/examples.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faList,
  faBug,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  return (
    <>
      <div className="bg-neutral">
        <footer className="mt-10 p-10 footer bg-neutral text-neutral-content container mx-auto ">
          <div>
            <Link href="/">
              <a>
                <svg
                  className="fill-current inline-block"
                  viewBox="0 0 24 24"
                  height="72"
                  width="72"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                >
                  <path d="M16 10.174v-2.174h3v2.174c.689.163 1.335.436 1.92.799l.816-.973 1.532 1.286-.83.989c.974 1.137 1.562 2.613 1.562 4.225 0 3.587-2.913 6.5-6.5 6.5s-6.5-2.913-6.5-6.5c0-3.071 2.135-5.648 5-6.326zm7-9.174v7h-2v-2h-19v15h8.289c.472.754 1.059 1.429 1.736 2h-12.025v-22h23zm-5.5 11c2.484 0 4.5 2.016 4.5 4.5s-2.016 4.5-4.5 4.5-4.5-2.016-4.5-4.5 2.016-4.5 4.5-4.5zm2.368 1.49l-2.076 1.562c-.503-.103-1.045.051-1.413.461-.548.615-.496 1.558.119 2.107.614.55 1.558.497 2.107-.117.367-.412.459-.967.3-1.456l1.303-2.255-.34-.302z" />
                </svg>
                <p className="text-2xl mt-2">
                  &#123;&nbsp;faster.codes&nbsp;&#125;
                </p>
              </a>
            </Link>
            <p>&copy; 2022</p>
          </div>
          <div>
            <span className="footer-title">Examples</span>
            {examples.map((v) => {
              return (
                <Link href={v.link}>
                  <a className="link link-hover">{v.title}</a>
                </Link>
              );
            })}
          </div>
          <div>
            <span className="footer-title">Menu</span>
            <a href="/about">
              <FontAwesomeIcon
                className="inline-block w-5 mr-2 stroke-current align-middle"
                icon={faInfoCircle}
              />
              About
            </a>
            <a href="/examples">
              <FontAwesomeIcon
                className="inline-block w-5 mr-2 stroke-current align-middle"
                icon={faList}
              />
              Examples
            </a>
            <a
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
            <a href="/examples" target="_blank" rel="noreferrer">
              <FontAwesomeIcon
                className="inline-block w-5 mr-2 stroke-current align-middle"
                icon={faCode}
              />
              Github
            </a>
          </div>
          <div>
            <span className="footer-title">How did we do?</span>
            <p>
              We hope that this platform has been useful to you. <br /> We are
              actively working on adding more runtimes and features. <br />{" "}
              Meanwhile, if there is something you would like to see, than later{" "}
              <a
                className="link link-hover link-primary"
                href="https://github.com/anuragashok/faster.codes/issues/new"
              >
                please let us know
              </a>
            </p>

            <a className="link link-hover">&nbsp;</a>
          </div>
        </footer>
      </div>
      {/* <footer className="p-10 footer bg-neutral text-neutral-content footer-center mt-4">
        <div className="grid grid-flow-col gap-4">
          <a>Examples: </a>
          <Link href="/?runId=31nq">
            <a className="link">for-loop vs streams</a>
          </Link>
          <Link href="/?runId=31nr">
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
      </footer> */}
    </>
  );
};

export default Footer;
