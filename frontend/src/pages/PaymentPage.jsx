import { CreditCard, QrCode } from "lucide-react";
import Card from "../components/Card";
import Row from "../components/Row";

export default function PaymentPage({ selectedCentre, documentName, pages, copies, totalAmount, handlePayment }) {
  return (
    <Card className="mx-auto max-w-xl">
      <h2 className="text-2xl font-bold">Secure Payment</h2>
      <p className="mt-2 text-slate-600">Payment must be verified before the print job appears in centre dashboard.</p>
      <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4">
        <Row label="Centre" value={selectedCentre?.name || "N/A"} />
        <Row label="Document" value={documentName || "Uploaded Document"} />
        <Row label="Pages" value={pages} />
        <Row label="Copies" value={copies} />
        <Row label="Amount" value={`₹${totalAmount}`} />
        <Row label="Centre UPI" value={selectedCentre?.upiId || "N/A"} />
      </div>
      <div className="mt-6 rounded-2xl border p-4 text-center">
        <QrCode className="mx-auto" size={80} />
        <p className="mt-3 font-semibold">Demo UPI QR</p>
        <p className="text-sm text-slate-500">In real project, use Razorpay payment order and webhook verification.</p>
      </div>
      <button onClick={handlePayment} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
        <CreditCard size={18} /> Simulate Verified Payment
      </button>
    </Card>
  );
}
