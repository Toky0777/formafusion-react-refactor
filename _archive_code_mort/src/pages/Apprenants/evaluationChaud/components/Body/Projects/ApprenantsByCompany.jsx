import React from 'react';
import ApprenantItem from './ApprenantItem';

const ApprenantsByCompany = ({ company, apprenants }) => {
  return (
    <div>
      <p className="text-xl font-medium text-gray-600 mt-4 mb-2">
        {company}
      </p>
      {apprenants.map((apprenant) => (
        <ApprenantItem key={apprenant.id} apprenant={apprenant} />
      ))}
    </div>
  );
};

export default ApprenantsByCompany;