#controller et service photo
#AuthContext (ampina idUser)
#modification VerifyCsrfToken ( 'api/employes/images/*',)

--PARTIE TESTING CENTER--
#SearchController
#Route::get('/search', SearchController::class);
 Route::get('qcm/index', [QcmController::class, 'index_qcm'])->name('index.qcm'); # Index des QCM
 Route::middleware(['auth:sanctum', 'isEmpOrParticulier'])->group(function () {
    Route::get('/credits-wallet/{id}', [CreditsWalletController::class, 'show_user_credit_wallet'])->name('user.credits.wallet'); # Route pour avoir les crédits d'un utilisateur
});
 Route::get('/qcm/invitations-index', [QcmInvitationController::class, 'index_invitation'])->name('qcm.invitations.index');

#models
    public function idEtp()
    {
        $customer = DB::select("SELECT employes.idEmploye, employes.idCustomer, customers.idTypeCustomer FROM employes INNER JOIN customers ON employes.idCustomer = customers.idCustomer WHERE idEmploye = ?", [Auth::user()->id]);
        return $customer[0]->idCustomer;
    }

