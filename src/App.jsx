import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Trash2, Send, Search, ImageOff } from "lucide-react";
import { departments, hiddenProductsRaw } from "./products";
import { productImages } from "./productImages";

const WHATSAPP_NUMBER = "34670716744";

const normalizeForCompare = (text) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ]+/gi, "").trim();

const normalizeText = (text) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const productMatchesSearch = (product, searchText) => {
  const normalizedProduct = normalizeText(product);
  const searchWords = normalizeText(searchText).split(/[^a-z0-9ñ]+/i).filter(Boolean);
  return searchWords.every((word) => normalizedProduct.includes(word));
};

const visibleProducts = departments.flatMap((department) =>
  department.products.map((name) => ({
    id: `${department.name}-${name}`,
    name,
    department: department.name,
    hidden: false,
  }))
);

const visibleProductNamesForCompare = new Set(
  visibleProducts.map((product) => normalizeForCompare(product.name))
);

const hiddenProductsUnique = [...new Set(hiddenProductsRaw)]
  .filter((name) => !visibleProductNamesForCompare.has(normalizeForCompare(name)))
  .sort((a, b) => a.localeCompare(b, "es"));

const hiddenProductsFormatted = hiddenProductsUnique.map((name) => ({
  id: `ARTÍCULOS BUSCADOS-${name}`,
  name,
  department: "ARTÍCULOS BUSCADOS",
  hidden: true,
}));

const products = [...visibleProducts, ...hiddenProductsFormatted];

