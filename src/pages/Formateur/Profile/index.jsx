import Drawer from "../../../components/Common/Drawer";
import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { IMAGE_URL } from "../../../config/env";

export default function Profile() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        firstName: '',
        specialite: '',
        fonction: '',
        email: '',
        phone: ''
    });
    // Drawer Expériences
    const [showExpDrawer, setShowExpDrawer] = useState(false);
    const [expForm, setExpForm] = useState({
        Fonction: '',
        Lieu_de_stage: '',
        Lieu: '',
        Date_debut: '',
        Date_fin: ''
    });
    // Drawer Formations
    const [showFormDrawer, setShowFormDrawer] = useState(false);
    const [formForm, setFormForm] = useState({
        Ecole: '',
        Diplome: '',
        Domaine: '',
        Date_debut: '',
        Date_fin: ''
    });
    // Drawer Compétence
    const [showSkillDrawer, setShowSkillDrawer] = useState(false);
    const [skillForm, setSkillForm] = useState({
        Competence: '',
        note: 3 // par défaut une note moyenne si tu veux gérer la note
    });
    // Drawer Langue
    const [showLangDrawer, setShowLangDrawer] = useState(false);
    const [langForm, setLangForm] = useState({
        Langue: '',
        note: 1 // note = niveau numérique
    });

    useEffect(() => {
        axios
            .get("/formateur/miniCv")
            .then((res) => setData(res.data))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    // Remplir le formulaire d'édition avec les données du profil
    useEffect(() => {
        if (data && data.form) {
            setEditForm({
                name: data.form.name || '',
                firstName: data.form.firstName || '',
                specialite: data.form.form_speciality || '',
                fonction: data.form.form_titre || '',
                email: data.form.email || '',
                phone: data.form.phone || ''
            });
        }
    }, [data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                    <p className="text-gray-500">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="font-medium text-red-500">Erreur lors du chargement des données.</p>
            </div>
        );
    }

    const { form, exp, dp, cpc, lg } = data;

    return (
        <div className="flex items-center justify-center w-full bg-gray-50">
            <div className="flex flex-col w-full max-w-5xl gap-6">
                {/* Drawer de modification de profil */}
                <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title="Modifier votre profil">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const id = data?.form?.idFormateur;
                                if (!id) throw new Error("ID formateur manquant");
                                await axios.put(`/formateur/profile/update/${id}`, editForm);
                                // recharger les données après modif
                                const res = await axios.get("/formateur/miniCv");
                                setData(res.data);
                                setShowDrawer(false);
                            } catch (err) {
                                alert("Erreur lors de la modification du profil");
                            }
                        }}
                        className="w-full max-w-2xl p-6 mx-auto space-y-6 bg-white shadow-md rounded-xl"
                    >
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                Nom
                            </label>
                            <input id="name" name="name" type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                                Prénom
                            </label>
                            <input id="firstName" name="firstName" type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                value={editForm.firstName} onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                            />
                        </div>

                        <div>
                            <h2 className="mb-2 font-bold text-purple-600 text-md">Information professionnelle</h2>

                            <div className="space-y-2">
                                <label htmlFor="specialite" className="block text-sm font-semibold text-gray-700">
                                    Spécialité
                                </label>
                                <input id="specialite" name="specialite" type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    value={editForm.specialite} onChange={(e) => setEditForm((f) => ({ ...f, specialite: e.target.value }))}
                                />
                            </div>

                            <div className="mt-4 space-y-2">
                                <label htmlFor="fonction" className="block text-sm font-semibold text-gray-700">
                                    Fonction actuelle
                                </label>
                                <input id="fonction" name="fonction" type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    value={editForm.fonction} onChange={(e) => setEditForm((f) => ({ ...f, fonction: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-2 font-bold text-purple-600 text-md">Contact</h2>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email
                                </label>
                                <input id="email" name="email" type="email" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                                />
                            </div>

                            <div className="mt-4 space-y-2">
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                                    Téléphone
                                </label>
                                <input id="phone" name="phone" type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="inline-block px-6 py-2 text-sm font-medium text-white transition-all duration-200 bg-purple-600 rounded-md shadow-sm hover:bg-purple-500"
                            >
                                Sauvegarder
                            </button>
                        </div>
                    </form>

                </Drawer>
                {/* Drawer d'ajout d'expérience */}
                <Drawer open={showExpDrawer} onClose={() => setShowExpDrawer(false)} title="Ajouter une expérience">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                // Optionally, you can add a loading state here
                                await axios.post("/formateur/miniCv", {
                                    type: "exp",
                                    ...expForm
                                });
                                // Recharger les données après ajout
                                const res = await axios.get("/formateur/miniCv");
                                setData(res.data);
                                setShowExpDrawer(false);
                                // Reset form
                                setExpForm({
                                    Fonction: '',
                                    Lieu_de_stage: '',
                                    Lieu: '',
                                    Date_debut: '',
                                    Date_fin: ''
                                });
                            } catch (err) {
                                alert("Erreur lors de l'ajout d'expérience");
                            }
                        }}
                        className="w-full max-w-2xl p-6 mx-auto space-y-6 bg-white shadow-md rounded-xl"
                    >
                        <div className="flex flex-row gap-4">
                            <input type="hidden" name="type" value="exp"></input>
                            <div className="flex flex-col w-full gap-3">
                                <label htmlFor="Fonction" className="block text-sm font-semibold text-gray-700">Intitulé du poste</label>
                                <input id="Fonction" name="Fonction" type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={expForm.Fonction} onChange={e => setExpForm(f => ({ ...f, Fonction: e.target.value }))} />
                            </div>
                            <div className="flex flex-col w-full gap-3">
                                <label htmlFor="Lieu_de_stage" className="block text-sm font-semibold text-gray-700">Nom de l'entreprise</label>
                                <input id="Lieu_de_stage" name="Lieu_de_stage" type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={expForm.Lieu_de_stage} onChange={e => setExpForm(f => ({ ...f, Lieu_de_stage: e.target.value }))} />
                            </div>
                            <div className="flex flex-col w-full gap-3">
                                <label htmlFor="Lieu" className="block text-sm font-semibold text-gray-700">Lieu</label>
                                <input id="Lieu" name="Lieu" type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={expForm.Lieu} onChange={e => setExpForm(f => ({ ...f, Lieu: e.target.value }))} />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col w-full gap-3">
                                <label htmlFor="Date_debut" className="block text-sm font-semibold text-gray-700">Date début</label>
                                <input id="Date_debut" name="Date_debut" type="date" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={expForm.Date_debut} onChange={e => setExpForm(f => ({ ...f, Date_debut: e.target.value }))} />
                            </div>
                            <div className="flex flex-col w-full gap-3">
                                <label htmlFor="Date_fin" className="block text-sm font-semibold text-gray-700">Date fin</label>
                                <input id="Date_fin" name="Date_fin" type="date" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" value={expForm.Date_fin} onChange={e => setExpForm(f => ({ ...f, Date_fin: e.target.value }))} />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="focus:outline-none px-6 bg-[#a462a4] py-2 ml-3 rounded-lg text-white hover:scale-105 hover:bg-[#a462a4]/80 transition duration-200 text-md">Confirmer</button>
                        </div>
                    </form>
                </Drawer>

                {/* Drawer d’ajout de formation */}
                <Drawer open={showFormDrawer} onClose={() => setShowFormDrawer(false)} title="Ajouter une formation">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await axios.post("/formateur/miniCv", {
                                    type: "dp",
                                    ...formForm
                                });
                                // Recharger les données après ajout
                                const res = await axios.get("/formateur/miniCv");
                                setData(res.data);
                                setShowFormDrawer(false);
                                // Reset form
                                setFormForm({
                                    Ecole: '',
                                    Diplome: '',
                                    Domaine: '',
                                    Date_debut: '',
                                    Date_fin: ''
                                });
                            } catch (err) {
                                alert("Erreur lors de l'ajout de formation");
                            }
                        }}
                        className="w-full max-w-2xl p-6 mx-auto space-y-6 bg-white shadow-md rounded-xl"
                    >
                        <input type="hidden" name="type" value="dp"></input>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-4">
                                <div className="flex flex-col w-full gap-3">
                                    <label htmlFor="Ecole" className="block text-sm font-semibold text-gray-700">École</label>
                                    <input
                                        id="Ecole" name="Ecole" type="text"
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formForm.Ecole}
                                        onChange={e => setFormForm(f => ({ ...f, Ecole: e.target.value }))}
                                    />
                                </div>

                                <div className="flex flex-col w-full gap-3">
                                    <label htmlFor="Diplome" className="block text-sm font-semibold text-gray-700">Diplôme</label>
                                    <input
                                        id="Diplome" name="Diplome" type="text"
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formForm.Diplome}
                                        onChange={e => setFormForm(f => ({ ...f, Diplome: e.target.value }))}
                                    />
                                </div>

                                <div className="flex flex-col w-full gap-3">
                                    <label htmlFor="Domaine" className="block text-sm font-semibold text-gray-700">Domaine d’études</label>
                                    <input
                                        id="Domaine" name="Domaine" type="text"
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formForm.Domaine}
                                        onChange={e => setFormForm(f => ({ ...f, Domaine: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row gap-4">
                                <div className="flex flex-col w-full gap-3">
                                    <label htmlFor="Date_debut" className="block text-sm font-semibold text-gray-700">Date début</label>
                                    <input
                                        id="Date_debut" name="Date_debut" type="date"
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formForm.Date_debut}
                                        onChange={e => setFormForm(f => ({ ...f, Date_debut: e.target.value }))}
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-3">
                                    <label htmlFor="Date_fin" className="block text-sm font-semibold text-gray-700">Date fin</label>
                                    <input
                                        id="Date_fin" name="Date_fin" type="date"
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formForm.Date_fin}
                                        onChange={e => setFormForm(f => ({ ...f, Date_fin: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" className="focus:outline-none px-6 bg-[#a462a4] py-2 ml-3 rounded-lg text-white hover:scale-105 hover:bg-[#a462a4]/80 transition duration-200 text-md">
                                Confirmer
                            </button>
                        </div>
                    </form>
                </Drawer>
                {/* Drawer d’ajout de compétence */}
                <Drawer open={showSkillDrawer} onClose={() => setShowSkillDrawer(false)} title="Ajouter une compétence">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await axios.post("/formateur/miniCv", {
                                    type: "cpc",
                                    ...skillForm
                                });
                                // Recharger les données après ajout
                                const res = await axios.get("/formateur/miniCv");
                                setData(res.data);
                                setShowSkillDrawer(false);
                                // Reset form
                                setSkillForm({
                                    Competence: '',
                                    note: 3
                                });
                            } catch (err) {
                                alert("Erreur lors de l'ajout de compétence");
                            }
                        }}
                        className="w-full max-w-md p-6 mx-auto space-y-6 bg-white shadow-md rounded-xl"
                    >
                        <input type="hidden" name="type" value="cpc"></input>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="Competence" className="block text-sm font-semibold text-gray-700">Insérer vos compétences</label>
                            <input
                                id="Competence" name="Competence" type="text"
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                value={skillForm.Competence}
                                onChange={e => setSkillForm(f => ({ ...f, Competence: e.target.value }))}
                            />
                        </div>

                        {/* Optionnel : note */}
                        <div className="flex flex-col gap-3">
                            <label htmlFor="note" className="block text-sm font-semibold text-gray-700">Note (1 à 5)</label>
                            <select
                                id="note" name="note"
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                value={skillForm.note}
                                onChange={e => setSkillForm(f => ({ ...f, note: Number(e.target.value) }))}>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="focus:outline-none px-6 bg-[#a462a4] py-2 ml-3 rounded-lg text-white hover:scale-105 hover:bg-[#a462a4]/80 transition duration-200 text-md">
                                Confirmer
                            </button>
                        </div>
                    </form>
                </Drawer>
                {/* Drawer d’ajout de langue */}
                <Drawer open={showLangDrawer} onClose={() => setShowLangDrawer(false)} title="Ajouter une langue">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await axios.post("/formateur/miniCv", {
                                    type: "lg",
                                    Langue: langForm.Langue,
                                    note: langForm.note
                                });
                                // Recharger les données après ajout
                                const res = await axios.get("/formateur/miniCv");
                                setData(res.data);
                                setShowLangDrawer(false);
                                // Reset form
                                setLangForm({
                                    Langue: '',
                                    note: 1
                                });
                            } catch (err) {
                                alert("Erreur lors de l'ajout de langue");
                            }
                        }}
                        className="w-full max-w-md p-6 mx-auto space-y-6 bg-white shadow-md rounded-xl"
                    >
                        <input type="hidden" name="type" value="lg"></input>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="Langue" className="block text-sm font-semibold text-gray-700">Insérer vos langues</label>
                            <input
                                id="Langue" name="Langue" type="text"
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                value={langForm.Langue}
                                onChange={e => setLangForm(f => ({ ...f, Langue: e.target.value }))}
                            />
                        </div>

                        {/* Optionnel : niveau */}
                        <div className="flex flex-col gap-3">
                            <label htmlFor="note" className="block text-sm font-semibold text-gray-700">Niveau</label>
                            <select
                                id="note" name="note"
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                value={langForm.note}
                                onChange={e => setLangForm(f => ({ ...f, note: Number(e.target.value) }))}>
                                <option value={1}>Débutant</option>
                                <option value={2}>Intermédiaire</option>
                                <option value={3}>Avancé</option>
                                <option value={4}>Courant</option>
                                <option value={5}>Bilingue</option>
                            </select>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="focus:outline-none px-6 bg-[#a462a4] py-2 ml-3 rounded-lg text-white hover:scale-105 hover:bg-[#a462a4]/80 transition duration-200 text-md">
                                Confirmer
                            </button>
                        </div>
                    </form>
                </Drawer>


                {/* Flash Messages */}
                {data.success && (
                    <p className="p-3 text-green-700 bg-green-100 border border-green-200 rounded-lg shadow-sm">
                        {data.success}
                    </p>
                )}
                {data.error && (
                    <p className="p-3 text-red-700 bg-red-100 border border-red-200 rounded-lg shadow-sm">
                        {data.error}
                    </p>
                )}

                {/* Profile Header */}
                <div className="flex items-center w-full max-w-4xl p-6 mx-auto">
                    {/* Photo à gauche */}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="p-1 rounded-full shadow-xl bg-gradient-to-tr from-purple-900 via-purple-700 to-fuchsia-600">
                            {form?.photo ? (
                                <img
                                    src={`${IMAGE_URL}/img/formateurs/${form.photo}`}
                                    alt="profile"
                                    className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-lg md:w-40 md:h-40"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-32 h-32 text-4xl text-purple-600 bg-white rounded-full shadow-lg md:w-40 md:h-40">
                                    <i className="fa-solid fa-user-graduate"></i>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Carte avec demi-cercle intérieur */}
                    <div className="relative flex-1 -ml-12 group">
                        <div
                            className="relative p-6 pl-20 border-[1px] border-gray-100 bg-gradient-to-r from-gray-50 via-white to-white rounded-2xl"
                            style={{
                                clipPath: "path('M 0 0 H 100% V 100% H 0 Q 0 50% 0 0 Z')",
                            }}
                        >
                            <div className="flex items-center justify-between w-full mb-2">
                                <h1 className="text-3xl font-extrabold text-gray-800">
                                    {form?.name} {form?.firstName}
                                </h1>
                                <button
                                    title="Edit"
                                    className="px-1 text-white transition-opacity duration-300 bg-purple-700 rounded-md opacity-0 group-hover:opacity-100"
                                    onClick={() => setShowDrawer(true)}
                                >
                                    <i className="text-xs fa-solid fa-pencil"></i>
                                </button>
                            </div>

                            <p className="mb-1 text-lg text-gray-600">
                                <i className="mr-2 text-purple-500 fa-solid fa-briefcase"></i>
                                {form?.form_speciality || "Spécialité inconnue"}
                            </p>
                            <p className="mb-4 text-lg text-gray-600">
                                <i className="mr-2 text-purple-500 fa-solid fa-building"></i>
                                {form?.form_titre || "Fonction actuelle inconnue"}
                            </p>

                            <div className="grid grid-cols-1 gap-4 text-sm text-gray-500 md:grid-cols-2">
                                <p><i className="mr-2 fa-solid fa-envelope text-fuchsia-500"></i>{form?.email}</p>
                                <p><i className="mr-2 fa-solid fa-phone text-fuchsia-500"></i>{form?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Expériences */}
                    <SectionCard title="Expériences" onAdd={() => setShowExpDrawer(true)}>
                        {exp?.length > 0 ? (
                            exp.map((ex, i) => (
                                <div key={i} className="flex items-center justify-between group/item">
                                    <Item
                                        title={`${ex.Date_debut} - ${ex.Date_fin}`}
                                        subtitle={ex.Fonction}
                                        description={`${ex.Lieu_de_stage} - ${ex.Lieu}`}
                                    />
                                    <button
                                        title="Supprimer"
                                        className="flex items-center outline-none w-[32px] h-[32px] hover:bg-red-100 transition duration-200 rounded-xl"
                                        onClick={async () => {
                                            if (window.confirm('Supprimer cette expérience ?')) {
                                                try {
                                                    await axios.delete(`/formateur/miniCv/${ex.id}/destroy`, { data: { type: 'exp' } });
                                                    const res = await axios.get('/formateur/miniCv');
                                                    setData(res.data);
                                                } catch (err) {
                                                    alert("Erreur lors de la suppression");
                                                }
                                            }
                                        }}
                                    >
                                        <i className="p-2 text-red-300 fa-solid fa-trash-can hover:text-red-500 text-md"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <EmptyState text="Aucune expérience" />
                        )}
                    </SectionCard>

                    {/* Formations */}
                    <SectionCard title="Formations" onAdd={() => setShowFormDrawer(true)}>
                        {dp?.length > 0 ? (
                            dp.map((d, i) => (
                                <div key={i} className="flex items-center justify-between group/item">
                                    <Item
                                        title={`${d.Date_debut} - ${d.Date_fin}`}
                                        subtitle={d.Ecole}
                                        description={`${d.Diplome} - ${d.Domaine}`}
                                    />
                                    <button
                                        title="Supprimer"
                                        className="flex items-center outline-none w-[32px] h-[32px] hover:bg-red-100 transition duration-200 rounded-xl"
                                        onClick={async () => {
                                            if (window.confirm('Supprimer cette formation ?')) {
                                                try {
                                                    await axios.delete(`/formateur/miniCv/${d.id}/destroy`, { data: { type: 'dp' } });
                                                    const res = await axios.get('/formateur/miniCv');
                                                    setData(res.data);
                                                } catch (err) {
                                                    alert("Erreur lors de la suppression");
                                                }
                                            }
                                        }}
                                    >
                                        <i className="p-2 text-red-300 fa-solid fa-trash-can hover:text-red-500 text-md"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <EmptyState text="Aucune formation" />
                        )}
                    </SectionCard>

                    {/* Compétences */}
                    <SectionCard title="Compétences" onAdd={() => setShowSkillDrawer(true)}>
                        {cpc?.length > 0 ? (
                            cpc.map((c, i) => (
                                <div key={i} className="flex items-center justify-between group/item">
                                    <SkillItem skill={c.Competence} note={c.note} />
                                    <button
                                        title="Supprimer"
                                        className="flex items-center outline-none w-[32px] h-[32px] hover:bg-red-100 transition duration-200 rounded-xl"
                                        onClick={async () => {
                                            if (window.confirm('Supprimer cette compétence ?')) {
                                                try {
                                                    await axios.delete(`/formateur/miniCv/${c.id}/destroy`, { data: { type: 'cpc' } });
                                                    const res = await axios.get('/formateur/miniCv');
                                                    setData(res.data);
                                                } catch (err) {
                                                    alert("Erreur lors de la suppression");
                                                }
                                            }
                                        }}
                                    >
                                        <i className="p-2 text-red-300 fa-solid fa-trash-can hover:text-red-500 text-md"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <EmptyState text="Aucune compétence" />
                        )}
                    </SectionCard>

                    {/* Langues */}
                    <SectionCard title="Langues" onAdd={() => setShowLangDrawer(true)}>
                        {lg?.length > 0 ? (
                            lg.map((l, i) => (
                                <div key={i} className="flex items-center justify-between group/item">
                                    <SkillItem skill={l.Langue} note={l.note} />
                                    <button
                                        title="Supprimer"
                                        className="flex items-center outline-none w-[32px] h-[32px] hover:bg-red-100 transition duration-200 rounded-xl"
                                        onClick={async () => {
                                            if (window.confirm('Supprimer cette langue ?')) {
                                                try {
                                                    await axios.delete(`/formateur/miniCv/${l.id}/destroy`, { data: { type: 'lg' } });
                                                    const res = await axios.get('/formateur/miniCv');
                                                    setData(res.data);
                                                } catch (err) {
                                                    alert("Erreur lors de la suppression");
                                                }
                                            }
                                        }}
                                    >
                                        <i className="p-2 text-red-300 fa-solid fa-trash-can hover:text-red-500 text-md"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <EmptyState text="Aucune langue" />
                        )}
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}

/* Components réutilisables */

const SectionCard = ({ title, children, onAdd }) => (
    <div className="flex flex-col gap-4 p-6 transition bg-white shadow-md group rounded-2xl hover:shadow-lg">
        <div className="flex items-center justify-between w-full">
            <p className="text-xl font-bold text-purple-700">{title}</p>
            {onAdd && (
                <button title="Ajouter" onClick={onAdd} className="px-1 text-white transition-opacity duration-300 bg-purple-700 rounded-md opacity-0 group-hover:opacity-100">
                    <i className="text-xs fa-solid fa-plus"></i>
                </button>
            )}
        </div>
        <hr className="border-b-2 border-purple-100" />
        <div className="space-y-4">{children}</div>
    </div>
);

const Item = ({ title, subtitle, description }) => (
    <div className="pl-4 border-l-4 border-purple-300">
        <p className="text-sm font-semibold text-purple-600">{title}</p>
        <p className="font-medium text-gray-800">{subtitle}</p>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

const SkillItem = ({ skill, note }) => (
    <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700">{skill}</span>
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <i
                    key={n}
                    className={`fa-solid fa-star ${n <= note ? "text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    </div>
);

const EmptyState = ({ text }) => (
    <p className="italic text-gray-400">{text}</p>
);