import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import DeviceList from "./components/DeviceList";
import DeviceForm from "./components/DeviceForm";
import { apiDelete, apiGet, apiPost, apiPut, getApiBaseUrl } from "./api";

// PUBLIC_INTERFACE
function App() {
  /** Device Management UI with CRUD, polling, accessibility, and graceful DB-down handling */
  const [theme, setTheme] = useState("light");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [dbAvailable, setDbAvailable] = useState(true);
  const [filter, setFilter] = useState({ query: "", type: "all", status: "all" });
  const [sort, setSort] = useState({ by: "name", dir: "asc" });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const apiBase = useMemo(() => getApiBaseUrl(), []);
  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await apiGet("/devices");
      // Expect shape { success, data } or array
      const list = Array.isArray(res) ? res : res?.data || [];
      setDevices(list);
      setDbAvailable(true);
    } catch (e) {
      // If backend signals DB down, it should send 503 with error message
      setDbAvailable(false);
      showToast(e.message || "Failed to load devices", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const id = setInterval(fetchDevices, 5000);
    return () => clearInterval(id);
  }, []);

  const createDevice = async (payload) => {
    try {
      const res = await apiPost("/devices", payload);
      const created = res?.data || res;
      setDevices(prev => [created, ...prev]);
      showToast("Device created", "success");
      setFormOpen(false);
    } catch (e) {
      showToast(e.message || "Failed to create device", "error");
    }
  };

  const updateDevice = async (id, payload) => {
    try {
      const res = await apiPut(`/devices/${id}`, payload);
      const updated = res?.data || res;
      setDevices(prev => prev.map(d => (d.id === id ? updated : d)));
      showToast("Device updated", "success");
      setEditTarget(null);
      setFormOpen(false);
    } catch (e) {
      showToast(e.message || "Failed to update device", "error");
    }
  };

  const deleteDevice = async (d) => {
    if (!window.confirm(`Delete ${d.name}?`)) return;
    try {
      await apiDelete(`/devices/${d.id}`);
      setDevices(prev => prev.filter(x => x.id !== d.id));
      showToast("Device deleted", "success");
    } catch (e) {
      showToast(e.message || "Failed to delete device", "error");
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const openEdit = (d) => {
    setEditTarget(d);
    setFormOpen(true);
  };
  const cancelForm = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  return (
    <div className="App">
      <header className="App-header" style={{ alignItems: "stretch" }}>
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <div className="container" style={{ width: "min(1100px, 96vw)", margin: "0 auto", padding: 16 }}>
          <h1 className="title" style={{ marginTop: 0 }}>Network Device Manager</h1>
          <p className="description" style={{ marginTop: 0 }}>
            Backend: <code>{apiBase}</code>
          </p>

          {!dbAvailable && (
            <div role="alert" aria-live="assertive" style={{ background: "#fff3cd", color: "#664d03", padding: 12, borderRadius: 8, border: "1px solid #ffe69c", marginBottom: 12 }}>
              Database is unavailable. Listing may be incomplete and write operations are disabled.
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <button onClick={fetchDevices} disabled={loading} aria-busy={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button onClick={openCreate} disabled={!dbAvailable}>Add device</button>
          </div>

          {formOpen && (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <h2 style={{ marginTop: 0 }}>{editTarget ? "Edit device" : "Add device"}</h2>
              <DeviceForm
                mode={editTarget ? "edit" : "create"}
                initialValues={editTarget || undefined}
                onSubmit={(vals) => {
                  if (editTarget) updateDevice(editTarget.id, vals);
                  else createDevice(vals);
                }}
                onCancel={cancelForm}
                disabled={!dbAvailable}
              />
            </div>
          )}

          <DeviceList
            devices={devices}
            onSelect={(d) => setSelected(d)}
            onEdit={openEdit}
            onDelete={deleteDevice}
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            dbAvailable={dbAvailable}
          />

          {selected && (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, marginTop: 16 }} aria-live="polite">
              <h2 style={{ marginTop: 0 }}>Details</h2>
              <div style={{ display: "grid", gap: 4, gridTemplateColumns: "160px 1fr" }}>
                <div>Name</div><div>{selected.name}</div>
                <div>IP address</div><div>{selected.ip_address}</div>
                <div>Type</div><div>{selected.type}</div>
                <div>Location</div><div>{selected.location}</div>
                <div>Status</div><div>{selected.status || "unknown"}</div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(selected)} disabled={!dbAvailable}>Edit</button>
                <button onClick={() => deleteDevice(selected)} disabled={!dbAvailable}>Delete</button>
                <button
                  onClick={async () => {
                    try {
                      const res = await apiGet(`/devices/${selected.id}/status`);
                      const status = res?.data?.status || res?.status || "unknown";
                      setDevices(prev => prev.map(d => d.id === selected.id ? { ...d, status } : d));
                      setSelected(s => ({ ...s, status }));
                      showToast(`Status: ${status}`, "success");
                    } catch (e) {
                      showToast(e.message || "Status check failed", "error");
                    }
                  }}
                >
                  Check status
                </button>
              </div>
            </div>
          )}

          {toast && (
            <div role="status" aria-live="polite" style={{
              position: "fixed", bottom: 16, right: 16, background: toast.type === "error" ? "#fdecea" : "#e7f6ed",
              color: toast.type === "error" ? "#611a15" : "#1e4620", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)"
            }}>
              {toast.msg}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
