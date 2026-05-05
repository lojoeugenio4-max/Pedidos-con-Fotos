import React, { useMemo, useState } from "react";
import { Send, ImageOff } from "lucide-react";
import { departments } from "./products";

const WHATSAPP_NUMBER = "34670716744";

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const matchesSearch = (product, search) => {
  const p = normalize(product);
  const words = normalize(search).split(/\s+/).filter(Boolean);
  return words.every((w) => p.includes(w));
};

const getImageFileName = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getImageUrl = (name) => `/images/${getImageFileName(name)}.jpg`;

function ProductPhoto({ name, onClick }) {
  const [error, setError] = useState(false);
  const src = getImageUrl(name);

  if (error) {
    return (
      <div style={styles.photoBox}>
        <ImageOff size={22} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      style={styles.productImage}
      onClick={() => onClick(src)}
      onError={() => setError(true)}
    />
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState({});
  const [zoomImage, setZoomImage] = useState(null);

  const filtered = useMemo(() => {
    const clean = search.trim();

    return departments
      .map((department) => ({
        ...department,
        products: clean
          ? department.products.filter((product) =>
              matchesSearch(product, clean)
            )
          : department.products,
      }))
      .filter((department) => department.products.length > 0);
  }, [search]);

  const update = (id, field, value) => {
    const clean = value.replace(/[^0-9]/g, "");

    setQty((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: clean,
      },
    }));
  };

  const send = () => {
    const lines = [];

    Object.entries(qty).forEach(([id, value]) => {
      if (value?.cajas || value?.unidades) {
        const productName = id.split("-").slice(1).join("-");
        lines.push(
          `${productName}: ${value.cajas || 0} cajas / ${
            value.unidades || 0
          } unidades`
        );
      }
    });

    if (!lines.length) {
      alert("Añade productos antes de enviar.");
      return;
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        lines.join("\n")
      )}`,
      "_blank"
    );
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Pedidos con Fotos</h1>

      <input
        placeholder="Buscar artículo..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={styles.search}
      />

      {filtered.map((department) => (
        <section key={department.name} style={styles.section}>
          <h2 style={styles.sectionTitle}>{department.name}</h2>

          {department.products.map((name) => {
            const id = `${department.name}-${name}`;

            return (
              <div key={id} style={styles.row}>
                <div style={styles.topRow}>
                  <input
                    placeholder="Cajas"
                    value={qty[id]?.cajas || ""}
                    onChange={(event) =>
                      update(id, "cajas", event.target.value)
                    }
                    style={styles.qtyInput}
                    inputMode="numeric"
                  />

                  <input
                    placeholder="Unid."
                    value={qty[id]?.unidades || ""}
                    onChange={(event) =>
                      update(id, "unidades", event.target.value)
                    }
                    style={styles.qtyInput}
                    inputMode="numeric"
                  />

                  <ProductPhoto name={name} onClick={setZoomImage} />
                </div>

                <div style={styles.name}>{name}</div>
              </div>
            );
          })}
        </section>
      ))}

      <button onClick={send} style={styles.button}>
        <Send size={18} /> Enviar por WhatsApp
      </button>

      {zoomImage && (
        <div style={styles.overlay} onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="Producto ampliado" style={styles.zoomedImage} />
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: 12,
    fontFamily: "Arial, sans-serif",
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  title: {
    margin: "0 0 12px",
    fontSize: 24,
  },

  search: {
    width: "100%",
    padding: 12,
    marginBottom: 14,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 16,
    boxSizing: "border-box",
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    background: "#0f172a",
    color: "white",
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 17,
    margin: "14px 0 10px",
  },

  row: {
    background: "white",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  topRow: {
    display: "grid",
    gridTemplateColumns: "70px 70px 1fr",
    gap: 8,
    alignItems: "center",
  },

  qtyInput: {
    width: "100%",
    height: 76,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    boxSizing: "border-box",
  },

  productImage: {
    width: "100%",
    height: 76,
    objectFit: "contain",
    borderRadius: 10,
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    cursor: "pointer",
  },

  photoBox: {
    height: 76,
    background: "#f1f5f9",
    borderRadius: 10,
    border: "1px dashed #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },

  name: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 1.3,
  },

  button: {
    width: "100%",
    padding: 15,
    background: "#22c55e",
    color: "white",
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.88)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 12,
  },

  zoomedImage: {
    maxWidth: "96%",
    maxHeight: "92%",
    objectFit: "contain",
    borderRadius: 14,
    background: "white",
  },
};
