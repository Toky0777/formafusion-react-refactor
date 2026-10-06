import DrawerParent from "./drawer-parent";

export default function ListApprenantEval({
  onClose,
  isOpen,
  data,
  isLoading,
}) {
  console.log(data);

  return (
    <DrawerParent
      title="Liste des apprenants"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Chargement...</p>
          </div>
        </div>
      ) : data?.length === 0 ? (
        <div>Aucun donné</div>
      ) : (
        <div className="p-2 h-full overflow-y-auto">
          {data?.map((item) => (
            <div>
              <h1 className="font-semibold text-xl">{item.name}</h1>
              {item?.learners?.length === 0 ? (
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-gray-500">Aucun apprenant</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  {item?.learners?.map((learner) => (
                    <div
                      key={learner.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors duration-200 border border-slate-200 hover:border-indigo-300"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center bg-gray-400 justify-center text-white font-semibold">
                        {learner.first_name?.[0]}
                        {learner.name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {learner.first_name} {learner.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DrawerParent>
  );
}
