import { months, formatNumber } from "../../utils/objectifs";
import { motion } from "framer-motion";

export default function Table({
  domainModules,
  isEditing,
  handleClick,
  handleValueChange,
}) {
  // Calcul du total par mois
  const totalByMonth = months.map((_, monthIndex) =>
    domainModules.reduce(
      (sum, module) => sum + (module.moduleGoal?.[monthIndex + 1] || 0),
      0
    )
  );

  return (
    <motion.div
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-medium tracking-wider text-left">
                  Modules
                </th>
                {months.map((month, index) => (
                  <th
                    key={index}
                    className="px-2 py-3 text-sm font-bold tracking-wider text-center text-gray-500"
                  >
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domainModules.map((module, idx) => (
                <motion.tr
                  key={module.idModule}
                  initial={{ y: -5 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 truncate">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={module.moduleImage}
                          alt={module.moduleName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {module.moduleName}
                        </div>
                      </div>
                    </div>
                  </td>
                  {months.map((_, monthIndex) => (
                    <td
                      onClick={() => handleClick(module.idModule, monthIndex)}
                      key={monthIndex}
                      className="px-2 py-4 text-xs text-center text-gray-500 whitespace-nowrap"
                    >
                      {isEditing.idModule === module.idModule &&
                      isEditing.idMonth === monthIndex ? (
                        <input
                          type="number"
                          defaultValue={
                            module.moduleGoal?.[monthIndex + 1] || 0
                          }
                          onBlur={(e) =>
                            handleValueChange(
                              module.idModule,
                              monthIndex,
                              e.target.value
                            )
                          }
                          autoFocus
                          className="w-20 py-2 text-center border border-blue-100 rounded"
                        />
                      ) : (
                        formatNumber(module.moduleGoal?.[monthIndex + 1] || 0)
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}

              <tr className="font-bold bg-white">
                <td className="px-6 py-4 text-center">Total</td>
                {totalByMonth.map((total, idx) => (
                  <td
                    key={idx}
                    className="px-2 py-4 text-xs text-center text-gray-800"
                  >
                    {formatNumber(total)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
