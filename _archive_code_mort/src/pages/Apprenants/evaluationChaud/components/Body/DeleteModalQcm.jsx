export function DeleteModalQcm({ onClose, onConfirm }) {
    return (
        <div id="delete-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p">
            <div className="max-w-sm p-6 bg-white rounded-lg du_modal-box">
                <h3 className="text-lg font-bold">Suppression du QCM!</h3>
                <p className="py-4">Voulez-vous vraiment supprimer ce QCM ?</p>
                <div className="flex justify-end du_modal-action">
                    <div method="dialog">
                        <button onClick={onClose} className="btn px-3 py-2 bg-[#7c7c7c1c] hover:bg-[#7c7c7cc7]">Non, annuler</button>
                        <button onClick={onConfirm} className="ml-3 btn btn-primary bg-[#6f0b87a1] text-blue-100 hover:text-white px-3 py-2 hover:bg-[#4d045fbd]">Oui, je confirme</button>
                    </div>
                </div>
            </div>
        </div>
    );
  }