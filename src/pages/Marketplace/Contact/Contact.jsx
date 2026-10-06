import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";

const Contact = ({ customerId }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return; // Guard clause for invalid customerId

      try {
        setLoading(true);
        const API_URL = `${API_URL}/marketplace/customer/getContact/${customerId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des données: ${response.status}`
          );
        }

        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  // Loading, error, or empty data states
  if (loading) {
    return <div className="p-6 text-center">Chargement des données...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Informations de Contact
          </h2>
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <MapPin className="text-purple-600" size={14} />
              <div>
                <h4 className="font-semibold text-gray-800">Adresse</h4>
                <p className="text-gray-600">
                  {" "}
                  {customer.customer_addr_lot},{customer.customer_addr_quartier}
                  , {customer.ville_name}
                  {customer.vi_code_postal}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-purple-600" size={14} />
              <div>
                <h4 className="font-semibold text-gray-800">Téléphone</h4>
                <p className="text-gray-600"> {customer.customerPhone} </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="text-purple-600" size={14} />
              <div>
                <h4 className="font-semibold text-gray-800">Email</h4>
                <p className="text-gray-600"> {customer.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="text-purple-600" size={14} />
              <div>
                <h4 className="font-semibold text-gray-800">Site Web</h4>
                <a
                  href=""
                  className="text-purple-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {customer.siteWeb}
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="p-6 bg-gray-100 rounded-lg">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Envoyer un Message</h3>
                    <form action="" method="POST" className="space-y-4">
                        <div>
                            <label for="nom" className="block mb-1 text-sm font-medium text-gray-700">Votre
                                Nom et Prénom
                                <span className="text-lg text-red-500">*</span>
                            </label>
                            <input type="text" id="nom" name="nom" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Entrez votre nom" />
                        </div>
                        <div>
                            <label for="email" className="block mb-1 text-sm font-medium text-gray-700">Votre Adresse
                                Email
                                <span className="text-lg text-red-500">*</span>
                            </label>
                            <input type="email" id="email" name="email" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Entrez votre email" />
                        </div>
                        <div>
                            <label for="telephone" className="block mb-1 text-sm font-medium text-gray-700">Votre Téléphone
                                <span className="text-lg text-red-500">*</span>
                            </label>
                            <input type="text" id="telephone" name="telephone" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Entrez votre numéro de téléphone" />
                        </div>
                        <div>
                            <label for="fonction" className="block mb-1 text-sm font-medium text-gray-700">Votre Fonction
                                <span className="text-lg text-red-500">*</span>
                            </label>
                            <input type="text" id="fonction" name="fonction" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Entrez votre fonction" />
                        </div>
                        <div>
                            <label for="entreprise" className="block mb-1 text-sm font-medium text-gray-700">Entreprise /
                                Organisation
                                <span className="text-lg text-red-500">*</span>
                            </label>
                            <input type="text" id="entreprise" name="entreprise" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Entrez le nom de votre entreprise" />
                        </div>
                        <div>
                            <label for="subject" className="block mb-1 text-sm font-medium text-gray-700">Sujet <span
                                className="text-lg text-red-500">*</span></label>
                            <input type="text" id="subject" name="subject" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Entrez le sujet" />
                        </div>
                        <div>
                            <label for="demandeFormation" className="block mb-1 text-sm font-medium text-gray-700">Message <span
                                className="text-lg text-red-500">*</span></label>
                            <textarea id="demandeFormation" name="demandeFormation" rows="4" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Entrez votre message"></textarea>
                        </div>
                        <button type="submit"
                            className="w-full px-4 py-2 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700">Envoyer
                            le Message
                        </button>
                    </form>
                </div> */}
      </div>
    </div>
  );
};

export default Contact;
