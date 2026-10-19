export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] border border-brand-porcelain/20 bg-brand-porcelain/10 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="text-center font-serif text-4xl text-brand-bronze mb-2">
          EventFlow AI
        </h1>
        <p className="text-center text-brand-porcelain/70 mb-8 font-sans text-sm">
          Panel de Administración Web
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-porcelain mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="admin@eventflow.com"
              className="w-full rounded-xl border border-brand-porcelain/20 bg-brand-porcelain/5 px-4 py-3 text-brand-porcelain placeholder:text-brand-porcelain/30 focus:border-brand-bronze focus:outline-none focus:ring-1 focus:ring-brand-bronze"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-porcelain mb-2">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full rounded-xl border border-brand-porcelain/20 bg-brand-porcelain/5 px-4 py-3 text-brand-porcelain placeholder:text-brand-porcelain/30 focus:border-brand-bronze focus:outline-none focus:ring-1 focus:ring-brand-bronze"
            />
          </div>
          <button className="w-full rounded-full bg-brand-bronze py-3 font-semibold text-brand-night transition hover:bg-brand-bronze/90">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
