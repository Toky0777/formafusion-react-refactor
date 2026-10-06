const StepHeader = () => {
  return (
    <div className="mb-8 text-center">
      <div className="relative mx-auto mb-4">
        <div className="flex items-center justify-center w-16 h-16 mx-auto text-white rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-violet-600 animate-float">
          <span className="text-2xl font-bold">F</span>
        </div>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text">
        Inscrivez-vous gratuitement sur Formafusion
      </h1>
      <p className="text-sm text-gray-600 animate-fade-in-delay">
        Plateforme collaborative de gestion de formation
      </p>
    </div>
  );
};

export default StepHeader;