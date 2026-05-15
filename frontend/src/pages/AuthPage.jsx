import { User, Phone, Store, QrCode, ShieldCheck } from "lucide-react";
import Card from "../components/Card";
import Input from "../components/Input";

export default function AuthPage({
  authRole,
  setAuthRole,
  authMode,
  setAuthMode,
  mobile,
  setMobile,
  name,
  setName,
  hubName,
  setHubName,
  hubCode,
  setHubCode,
  handleAuthSubmit,
}) {
  const isHub = authRole === "hub";
  const isRegister = authMode === "register";

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isRegister ? "Register" : "Login"} as {isHub ? "Print Hub" : "User"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">MVP uses mobile number based login. Later add real OTP verification.</p>
        </div>
        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button onClick={() => setAuthRole("user")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${authRole === "user" ? "bg-white shadow" : ""}`}>
            User
          </button>
          <button onClick={() => setAuthRole("hub")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${authRole === "hub" ? "bg-white shadow" : ""}`}>
            Print Hub
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Name" icon={<User size={18} />} value={name} setValue={setName} placeholder="Enter name" />
        <Input label="Mobile Number" icon={<Phone size={18} />} value={mobile} setValue={setMobile} placeholder="10 digit mobile" />
        {isHub && isRegister && <Input label="Print Hub Name" icon={<Store size={18} />} value={hubName} setValue={setHubName} placeholder="Example: Sai Printing Hub" />}
        {isHub && <Input label={isRegister ? "Custom Centre Code Optional" : "Centre Code"} icon={<QrCode size={18} />} value={hubCode} setValue={setHubCode} placeholder="Example: 2045" />}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 text-green-600" size={20} />
          <p className="text-sm text-slate-600">
            Real project security: use OTP, JWT token, backend validation, role-based access, and never trust frontend payment status.
          </p>
        </div>
      </div>

      <button onClick={handleAuthSubmit} className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
        {isRegister ? "Create Account" : "Login"}
      </button>
      <button onClick={() => setAuthMode(isRegister ? "login" : "register")} className="mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50">
        {isRegister ? "Already have account? Login" : "New here? Register"}
      </button>
    </Card>
  );
}
