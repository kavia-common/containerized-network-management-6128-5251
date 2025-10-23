import React, { useMemo } from "react";

const statusColors = {
  online: "#2e7d32",
  offline: "#c62828",
  unknown: "#6b7280",
};

// PUBLIC_INTERFACE
export default function DeviceList({ devices, onSelect, onEdit, onDelete, filter, setFilter, sort, setSort, dbAvailable }) {
  /** Accessible device table list with filtering, sorting, and actions */
  const filtered = useMemo(() => {
    let arr = devices || [];
    if (filter.query) {
      const q = filter.query.toLowerCase();
      arr = arr.filter(
        d =>
          d.name?.toLowerCase().includes(q) ||
          d.ip_address?.toLowerCase().includes(q) ||
          d.type?.toLowerCase().includes(q) ||
          d.location?.toLowerCase().includes(q)
      );
    }
    if (filter.type && filter.type !== "all") {
      arr = arr.filter(d => d.type === filter.type);
    }
    if (filter.status && filter.status !== "all") {
      arr = arr.filter(d => (d.status || "unknown") === filter.status);
    }
    if (sort.by) {
      arr = [...arr].sort((a, b) => {
        const av = (a[sort.by] || "").toString().toLowerCase();
        const bv = (b[sort.by] || "").toString().toLowerCase();
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return arr;
  }, [devices, filter, sort]);

  const toggleSort = (col) => {
    if (sort.by === col) {
      setSort({ by: col, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      setSort({ by: col, dir: "asc" });
    }
  };

  return (
    <section aria-labelledby="device-list-title">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <h2 id="device-list-title" style={{ margin: "0 8px 0 0" }}>Devices</h2>
        <input
          aria-label="Search devices"
          placeholder="Search..."
          value={filter.query}
          onChange={(e) => setFilter({ ...filter, query: e.target.value })}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", flex: 1, minWidth: 180 }}
        />
        <select
          aria-label="Filter by type"
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="all">All types</option>
          <option value="router">router</option>
          <option value="switch">switch</option>
          <option value="server">server</option>
        </select>
        <select
          aria-label="Filter by status"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="all">All status</option>
          <option value="online">online</option>
          <option value="offline">offline</option>
          <option value="unknown">unknown</option>
        </select>
      </div>

      <div role="table" aria-label="Device list" style={{ overflowX: "auto" }}>
        <div role="rowgroup">
          <div role="row" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr 0.6fr 0.6fr", gap: 8, fontWeight: 600, padding: "8px 4px", borderBottom: "1px solid #eee" }}>
            <button onClick={() => toggleSort("name")} aria-label="Sort by name" style={{ textAlign: "left" }}>Name</button>
            <button onClick={() => toggleSort("ip_address")} aria-label="Sort by IP address" style={{ textAlign: "left" }}>IP</button>
            <button onClick={() => toggleSort("type")} aria-label="Sort by type" style={{ textAlign: "left" }}>Type</button>
            <button onClick={() => toggleSort("location")} aria-label="Sort by location" style={{ textAlign: "left" }}>Location</button>
            <div>Status</div>
            <div>Actions</div>
          </div>
        </div>
        <div role="rowgroup">
          {filtered.map((d) => (
            <div key={d.id} role="row" tabIndex={0} onClick={() => onSelect(d)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(d); }} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr 0.6fr 0.6fr", gap: 8, padding: "10px 4px", borderBottom: "1px solid #f0f0f0", cursor: "pointer", alignItems: "center" }}>
              <div>{d.name}</div>
              <div>{d.ip_address}</div>
              <div>{d.type}</div>
              <div>{d.location}</div>
              <div aria-label={`Status ${d.status || "unknown"}`} style={{ color: statusColors[d.status || "unknown"], fontWeight: 600 }}>
                {d.status || "unknown"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(d); }} aria-label={`Edit ${d.name}`}>Edit</button>
                <button disabled={!dbAvailable} onClick={(e) => { e.stopPropagation(); onDelete(d); }} aria-label={`Delete ${d.name}`}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div role="row" style={{ padding: 12, color: "#666" }}>No devices found.</div>
          )}
        </div>
      </div>
    </section>
  );
}
