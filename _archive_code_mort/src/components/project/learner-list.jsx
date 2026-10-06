import React from "react";

export const LearnerList = (learners) => {
  <div className="w-full max-w-6xl p-4 mx-auto">
    {/* Header Card */}
    <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
      {/* Header Section */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleAfficheApprenants}
            className="flex items-center gap-3 text-gray-700 transition-colors duration-200 hover:text-purple-600 group"
          >
            <div className="p-2 transition-shadow duration-200 bg-white rounded-lg shadow-sm group-hover:shadow-md">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {learners?.countAppr || 0} Apprenants
                </h2>
                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                  Actifs
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Gérez vos participants à la formation
              </p>
            </div>
            <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
              {AfficheApprenants ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          {/* Action Buttons */}
          <div className="relative" ref={apprRef}>
            <button
              onClick={() => setShowAprenant((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium">Éditer</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showAprenant && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-20 min-w-[200px]">
                <button
                  onClick={() => setShowPageApprenant(true)}
                  className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 rounded-lg hover:bg-purple-50 hover:text-purple-700"
                >
                  <UserPlus className="w-4 h-4" />
                  Ajouter des apprenants
                </button>
                <button
                  onClick={() => setShowEmargement(true)}
                  className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 rounded-lg hover:bg-purple-50 hover:text-purple-700"
                >
                  <UserCheck className="w-4 h-4" />
                  Émargement
                </button>
                <button className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-400 rounded-lg opacity-50 cursor-not-allowed">
                  <BarChart3 className="w-4 h-4" />
                  Évaluation
                </button>
                <button className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-400 rounded-lg opacity-50 cursor-not-allowed">
                  <Award className="w-4 h-4" />
                  Skill matrix
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {AfficheApprenants && (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              {selectedEtp}
            </h3>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
              <div className="p-4 border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-700">
                      {apprenants?.percentPresent}
                    </p>
                    <p className="text-sm text-gray-600">Présents</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-700">
                      {apprenants?.percentPartiel}
                    </p>
                    <p className="text-sm text-gray-600">Partiellement</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-700">
                      {apprenants?.percentAbsent}
                    </p>
                    <p className="text-sm text-gray-600">Absents</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div className="space-y-3">
              {apprenants?.apprs && apprenants?.apprs?.length > 0 ? (
                apprenants?.apprs.map((apprenant, index) => (
                  <div
                    key={index}
                    className="p-5 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-purple-200 group"
                  >
                    <div className="flex items-center justify-between">
                      {/* Participant Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="overflow-hidden rounded-full w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400">
                            {apprenant.emp_photo ? (
                              <img
                                src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${apprenant.emp_photo}`}
                                alt="photo"
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-lg font-bold text-white">
                                {apprenant.emp_initial_name}
                              </div>
                            )}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getPresenceColor(
                              apprenant.presence
                            )}`}
                          ></div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 capitalize">
                            {apprenant.emp_name} {apprenant.emp_firstname}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              {getPresenceIcon(apprenant.presence)}
                              <span className="text-sm text-gray-600">
                                Présence
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-gray-300 fill-current"
                                />
                              ))}
                              <span className="ml-1 text-sm text-gray-500">
                                Évaluation
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Skills: -- | --
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                        <button className="p-2 text-purple-600 transition-all duration-200 rounded-lg hover:bg-purple-50">
                          <Award className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            manageAppr("delete", id, apprenant.idEmploye)
                          }
                          className="p-2 text-red-500 transition-all duration-200 rounded-lg hover:bg-red-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Aucun apprenant trouvé
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Commencez par ajouter vos premiers apprenants
                  </p>
                  <button
                    onClick={() => setShowPageApprenant(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors duration-200 bg-purple-600 rounded-xl hover:bg-purple-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    Ajouter des apprenants
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Modal Ajouter Apprenants */}
    {showPageApprenant && (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowPageApprenant(false)}
        />
        <div className="absolute top-0 right-0 w-full h-full max-w-6xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Ajouter des apprenants
            </h2>
            <button
              onClick={() => setShowPageApprenant(false)}
              className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex h-[calc(100vh-80px)]">
            {/* Left Panel - All Employees */}
            <div className="w-1/2 border-r border-gray-200">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-red-400 rounded"></div>
                  <h3 className="text-lg font-medium text-gray-700">
                    Tous les employés
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      placeholder="Chercher un apprenant"
                      onChange={(e) => setSearchAppr(e.target.value)}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <select
                    value={selectedEtp}
                    onChange={(e) => setSelectedEtp(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une entreprise</option>
                    {tousAppr?.etps?.map((etp, index) => (
                      <option key={index} value={etp.id}>
                        {etp.etp_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="h-full p-4 space-y-3 overflow-y-auto">
                {!searchAppr == "" && filteredAppr?.length > 0 ? (
                  filteredAppr.map((apprenant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:border-purple-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                          <div className="flex items-center justify-center w-full h-full font-bold text-white">
                            {apprenant.emp_initial_name}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 uppercase">
                            {apprenant.emp_name}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            {apprenant.emp_firstname}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          manageAppr("post", id, apprenant.idEmploye)
                        }
                        className="p-2 transition-colors duration-200 bg-green-100 rounded-full hover:bg-green-200"
                      >
                        <Plus className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className=""></div>
                )}

                {filteredApprs.map((apprenant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:border-purple-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                        <div className="flex items-center justify-center w-full h-full font-bold text-white">
                          {apprenant.emp_initial_name}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 uppercase">
                          {apprenant.emp_name}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {apprenant.emp_firstname}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        manageAppr("post", id, apprenant.idEmploye)
                      }
                      className="p-2 transition-colors duration-200 bg-green-100 rounded-full hover:bg-green-200"
                    >
                      <Plus className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Selected Employees */}
            <div className="w-1/2">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-400 rounded"></div>
                  <h3 className="text-lg font-medium text-gray-700">
                    {apprenants.apprs?.length || 0} employés sélectionnés
                  </h3>
                </div>
              </div>

              <div className="h-full p-4 space-y-3 overflow-y-auto">
                {apprenants?.apprs && apprenants?.apprs.length > 0 ? (
                  apprenants?.apprs.map((apprenant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                          <div className="flex items-center justify-center w-full h-full font-bold text-white">
                            {apprenant.emp_initial_name}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 uppercase">
                            {apprenant.emp_name}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            {apprenant.emp_firstname}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          manageAppr("delete", id, apprenant.idEmploye)
                        }
                        className="p-2 transition-colors duration-200 bg-red-100 rounded-full hover:bg-red-200"
                      >
                        <Minus className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun apprenant sélectionné</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowPageApprenant(false)}
              className="px-4 py-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={() => setShowPageApprenant(false)}
              className="px-4 py-2 text-white transition-colors duration-200 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Émargement */}
    {showEmargement && (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowEmargement(false)}
        />
        <div className="absolute top-0 right-0 w-full h-full bg-white shadow-2xl max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Fiche de présence
              </h2>
            </div>
            <button
              onClick={() => setShowEmargement(false)}
              className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between p-6 border-b bg-gray-50">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Présent</span>
                <span className="font-bold text-green-600">
                  {apprenants.percentPresent}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600">Partiellement</span>
                <span className="font-bold text-yellow-600">
                  {apprenants.percentPartiel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-600">Absent</span>
                <span className="font-bold text-red-600">
                  {apprenants.percentAbsent}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-sm text-gray-600">Non défini</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Présent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Partiellement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 h-[calc(100vh-200px)] overflow-auto">
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
              {/* Table Header */}
              <div className="grid grid-cols-6 border-b bg-gray-50">
                <div className="p-4 font-medium text-gray-700">Apprenant</div>
                {apprenants?.getSeance?.map((seance, i) => (
                  <div
                    key={i}
                    className="p-4 text-center border-l border-gray-200"
                  >
                    <div className="mb-1 font-medium text-gray-700">
                      {seance.dateSeance}
                    </div>
                    <div className="text-sm text-gray-500">
                      {seance.heureDebut} - {seance.heureFin}
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              {apprenants?.apprs?.map((apprenant, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                      <div className="flex items-center justify-center w-full h-full text-sm font-bold text-white">
                        {apprenant.emp_initial_name}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {apprenant.emp_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {apprenant.emp_firstname}
                      </p>
                    </div>
                  </div>

                  {apprenants?.getSeance?.map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-center p-4 border-l border-gray-100"
                    >
                      <button className="w-6 h-6 transition-colors duration-200 bg-gray-300 rounded hover:bg-gray-400"></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>;
};
