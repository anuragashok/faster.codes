import { useState } from "react";

type Props = { open: boolean; onClose: () => void; messages: string[] };

const ErrorModal: React.FC<Props> = ({ open, onClose, messages }) => {
  return (
    <>
      <div className={`modal ${open ? "modal-open" : ""}`}>
        <div className="modal-box ">
          <div className="alert alert-error">
            <div className="flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 mx-2 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                ></path>
              </svg>
              <label>We could not proceed because of the below errors</label>
            </div>
          </div>

          <ul className="text-error mt-5 list-inside list-disc">
            {messages.map((value, index) => {
              return <li key={index}>{value}</li>;
            })}
          </ul>
          <div className="modal-action">
            <label htmlFor="my-modal-2" className="btn" onClick={onClose}>
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorModal;
