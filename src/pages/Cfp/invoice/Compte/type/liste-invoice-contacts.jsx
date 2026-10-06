import { useState } from "react";
import axios from "../../../../../config/axios";
import { Pen, Trash2 } from "lucide-react";
export function ListeInvoiceContacts({ contacts = [], reload, setReload }) {
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});
    const [message, setMessage] = useState("");

    const handleEdit = (contact) => {
        setEditId(contact.idContact);
        setEditData({
            contact_name: contact.contact_name,
            contact_mail: contact.contact_mail,
            contact_phone: contact.contact_phone,
            idEtp: contact.idEtp,
        });
        setMessage("");
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/invoice-contacts/${editId}`, editData);
            setMessage(res.data.message);
            setEditId(null);
            setReload((u) => u + 1);
        } catch (err) {
            setMessage("Erreur lors de la modification");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce contact ?")) return;
        try {
            const res = await axios.delete(`/invoice-contacts/${id}`);
            setMessage(res.data.message);
            setReload((u) => u + 1);
        } catch (err) {
            setMessage("Erreur lors de la suppression");
        }
    };

    return (
        <section className="flex flex-col m-4">
            <div className="w-full border-[1px] border-gray-100 bg-white rounded-xl">
                <div className="flex items-center justify-between p-2">
                    <h3 className="text-lg font-medium text-gray-600">
                        Liste des personnes à contacter pour la facturation
                    </h3>
                </div>
                <hr className="my-2 border border-gray-300" />
                {message && <div className="mb-2 text-green-600">{message}</div>}
                <table className="w-full">
                    <thead>
                        <tr className="duration-150 border-b border-gray-100 cursor-pointer hover:bg-gray-50">
                            <th className="p-2 text-xs font-semibold text-left text-gray-500">Nom</th>
                            <th className="p-2 text-xs font-semibold text-left text-gray-500">Email</th>
                            <th className="p-2 text-xs font-semibold text-left text-gray-500">Téléphone</th>
                            <th className="p-2 text-xs font-semibold text-left text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-2 text-center text-gray-500">
                                    Aucun contact trouvé
                                </td>
                            </tr>
                        ) : (
                            contacts.map((contact) =>
                                editId === contact.idContact ? (
                                    <tr key={contact.idContact} className="duration-150 border-b border-gray-100 cursor-pointer hover:bg-gray-50">
                                        <td className="p-2 text-xs text-gray-500">
                                            <input
                                                name="contact_name"
                                                value={editData.contact_name || ""}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded"
                                                required
                                            />
                                        </td>
                                        <td className="p-2 text-xs text-gray-500">
                                            <input
                                                name="contact_mail"
                                                value={editData.contact_mail || ""}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded"
                                                type="email"
                                            />
                                        </td>
                                        <td className="p-2 text-xs text-gray-500">
                                            <input
                                                name="contact_phone"
                                                value={editData.contact_phone || ""}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </td>
                                        <td className="flex gap-2 p-2">
                                            <button
                                                onClick={handleEditSubmit}
                                                className="px-3 py-1 text-xs text-gray-600 transition bg-purple-100 border rounded hover:bg-purple-200"
                                            >
                                                Enregistrer
                                            </button>
                                            <button
                                                onClick={() => setEditId(null)}
                                                className="px-3 py-1 text-xs text-gray-600 transition bg-gray-100 border rounded hover:bg-gray-200"
                                            >
                                                Annuler
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={contact.idContact}>
                                        <td className="p-2 text-xs text-gray-500">{contact.contact_name}</td>
                                        <td className="p-2 text-xs text-gray-500">{contact.contact_mail}</td>
                                        <td className="p-2 text-xs text-gray-500">{contact.contact_phone}</td>
                                        <td className="flex gap-2 p-2">
                                            <button
                                                onClick={() => handleEdit(contact)}
                                                className="px-3 py-1 text-xs text-gray-600 transition bg-gray-100 border rounded hover:bg-gray-200"
                                            >
                                                <Pen className="w-4 h-4 text-gray-600 hover:text-green-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.idContact)}
                                                className="px-3 py-1 text-xs text-gray-600 transition bg-gray-100 border rounded hover:bg-gray-200"
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-600 hover:text-green-600" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
