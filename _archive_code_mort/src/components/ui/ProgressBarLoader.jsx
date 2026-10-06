import { useState, useEffect } from "react";

const ProgressBarLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 300) {
          clearInterval(interval);
          return 300;
        }
        return prev + 1;
      });
    }, 10); // augmente toutes les 50ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="w-full h-1 overflow-hidden bg-gray-300 rounded-full shadow-md">
        <div
          className="bg-[#87388C] h-full transition-all duration-200 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBarLoader;
