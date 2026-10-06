
const ClientContact = ({ client }) => {
  return (
    <div className="pt-2 border-t border-gray-100 space-y-1">
      <ContactItem icon="📧" text={client.email} />
      {client.phone && <ContactItem icon="📞" text={client.phone} />}
      
    </div>
  );
};

const ContactItem = ({ icon, text }) => (
  <div className="text-xs text-gray-600 flex items-center gap-1 truncate">
    <span className="text-[10px]">{icon}</span> 
    <span className="truncate">{text}</span>
  </div>
);

export default ClientContact;