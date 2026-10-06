export function MessageModal({message,type}){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-lg animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <svg
                className={`w-8 h-8 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            </div>
            <h2 className={`text-2xl font-semibold ${type === 'success' ? 'text-green-600' : 'text-red-600'}  mb-2`}>{message}</h2>
            
        </div>
        </div>
    )
}