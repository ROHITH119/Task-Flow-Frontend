const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
