const Loader: React.FC = () => {
  return (
    <div className="flex flex-row w-full text-center mt-2">
      <div className="flex-grow">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-2 mt-2  m-auto"></div>
        <div>executing code and generating statistics</div>
        <div>
          tired of waiting? bookmark the page and come back later..
          the results
        </div>
      </div>
    </div>
  );
};

export default Loader;
