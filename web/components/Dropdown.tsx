import { useState } from "react";

type Props = { lang: string; onChange: (lang: string) => void };

const DropDown: React.FC<Props> = ({ lang, onChange }) => {
  const [open, setOpen] = useState(false);

  const languages = ["java", "go"];

  return (
    <>
      <div className="dropdown lang-dropdown">
        <div
          tabIndex={0}
          className="btn btn-sm btn-primary "
          onClick={() => setOpen(!open)}
        >
          <div className="w-32 font-large capitalize">
            {lang ? lang : "select platform"}
          </div>
          {open && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {!open && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        {open && (
          <ul
            tabIndex={0}
            className="shadow menu compact dropdown-content bg-base-100 rounded-box w-52"
          >
            {languages.map((value, index) => {
              return (
                <li key={index} onClick={() => setOpen(!open)}>
                  <a
                    onClick={() => onChange(value)}
                    className="p-0.5 capitalize"
                  >
                    {value}
                  </a>
                </li>
              );
            })}
            <li>
              <a className="p-0.5 opacity-60">
                Support for more runtimes coming soon
              </a>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default DropDown;
