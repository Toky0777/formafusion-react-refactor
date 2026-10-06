
function Refresh() {
  return (
    <main className="flex-1 p-3 overflow-y-auto sm:p-6">
      <div className="flex h-screen bg-gray-50">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="flex">
              <div className="flex-1 h-[650px] mr-4">
                <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Editing: TITRERER
                    </h2>
                    <div className="flex items-center space-x-3">
                      <div className="flex mr-4 space-x-2">
                        <button className="flex items-center p-2 text-white bg-[#A462A4] rounded-md hover:bg-[#A462A4]/70">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-eye"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span className="ml-1 text-sm">Preview</span>
                        </button>
                        <button className="flex items-center px-4 py-2 transition-colors bg-gray-300 rounded-md hover:bg-gray-400/80">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1 lucide lucide-save"
                          >
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                          </svg>
                          <span>Update</span>
                        </button>
                        <div>
                          <button className="flex items-center p-2 text-red-600 transition-colors rounded-md hover:bg-red-200">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" x2="10" y1="11" y2="17"></line>
                              <line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                      <label
                        htmlFor="content-title"
                        className="block mb-1 text-sm font-medium text-gray-700"
                      >
                        Content Title
                      </label>
                      <input
                        id="content-title"
                        type="text"
                        placeholder="Enter a title for this content"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value="TITRERER"
                      />
                    </div>
                    <div className="border-b border-gray-200">
                      <div className="flex border-b border-gray-200">
                        <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-500">
                          Video Content
                        </button>
                        <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                          Text &amp; Images
                        </button>
                        <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                          {" "}
                          Files
                        </button>
                      </div>
                    </div>
                    <div className="p-6" id="tab-content">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="video-url"
                            className="block mb-1 text-sm font-medium text-gray-700"
                          >
                            Video URL
                          </label>
                          <input
                            id="video-url"
                            type="url"
                            placeholder="Enter video URL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value="https://youtu.be/PgJlaBxKYTI"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="video-description"
                            className="block mb-1 text-sm font-medium text-gray-700"
                          >
                            Video Description
                          </label>
                          <textarea
                            id="video-description"
                            rows="3"
                            placeholder="Enter a description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                          >
                            Voluptatibus est do
                          </textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-2 w-[500px] border-gray-200 bg-white">
                <div className="flex flex-col w-full h-full bg-white border-l border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold text-gray-900">
                        Bureautique perfectionnement
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3 lucide lucide-book-open"
                            aria-hidden="true"
                          >
                            <path d="M12 7v14"></path>
                            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                          </svg>
                          <span>3 programmes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3 lucide lucide-clock"
                            aria-hidden="true"
                          >
                            <path d="M12 6v6l4 2"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                          <span>2 contenus</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="border-b border-gray-200">
                      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50">
                        <div className="flex-4">
                          <h4 className="text-sm font-bold text-gray-900">
                            Excel
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className="px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded-full">
                            2
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 text-gray-500 transition-transform duration-200 rotate-180 lucide lucide-chevron-down"
                            aria-hidden="true"
                          >
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div>
                          <div className="px-6 py-3 transition-colors duration-200 bg-blue-100 border-b border-l-4 border-gray-200 cursor-pointer last:border-b-0 border-l-blue-500">
                            <div className="text-sm font-medium text-blue-900">
                              test
                            </div>
                            <div
                              className="mt-1 text-xs text-blue-700 line-clamp-2"
                              title="test10"
                            >
                              test10
                            </div>
                          </div>
                          <div className="px-6 py-3 transition-colors duration-200 border-b border-gray-200 cursor-pointer last:border-b-0 hover:bg-white">
                            <div className="text-sm font-medium text-gray-800">
                              test
                            </div>
                            <div
                              className="mt-1 text-xs text-gray-600 line-clamp-2"
                              title="test11"
                            >
                              test11
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200">
                      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50">
                        <div className="flex-4">
                          <h4 className="text-sm font-bold text-gray-900">
                            Word
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 text-gray-500 transition-transform duration-200 lucide lucide-chevron-down"
                            aria-hidden="true"
                          >
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200">
                      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50">
                        <div className="flex-4">
                          <h4 className="text-sm font-bold text-gray-900">
                            Powerpoint
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 text-gray-500 transition-transform duration-200 lucide lucide-chevron-down"
                            aria-hidden="true"
                          >
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Refresh;
