import { Pen, X, Plus } from "lucide-react";
import { Button } from "../ui/button-customized";

export const AccountsList = ({
  bankAccounts,
  onAddMobileMoneyAccounts,
  onAddBankAccount,
  onEditBankAccount,
  onDeleteBankAccount,
  mobileMoneyAccounts,
  onEditMobileMoneyAccount,
  onDeleteMobileMoneyAccount,
}) => {

  console.log(bankAccounts)
  return (
    <>
      {/* Bank Accounts Section */}
      <section className="flex flex-col m-4">
        <div className="w-full border border-gray-100 bg-white rounded-xl">
          <div className="flex items-center justify-between p-4">
            <h3 className="text-lg font-medium text-gray-600">Comptes bancaires</h3>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onAddBankAccount}
            >
              Ajouter un compte bancaire
            </Button>
          </div>
          <hr className="border border-gray-300 my-2" />

          {bankAccounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      #
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      Titulaire du compte
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      Banque
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      District
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                       Code Postal
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-600">
                      Numéro de compte
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bankAccounts.map((account, index) => (
                    <tr
                      key={account.idAccount}
                      className="hover:bg-gray-50 border-b border-gray-100 group"
                    >
                      <td className="p-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="p-4 text-sm text-gray-700">
                        {account.ba_titulaire}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {account.ba_name}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {account.ba_quartier}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {account.vi_code_postal} - {account.ville_name}
                      </td>
                      <td className="p-4 text-sm text-gray-700 text-right">
                        {account.ba_account_number}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Pen}
                            onClick={() => onEditBankAccount(account)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={X}
                            onClick={() => onDeleteBankAccount(account)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Aucun compte bancaire disponible
            </div>
          )}
        </div>
      </section>

      {/* Mobile Money Accounts Section */}
      <section className="flex flex-col m-4">
        <div className="w-full border border-gray-100 bg-white rounded-xl">
          <div className="flex items-center justify-between p-4">
            <h3 className="text-lg font-medium text-gray-600">
              Comptes Mobile Money
            </h3>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onAddMobileMoneyAccounts}
            >
              Ajouter un compte Mobile Money
            </Button>
          </div>
          <hr className="border border-gray-300 my-2" />

          {mobileMoneyAccounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      #
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      Titulaire du compte
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      Operateur
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-600">
                      Phone
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mobileMoneyAccounts.map((account, index) => (
                    <tr
                      key={account.id}
                      className="hover:bg-gray-50 border-b border-gray-100 group"
                    >
                      <td className="p-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="p-4 text-sm text-gray-700">
                        {account.mm_titulaire}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {account.mm_operateur}
                      </td>
                      <td className="p-4 text-sm text-gray-700 text-right">
                        {account.mm_phone}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Pen}
                            onClick={() => onEditMobileMoneyAccount(account)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={X}
                            onClick={() =>
                              onDeleteMobileMoneyAccount(account.id)
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Aucun compte de Mobile Money disponible
            </div>
          )}
        </div>
      </section>
    </>
  );
};
