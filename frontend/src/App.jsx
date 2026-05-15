import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import UserDashboard from "./pages/UserDashboard";
import HubDashboard from "./pages/HubDashboard";
import HubPricingPage from "./pages/HubPricingPage";
import CentreCodePage from "./pages/CentreCodePage";
import UploadPage from "./pages/UploadPage";
import PaymentPage from "./pages/PaymentPage";
import TrackPage from "./pages/TrackPage";
import HistoryPage from "./pages/HistoryPage";
import { initialCentres, initialOrders } from "./data/demoData";
import { calculateTotalAmount, getPricePerPage } from "./utils/price";
import { createPrintOrder } from "./utils/orders";

export default function App() {
  const [page, setPage] = useState("home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [authRole, setAuthRole] = useState("user");
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [hubName, setHubName] = useState("");
  const [hubCode, setHubCode] = useState("");

  const [centreCode, setCentreCode] = useState("");
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [colorType, setColorType] = useState("bw");
  const [sideType, setSideType] = useState("single");
  const [watermark, setWatermark] = useState(false);
  const [order, setOrder] = useState(null);

  const [centres, setCentres] = useState(initialCentres);
  const [orders, setOrders] = useState(initialOrders);

  const pricePerPage = useMemo(
    () => getPricePerPage(selectedCentre, colorType, sideType),
    [selectedCentre, colorType, sideType]
  );

  const totalAmount = useMemo(
    () => calculateTotalAmount({ pages, copies, pricePerPage, watermark }),
    [pages, copies, pricePerPage, watermark]
  );

  const currentHub = useMemo(() => {
    if (!currentUser || currentUser.role !== "hub") return null;
    return centres.find((centre) => centre.code === currentUser.hubCode) || centres[0];
  }, [currentUser, centres]);

  const hubOrders = useMemo(() => {
    if (!currentHub) return [];
    return orders.filter((item) => item.centreCode === currentHub.code);
  }, [orders, currentHub]);

  function navigate(nextPage) {
    setPage(nextPage);
    setProfileOpen(false);
  }

  function startLogin(role) {
    setAuthRole(role);
    setAuthMode("login");
    navigate("auth");
  }

  function startRegister(role) {
    setAuthRole(role);
    setAuthMode("register");
    navigate("auth");
  }

  function handleAuthSubmit() {
    if (mobile.length < 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    if (authRole === "user") {
      setCurrentUser({ role: "user", name: name || "User", mobile });
      navigate("userDashboard");
      return;
    }

    if (authMode === "register") {
      if (!hubName) {
        alert("Enter print hub name");
        return;
      }

      const newCode = hubCode || String(Math.floor(1000 + Math.random() * 9000));
      const newCentre = {
        id: centres.length + 1,
        code: newCode,
        name: hubName,
        owner: name || "Hub Owner",
        mobile,
        status: "Available",
        upiId: "yourupi@upi",
        bwSingle: 1,
        bwDouble: 1.5,
        colorSingle: 2,
        colorDouble: 3,
      };

      setCentres((prev) => [...prev, newCentre]);
      setCurrentUser({ role: "hub", name: name || "Hub Owner", mobile, hubCode: newCode });
      navigate("hubDashboard");
      return;
    }

    const loginCentre = centres.find((centre) => centre.code === hubCode) || centres[0];
    setCurrentUser({ role: "hub", name: name || loginCentre.owner, mobile, hubCode: loginCentre.code });
    navigate("hubDashboard");
  }

  function logout() {
    setCurrentUser(null);
    navigate("home");
  }

  function handleCentreCode() {
    const centre = centres.find((c) => c.code === centreCode.trim());
    if (centre) {
      setSelectedCentre(centre);
      navigate("upload");
    } else {
      alert("Invalid centre code. Try 2045 or 7832 for demo.");
    }
  }

  function startDirectUpload() {
    setSelectedCentre(null);
    navigate("upload");
  }

  function selectCentreAndUpload(centre) {
    setSelectedCentre(centre);
    navigate("upload");
  }

  function handlePayment() {
    if (!selectedCentre) {
      alert("Please select a printing centre first.");
      navigate("centre");
      return;
    }

    const newOrder = createPrintOrder({ selectedCentre, documentName, pages, copies, totalAmount });
    setOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    navigate("track");
  }

  function updateOrderStatus(orderId, nextStatus) {
    setOrders((prev) => prev.map((item) => (item.id === orderId ? { ...item, status: nextStatus } : item)));
    if (order?.id === orderId) setOrder((prev) => ({ ...prev, status: nextStatus }));
  }

  function updateCentrePrice(field, value) {
    if (!currentHub) return;
    setCentres((prev) =>
      prev.map((centre) => (centre.code === currentHub.code ? { ...centre, [field]: Number(value) } : centre))
    );
  }

  function updateCentrePayment(field, value) {
    if (!currentHub) return;
    setCentres((prev) =>
      prev.map((centre) => (centre.code === currentHub.code ? { ...centre, [field]: value } : centre))
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        page={page}
        navigate={navigate}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        currentUser={currentUser}
        startLogin={startLogin}
        startRegister={startRegister}
        logout={logout}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {page === "home" && (
          <HomePage
            navigate={navigate}
            centres={centres}
            startLogin={startLogin}
            startRegister={startRegister}
            startDirectUpload={startDirectUpload}
            selectCentreAndUpload={selectCentreAndUpload}
          />
        )}

        {page === "auth" && (
          <AuthPage
            authRole={authRole}
            setAuthRole={setAuthRole}
            authMode={authMode}
            setAuthMode={setAuthMode}
            mobile={mobile}
            setMobile={setMobile}
            name={name}
            setName={setName}
            hubName={hubName}
            setHubName={setHubName}
            hubCode={hubCode}
            setHubCode={setHubCode}
            handleAuthSubmit={handleAuthSubmit}
          />
        )}

        {page === "userDashboard" && <UserDashboard currentUser={currentUser} navigate={navigate} orders={orders} />}
        {page === "hubDashboard" && <HubDashboard currentHub={currentHub} hubOrders={hubOrders} updateOrderStatus={updateOrderStatus} navigate={navigate} />}
        {page === "hubPricing" && <HubPricingPage currentHub={currentHub} updateCentrePrice={updateCentrePrice} updateCentrePayment={updateCentrePayment} />}
        {page === "centre" && <CentreCodePage centreCode={centreCode} setCentreCode={setCentreCode} handleCentreCode={handleCentreCode} centres={centres} selectCentreAndUpload={selectCentreAndUpload} />}
        {page === "upload" && <UploadPage selectedCentre={selectedCentre} documentName={documentName} setDocumentName={setDocumentName} pages={pages} setPages={setPages} copies={copies} setCopies={setCopies} colorType={colorType} setColorType={setColorType} sideType={sideType} setSideType={setSideType} watermark={watermark} setWatermark={setWatermark} totalAmount={totalAmount} navigate={navigate} />}
        {page === "payment" && <PaymentPage selectedCentre={selectedCentre} documentName={documentName} pages={pages} copies={copies} totalAmount={totalAmount} handlePayment={handlePayment} />}
        {page === "track" && <TrackPage order={order} />}
        {page === "history" && <HistoryPage orders={orders} currentUser={currentUser} />}
      </main>
    </div>
  );
}
