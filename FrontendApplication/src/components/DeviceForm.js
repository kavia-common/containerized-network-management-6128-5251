import React, { useEffect, useState } from "react";

const initial = { name: "", ip_address: "", type: "router", location: "", status: "offline" };

const isIPv4 = (val) => /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(val);

// PUBLIC_INTERFACE
export default function DeviceForm({ mode = "create", initialValues, onSubmit, onCancel, disabled }) {
  /** Device add/edit form with validation and accessibility */
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (initialValues) {
      setValues({ ...initial, ...initialValues });
    }
  }, [initialValues]);

  const validate = () => {
    const e = {};
    if (!values.name) e.name = "Name is required";
    if (!values.ip_address) e.ip_address = "IP address is required";
    else if (!isIPv4(values.ip_address)) e.ip_address = "Invalid IPv4 address";
    if (!["router", "switch", "server"].includes(values.type)) e.type = "Type must be router, switch, or server";
    if (!values.location) e.location = "Location is required";
    if (!["online", "offline"].includes(values.status)) e.status = "Status must be online or offline";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  const set = (k, v) => setValues({ ...values, [k]: v });

  return (
    <form onSubmit={handleSubmit} aria-label={`${mode === "edit" ? "Edit" : "Add"} device form`}>
      <div style={{ display: "grid", gap: 8 }}>
        <label>
          Name
          <input value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} disabled={disabled} />
          {errors.name && <div id="err-name" role="alert" style={{ color: "#c62828" }}>{errors.name}</div>}
        </label>
        <label>
          IP address
          <input value={values.ip_address} onChange={(e) => set("ip_address", e.target.value)} aria-invalid={!!errors.ip_address} aria-describedby={errors.ip_address ? "err-ip" : undefined} disabled={disabled} />
          {errors.ip_address && <div id="err-ip" role="alert" style={{ color: "#c62828" }}>{errors.ip_address}</div>}
        </label>
        <label>
          Type
          <select value={values.type} onChange={(e) => set("type", e.target.value)} aria-invalid={!!errors.type} aria-describedby={errors.type ? "err-type" : undefined} disabled={disabled}>
            <option value="router">router</option>
            <option value="switch">switch</option>
            <option value="server">server</option>
          </select>
          {errors.type && <div id="err-type" role="alert" style={{ color: "#c62828" }}>{errors.type}</div>}
        </label>
        <label>
          Location
          <input value={values.location} onChange={(e) => set("location", e.target.value)} aria-invalid={!!errors.location} aria-describedby={errors.location ? "err-location" : undefined} disabled={disabled} />
          {errors.location && <div id="err-location" role="alert" style={{ color: "#c62828" }}>{errors.location}</div>}
        </label>
        <label>
          Status
          <select value={values.status} onChange={(e) => set("status", e.target.value)} aria-invalid={!!errors.status} aria-describedby={errors.status ? "err-status" : undefined} disabled={disabled}>
            <option value="online">online</option>
            <option value="offline">offline</option>
          </select>
          {errors.status && <div id="err-status" role="alert" style={{ color: "#c62828" }}>{errors.status}</div>}
        </label>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="submit" disabled={disabled}>{mode === "edit" ? "Save changes" : "Add device"}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
