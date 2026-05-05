import React, { useMemo, useState } from "react";
import { Send, ImageOff } from "lucide-react";
import { departments } from "./products";

const WHATSAPP_NUMBER = "34670716744";

// NORMALIZAR TEXTO
const normalize = (text) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// BUSCADOR
const matchesSearch = (product, search) => {
  const p = normalize(product);
  const words = normalize(search).split(/\s+/).filter(Boolean);
  return words.every((w) => p.includes(w));
};

// GENERAR NOMBRE DE FOTO AUTOMÁTICO
const getImageFileName = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// RUTA IMAGEN
const getImageUrl = (name) => `/images/${getImageFileName(name)}.jpg`;

// COMPONENTE FOTO
function ProductPhoto({ name, onClick }) {
  const [error, setError] = useState(false);
  const src = getImageUrl(name);

  if (error) {
    return (
      <div style={styles.photoBox}>
        <ImageOff size={28} />
        <span>Sin foto</span>
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

  // FILTRO
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

  // ACTUALIZAR CANTIDADES
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

  // ENVIAR WHATSAPP
  const send = () => {
    const lines = ["Nuevo pedido", ""];

    Object.entries(qty).forEach(([id, value]) => {
      if (value?.cajas || value?.unidades) {
        const productName = id.split("-").slice(1).join("-");
        lines.push(
          `- ${productName}: ${value.cajas || 0} cajas / ${
            value.unidades || 0
          } unidades`
        );
      }
    });

    if (lines.length <= 2) {
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
      <h1 style={styles.title}>Pedido online Cash Lojo</h1>

      {/* BUSCADOR + WHATSAPP */}
      <div style={styles.topBar}>
        <input
          placeholder="Buscar artículo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <button onClick={send} style={styles.whatsappButton}>
          <Send size={18} />
          Enviar
        </button>
      </div>

      {/* LISTADO */}
      {filtered.map((department) => (
        <section key={department.name} style={styles.section}>
          <h2 style={styles.sectionTitle}>{department.name}</h2>

          {department.products.map((name) => {
            const id = `${department.name}-${name}`;

            return (
              <div key={id} style={styles.card}>
                <div style={styles.productRow}>
                  <ProductPhoto name={name} onClick={setZoomImage} />

                  <div style={styles.productInfo}>
                    <div style={styles.productName}>{name}</div>

                    <div style={styles.qtyRow}>
                      <input
                        placeholder="Cajas"
                        value={qty[id]?.cajas || ""}
                        onChange={(e) =>
                          update(id, "cajas", e.target.value)
                        }
                        style={styles.qtyInput}
                        inputMode="numeric"
                      />

                      <input
                        placeholder="Unid."
                        value={qty[id]?.unidades || ""}
                        onChange={(e) =>
                          update(id, "unidades", e.target.value)
                        }
                        style={styles.qtyInput}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}

      {/* ZOOM IMAGEN */}
      {zoomImage && (
        <div style={styles.overlay} onClick={() => setZoomImage(null)}>
          <img src={zoomImage} style={styles.zoomedImage} />
        </div>
      )}
    </div>
  );
}

// 🎨 ESTILOS OPTIMIZADOS MÓVIL
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: 8,
    fontFamily: "Arial, sans-serif",
  },

  title: {
    margin: "0 0 8px",
    fontSize: 24,
    fontWeight: "900",
  },

  topBar: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "grid",
    gridTemplateColumns: "1fr 100px",
    gap: 6,
    background: "#f1f5f9",
    paddingBottom: 10,
  },

  search: {
    height: 56,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    padding: "0 12px",
    fontSize: 18,
    fontWeight: "700",
  },

  whatsappButton: {
    height: 56,
    borderRadius: 12,
    border: "none",
    background: "#22c55e",
    color: "white",
    fontSize: 14,
    fontWeight: "900",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    margin: "8px 0",
    background: "#0f172a",
    color: "white",
    padding: 10,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "900",
  },

  card: {
    background: "white",
    borderRadius: 14,
    padding: 8,
    marginBottom: 8,
  },

  productRow: {
    display: "grid",
    gridTemplateColumns: "100px 1fr",
    gap: 8,
  },

  productImage: {
    width: 100,
    height: 100,
    objectFit: "contain",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
  },

  photoBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    border: "1px dashed #cbd5e1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },

  productInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  productName: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  qtyRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
  },

  qtyInput: {
    height: 52,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  zoomedImage: {
    maxWidth: "95%",
    maxHeight: "90%",
    borderRadius: 12,
  },
};
