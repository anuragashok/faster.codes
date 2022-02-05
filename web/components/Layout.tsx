import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";

const Layout: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title} | &#123; faster.codes &#125;</title>
      </Head>
      <Header />
      <div className="container mx-auto h-full p-2">
        <h1 className="text-primary text-3xl">{title}</h1>
        {children}
      </div>
      <Footer />
    </>
  );
};
export default Layout;
