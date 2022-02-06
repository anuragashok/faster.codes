import Footer from "@components/Footer";
import Header from "@components/Header";
import Layout from "@components/Layout";
import Head from "next/head";
import Link from "next/link";

import examples from "resources/examples.json";

const Examples: React.FC = () => {
  return (
    <Layout title="About">
      <div className="w-1/2">
        <p className="text-lg font-medium  mt-2">
          This platform was created by me (
          <a
            href="https://github.com/anuragashok/"
            className="link link-hover link-primary"
          >
            Anurag Ashok
          </a>
          ) as an entry to the{" "}
          <a
            href="https://blog.cloudflare.com/developer-summer-challenge/"
            className="link link-hover link-primary"
          >
            Cloudflare Developer Summer Challenge
          </a>
          .
        </p>
        <p className="text-lg font-medium  mt-2">
          faster.codes is an attempt to build a developer tool to test the
          runtime performance of code blocks. The platform executes iterations
          of the code blocks submitted. Iterations are performed in isolated
          containers to minimize the influence of other factors. It collects
          data from the iterations and compiles a comparative report on various
          performance statistics. Reports are saved and links can be shared for
          discussion.
        </p>

        <div className="text-lg font-medium underline mt-2">
          Below are some examples to try out the faster.codes platform
        </div>
        <ul className="menu mt-2 px-3 border bg-base-100 menu-horizontal">
          {examples.map((v) => {
            return (
              <li key={v.title} className="bordered mt-2 mb-2">
                <Link href={v.link}>
                  <a className="text-lg font-medium">{v.title}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default Examples;
