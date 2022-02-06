import React from "react";
import Link from "next/link";
import examples from "resources/examples.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faList,
  faBug,
  faCode,
  faEnvelope,
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
                <p className="text-3xl mt-2">
                  &#123;&nbsp;faster.codes&nbsp;&#125;
                </p>
              </a>
            </Link>
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
            <a
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
            <Link href="/examples">
              <a>
                <FontAwesomeIcon
                  className="inline-block w-5 mr-2 stroke-current align-middle"
                  icon={faList}
                />
                Examples
              </a>
            </Link>
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
            <a
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
          <div>
            <span className="footer-title">Examples</span>
            {examples.map((v) => {
              return (
                <Link key={v.title} href={v.link}>
                  <a className="link link-hover">{v.title}</a>
                </Link>
              );
            })}
          </div>
          <div>
            <span className="footer-title">How did we do?</span>
            <p>
              We hope that this platform has been useful to you. <br /> We are
              actively working on adding more runtimes and features. <br />{" "}
              Meanwhile, if there is something you would like to see{" "}
              <a
                className="link link-hover link-primary"
                href="https://github.com/anuragashok/faster.codes/issues/new"
              >
                please let us know
              </a>
            </p>
            <p>
              You can react out to us via the{" "}
              <a
                href="https://forms.gle/U4ZrUXwT9GCfFKcv6"
                className="link link-hover link-primary"
              >
                contact form
              </a>{" "}
              or on{" "}
              <a
                href="https://www.linkedin.com/in/anurag-ashok/"
                className="link link-hover link-primary"
              >
                Linkedn
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