function ProductPhoto({ productName }) {
  const imageUrl = productImages[productName];

  if (!imageUrl) {
    return (
      <div style={styles.photoBox}>
        <ImageOff size={24} />
        <span>Foto</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={productName}
      style={styles.productImage}
      loading="lazy"
    />
  );
}

export default function App() {
  useEffect(() => {
    let viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      document.head.appendChild(viewport);
    }
    viewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
  }, []);

  const [quantities, setQuantities] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");

  const filteredDepartments = useMemo(() => {
    const cleanSearch = search.trim();

    const visibleDepartments = departments
      .map((department) => ({
        ...department,
        products: cleanSearch
          ? department.products.filter((product) => productMatchesSearch(product, cleanSearch))
          : department.products,
      }))
      .filter((department) => department.products.length > 0);

    if (!cleanSearch) return visibleDepartments;

    const hiddenMatches = hiddenProductsUnique.filter((product) =>
      productMatchesSearch(product, cleanSearch)
    );

    if (hiddenMatches.length > 0) {
      visibleDepartments.push({
        name: "ARTÍCULOS BUSCADOS",
        products: hiddenMatches,
      });
    }

    return visibleDepartments;
  }, [search]);

  const selectedItems = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        cajas: Number(quantities[product.id]?.cajas || 0),
        unidades: Number(quantities[product.id]?.unidades || 0),
      }))
      .filter((product) => product.cajas > 0 || product.unidades > 0);
  }, [quantities]);

  const updateQuantity = (productId, field, value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setQuantities((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: cleanValue,
      },
    }));
  };

  const closeKeyboardOnEnter = (event) => {
    if (event.key === "Enter") event.currentTarget.blur();
  };

  const clearOrder = () => {
    setQuantities({});
    setCustomerName("");
    setNotes("");
    setSearch("");
  };

  const createWhatsAppMessage = () => {
    const lines = ["Nuevo pedido", ""];

    if (customerName.trim()) {
      lines.push(`Cliente: ${customerName.trim()}`, "");
    }

    selectedItems.forEach((item) => {
      const parts = [];
      if (item.cajas > 0) parts.push(`*${item.cajas} cajas*`);
      if (item.unidades > 0) parts.push(`*${item.unidades} unidades*`);
      lines.push(`- ${item.name}: ${parts.join(" / ")}`, "");
    });

    if (notes.trim()) {
      lines.push(`Observaciones: ${notes.trim()}`, "");
    }

    lines.push("Enviado desde el formulario de pedidos");
    return encodeURIComponent(lines.join("\n"));
  };

  const sendOrder = () => {
    if (selectedItems.length === 0) {
      alert("Introduce al menos una cantidad antes de enviar el pedido.");
      return;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${createWhatsAppMessage()}`, "_blank");
    clearOrder();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconBox}>
            <ShoppingCart size={28} />
          </div>
          <div>
            <h1 style={styles.title}>Pedido online Cash Lojo</h1>
            <p style={styles.subtitle}>
              Escribe cantidades en Unidades o Cajas y envía el pedido por WhatsApp.
            </p>
          </div>
        </header>

        <div style={styles.cardSticky}>
          <label style={styles.label}>Nombre o referencia del cliente</label>
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Opcional"
            style={styles.input}
          />

          <label style={styles.label}>Buscar artículo</label>
          <div style={styles.searchAndSendRow}>
            <div style={styles.searchBoxCompact}>
              <Search size={20} style={styles.searchIcon} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                style={styles.searchInput}
              />
            </div>

            <button onClick={sendOrder} style={styles.stickyWhatsappButton}>
              <Send size={18} /> WhatsApp
            </button>
          </div>
        </div>

        {filteredDepartments.map((department) => (
          <section key={department.name} style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>{department.name}</h2>
            </div>

            <div style={styles.gridHeader}>
              <div>Cajas</div>
              <div>Unid.</div>
              <div>Foto</div>
            </div>

            {department.products.map((productName) => {
              const productId = `${department.name}-${productName}`;

              return (
                <div key={productId} style={styles.productCard}>
                  <div style={styles.productTopRow}>
                    <input
                      inputMode="numeric"
                      enterKeyHint="done"
                      value={quantities[productId]?.cajas || ""}
                      onChange={(event) =>
                        updateQuantity(productId, "cajas", event.target.value)
                      }
                      onKeyDown={closeKeyboardOnEnter}
                      placeholder="0"
                      style={styles.qtyInput}
                    />

                    <input
                      inputMode="numeric"
                      enterKeyHint="done"
                      value={quantities[productId]?.unidades || ""}
                      onChange={(event) =>
                        updateQuantity(productId, "unidades", event.target.value)
                      }
                      onKeyDown={closeKeyboardOnEnter}
                      placeholder="0"
                      style={styles.qtyInput}
                    />

                    <ProductPhoto productName={productName} />
                  </div>

                  <p style={styles.productNameUnder}>{productName}</p>
                </div>
              );
            })}
          </section>
        ))}

        <div style={styles.card}>
          <label style={styles.label}>Observaciones</label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Opcional"
            rows={3}
            style={styles.textarea}
          />

          <div style={styles.summary}>
            <strong>Resumen:</strong> {selectedItems.length} artículos con cantidad.
          </div>

          <button onClick={sendOrder} style={styles.primaryButton}>
            <Send size={20} /> Enviar por WhatsApp
          </button>

          <button onClick={clearOrder} style={styles.secondaryButton}>
            <Trash2 size={20} /> Borrar pedido
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "16px",
    color: "#0f172a",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    background: "white",
    padding: "20px",
    borderRadius: "18px",
    display: "flex",
    gap: "14px",
    alignItems: "center",
    marginBottom: "16px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  iconBox: {
    background: "#0f172a",
    color: "white",
    borderRadius: "16px",
    padding: "12px",
    display: "flex",
  },
  title: { margin: 0, fontSize: "24px" },
  subtitle: { margin: "6px 0 0", color: "#475569", fontSize: "14px" },
  cardSticky: {
    position: "sticky",
    top: "8px",
    zIndex: 10,
    background: "white",
    padding: "16px",
    borderRadius: "18px",
    marginBottom: "18px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  card: {
    background: "white",
    padding: "18px",
    borderRadius: "18px",
    marginTop: "18px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    fontSize: "13px",
    marginBottom: "6px",
    marginTop: "8px",
  },
  input: {
    width: "100%",
    padding: "11px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  searchAndSendRow: {
    display: "grid",
    gridTemplateColumns: "1fr 118px",
    gap: "8px",
    alignItems: "center",
  },
  searchBoxCompact: { position: "relative", minWidth: 0 },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "11px",
    color: "#64748b",
  },
  searchInput: {
    width: "100%",
    padding: "11px 12px 11px 40px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  section: {
    background: "white",
    borderRadius: "18px",
    overflow: "hidden",
    marginBottom: "18px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  },
  sectionHeader: {
    background: "#0f172a",
    color: "white",
    padding: "12px 16px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    textTransform: "uppercase",
  },
  gridHeader: {
    display: "grid",
    gridTemplateColumns: "80px 80px 1fr",
    gap: "8px",
    background: "#e2e8f0",
    padding: "10px",
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center",
  },
  productCard: {
    padding: "10px",
    borderTop: "1px solid #e2e8f0",
  },
  productTopRow: {
    display: "grid",
    gridTemplateColumns: "80px 80px 1fr",
    gap: "8px",
    alignItems: "center",
  },
  qtyInput: {
    width: "100%",
    height: "74px",
    padding: "8px 4px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "22px",
    boxSizing: "border-box",
  },
  photoBox: {
    height: "74px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontWeight: "bold",
    fontSize: "13px",
  },
  productImage: {
    width: "100%",
    height: "74px",
    objectFit: "cover",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
  },
  productNameUnder: {
    margin: "8px 0 0",
    fontSize: "15px",
    fontWeight: "700",
    lineHeight: 1.3,
  },
  textarea: {
    width: "100%",
    padding: "11px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  summary: {
    background: "#e2e8f0",
    padding: "12px",
    borderRadius: "12px",
    margin: "14px 0",
    fontSize: "14px",
  },
  primaryButton: {
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "12px",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  stickyWhatsappButton: {
    width: "100%",
    height: "44px",
    border: "none",
    borderRadius: "12px",
    background: "#22c55e",
    color: "white",
    fontSize: "13px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },
  secondaryButton: {
    width: "100%",
    height: "50px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    background: "white",
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};
