import { ReactNode } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MacContextType, CastContext } from "./AppContext";
import { MinaValue } from "./highlights";

import Navbar from "./navbar";
import Head from "next/head";

const ConnectedAddress = () => {
  const context: MacContextType = CastContext();
  if (context.connectedAddress) {
    return (
      <div className="flex flex-row-reverse text-sm font-normal">
        <MinaValue>{context.connectedAddress}</MinaValue>
      </div>
    );
  }
  return <div></div>;
};

const Layout = ({ children }: { children: ReactNode }) => {
  const context: MacContextType = CastContext();
  return (
    <div>
      <Head>
        <title>MAC!</title>
      </Head>
      <ToastContainer />
      <section className="flex flex-row-reverse">
        <Navbar />
      </section>
      <section className="container mb-44 xl:mb-16 lg:mb-16 md:mb-44 sm:mb-44">
        {children}
      </section>
      <section className="fixed inset-x-0 bottom-0">
        <footer className="footer items-center p-4 bg-neutral text-neutral-content z-50">
          <div className="items-center grid-flow-col">
            <a href="https://sqrtxx.com/" target="_blank" rel="noreferrer">
              <img
                style={{ height: 36 }}
                alt="a logo of sqrtxx.com"
                src="/logo.svg"
              />
            </a>
            <p>
              Copyright © 2024 - All right reserved by{" "}
              <a href="https://sqrtxx.com/" target="_blank" rel="noreferrer">
                sqrtxx.com
              </a>{" "}
              <a
                href="https://mareknarozniak.com/"
                target="_blank"
                rel="noreferrer"
              >
                Marek Narozniak
              </a>
            </p>
          </div>
          <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <a
              href="https://twitter.com/MarekNarozniak/status/1710581027020636472"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a
              href="https://youtu.be/5940Ja8CbC0"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/marekstreams/posts/pfbid02AVGwF3mPsS8v2Swv6EkqjYXJBEu5jBxjMjJw63uG9S8NktrKAM2tUJvy52Vn8iCEl"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Layout;
