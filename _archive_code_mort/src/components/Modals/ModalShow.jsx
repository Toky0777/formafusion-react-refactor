export function ModalShow({isVisible,onClose,children}){
    const handleClose = (e) =>{
        if(e.target.id === 'wrapper') onClose();
    }
    if(!isVisible ) return null;
    return (
        <>
        <div id="wrapper" onClick={handleClose} className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm transition-opacity duration-900">
            <div className="fixed top-0 right-0 w-[40em] h-full bg-white shadow-lg p-4 overflow-y-auto z-50  ">       
                {children}
            </div>
        </div>
        </>
    );
}