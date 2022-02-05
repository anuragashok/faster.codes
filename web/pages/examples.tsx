import Footer from "@components/Footer";
import Header from "@components/Header";
import Layout from "@components/Layout";
import Head from "next/head";
import Link from "next/link";

import examples from "resources/examples.json";

const Examples: React.FC = () => {
  return (
    <Layout title="Examples">
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
    </Layout>
  );
};

export default Examples;
