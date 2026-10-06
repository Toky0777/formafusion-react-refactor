import { useEffect, useState } from 'react';
import { X, Building2, User, Mail, Phone, Globe, Users, UserCheck } from 'lucide-react';
import axios from '../../../../../../config/axios';
import { IMAGE_URL } from "../../../../../../config/env";

const CustomerDrawer = ({ idEtps, onClose }) => {
  const [customer, setCustomer] = useState({
    logo: '',
    customerName: '',
    siteWeb: '',
    customerEmail: '',
    customerPhone: ''
  })
  const [referent, setReferent] = useState([])
  const [loading, setLoading] = useState(true)

  const DataRequest = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`employes/etp-drawer/${idEtps}`)
      console.log(data)
      setCustomer(data.customer || {})
      setReferent(data.referents || [])
    } catch (error) {
      console.error(error)
      setCustomer({})
      setReferent([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    DataRequest()
  }, [idEtps])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute right-0 top-0 h-full w-full max-w-6xl bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-6xl bg-white shadow-2xl transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Détails de l'entreprise</h2>
                <p className="text-blue-100 text-sm">Informations et contacts</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
            >
              <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Company Info */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-28 h-20 bg-white rounded-xl p-2 shadow-md flex items-center justify-center">
                  <img 
                    src={customer.logo || '/default-company-logo.png'}
                    alt={customer.customerName || 'Entreprise'}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {customer.customerName || 'Nom non spécifié'}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <p className="text-base">{customer.siteWeb || 'Aucun site web'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Contact */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Référent principal</h4>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img 
                      src={customer.logo ? `${IMAGE_URL}/img/entreprises/${customer.logo}` : '/default-avatar.png'}
                      alt={customer.customerName || 'Référent'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Nom complet</p>
                        <p className="text-gray-900 font-semibold">
                          {customer.customerName || 'Non spécifié'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Email</p>
                        <p className="text-gray-900 font-semibold">
                          {customer.customerEmail || 'Non spécifié'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Phone className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Téléphone</p>
                        <p className="text-gray-900 font-semibold">
                          {customer.customerPhone || 'Aucun contact'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Contacts */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Autres référents</h4>
                </div>
              </div>
              
              <div className="p-6">
                {referent.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Aucun autre référent</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Les autres contacts apparaîtront ici lorsqu'ils seront ajoutés
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {referent.map((ref, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={ref.photo || '/default-avatar.png'} 
                          alt={ref.name || 'Référent'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{ref.name || ''} {ref.firstName || ''}</p>
                          <p className="text-gray-600">{ref.email || ''}</p>
                          <p className="text-gray-600">{ref.phone || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Company Statistics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Statistiques de l'entreprise</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-blue-700">Référent principal</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{referent.length}</p>
                  <p className="text-sm text-purple-700">Autres référents</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <Building2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-green-700">Entreprise active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDrawer