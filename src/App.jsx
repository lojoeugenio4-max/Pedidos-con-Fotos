import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Trash2, Send, Search } from "lucide-react";

const WHATSAPP_NUMBER = "34670716744";

/* 🔴 DEJA AQUÍ TUS ARRAYS departments Y hiddenProductsRaw 🔴 */
const departments = [
  {
    name: "AGUA",
    products: [
      "AGUA FUENTELAJARA 1.5L",
      "AGUA LANJARON 1.5L PACK 6",
      "AGUA FUENTELAJARA 0.5L",
      "AGUA LANJARON 0.5L",
      "AGUA VALTORRE 0.5L PITORRO",
      "AGUA VALTORRE GARRAFA 5L",
      "AGUA SOLAN CABRAS 1.5L",
      "AGUA SOLAN DE CABRAS S/G 5L GFA",
      "AGUA GOURMET CON GAS 0.5L",
      "AGUA GOURMET CON GAS 1.5L",
    ],
  },
  {
    name: "REFRESCOS LATAS",
    products: [
      "COCA COLA LATA 33CL",
      "COCA COLA ZERO LATA 33CL",
      "COCA COLA ZERO S/CAF 33CL",
      "FANTA NARANJA LATA 33CL",
      "FANTA LIMON LATA 33CL",
      "AQUARIUS NARANJA LATA 33CL",
      "AQUARIUS LIMON LATA 33CL",
      "SEVEN UP LATA 33CL",
      "PEPSI COLA LATA 33CL",
      "NESTEA MARACUYA LATA 33CL",
      "NESTEA LIMON LATA 33CL",
      "NESTEA FRUTOS ROJOS LATA 33CL",
      "TONICA LATA 33CL",
      "SIMON LIFE NARANJA LATA 33CL",
      "SIMON LIFE MANGO LATA 33CL",
      "TINTO VERANO LIMON CASERA LATA",
    ],
  },
  {
    name: "REFRESCOS 2L / 1.5L",
    products: [
      "COCA COLA 2L",
      "COCA COLA ZERO 2L",
      "COCA ZERO S/CAFEINA 2L",
      "FANTA NARANJA 2L",
      "FANTA LIMON 2L",
      "SEVEN UP 2L",
      "REVOLTOSA COLA 2L",
      "REVOLTOSA NARANJA 2L",
      "REVOLTOSA LIMON 2L",
      "CASERA LIMON 1.5L",
      "CASERA NARANJA 1.5L",
      "CASERA BLANCA 1.5L",
      "AQUARIUS NARANJA 1.5L",
      "AQUARIUS BLANCO 1.5L",
      "NESTEA MARACUYA 1.5L",
      "NESTEA 1.5L",
      "NESTEA FRUTOS ROJOS 1.5L",
      "SIMON LIFE NARANJA 1.5L",
      "SIMON LIFE MANDARINA 1.5L",
      "SIMON LIFE MANGO 1.5L",
      "PEPSI COLA 1.75L",
      "TONICA SCHWEPPES 1L",
      "LIMON&NADA MINUTE MAID 1L",
    ],
  },
  {
    name: "ZUMOS",
    products: [
      "BIOFRUTA PASCUAL TROPICAL P3",
      "BIOFRUTA PASCUAL PACIFICO P3",
      "BIOFRUTA PASCUAL IBIZA P3",
      "BIOFRUTA PASCUAL 1L TROPI",
      "FUNC. D.SIMON TROPICAL P6",
      "FUNC. D.SIMON CARIBE P6",
      "FUNC. D.SIMON MEDITERRANEO P6",
      "ZUMO D.SIMON PIÑA P6 200",
      "ZUMO D.SIMON MELOCOTON P6 200",
      "ROSTOY MELOCOTON 33CL",
      "ROSTOY PIÑA COCO 33CL",
      "ZUMO JUVER PIÑA 850ML",
      "ZUMO JUVER MELOCOTON 850ML",
      "ZUMO JUVER NARANJA 850ML",
    ],
  },
  {
    name: "KUYX 3L",
    products: [
      "KUYX NARANJA 3L",
      "KUYX TROPICAL 3L",
      "KUYX MANDARINA 3L",
      "KUYX FRUTOS DEL BOSQUE 3L",
      "KUYX PIÑA 3L",
      "KUYX PIÑA COCO 3L",
      "KUYX OCEANICO 3L",
    ],
  },
  {
    name: "KUYX 330ML",
    products: [
      "KUYX 330ML NARANJA",
      "KUYX 330ML MANDARINA",
      "KUYX 330ML TROPICAL",
      "KUYX 330ML PIÑA",
      "KUYX 330ML OCEANICO",
      "KUYX 330ML MANGO",
      "KUYX 330ML FRUTOS ROJOS",
    ],
  },
  {
    name: "ENERGÉTICAS",
    products: [
      "CAMALEON 250ML",
      "CAMALEON GRANDE 50CL",
      "POWER KING 25CL",
      "POWER KING GRANDE 50CL",
      "RED BULL 250ML",
      "RED BULL SIN AZUCAR 250ML",
      "MONSTER VERDE LATA 50CL",
      "MONSTER ULTRA WHITE 50CL",
      "MONSTER ZERO VERDE 50CL",
      "MONSTER MANGO 50CL",
      "MONSTER AZUL 50CL",
      "BURN LATA 500ML",
      "LOCURA LATA 50CL",
      "LOCURA COCO LATA 50CL",
      "LOCURA ENERGY DRINK PEQUEÑO",
      "ENERDRINK COCO Y PIÑA",
      "ENERDRINK FRESA SALVAJE",
      "ENERDRINK MORA",
      "ENERDRINK MANZANA",
      "ENERDRINK TARTA QUESO",
      "ENERDRINK COCO LOCO",
      "POWERADE ICE 50CL",
      "POWERADE BLOOD 50CL",
      "ENERYETI PIRULETA 500ML",
    ],
  },
  {
    name: "CERVEZAS",
    products: [
      "CERVEZA CRUZCAMPO LATA 33CL",
      "CERVEZA ESTRELLA SUR LATA",
      "ESTRELLA 0.0 LATA 33CL",
      "CRUZCAMPO S/A LATA 33CL",
      "RADLER LIMON CRUZCAMPO LATA",
      "HEINEKEN LATA 33CL",
      "CERVEZA CRUZCAMPO 50CL",
      "ESTRELLA SUR 50CL LATA GRANDE",
      "CERVEZA CRUZCAMPO CHAPA 1L",
      "CERVEZA CRUZ DEL SUR 1L",
      "CERVEZA ESTRELLA 1L",
      "CERVEZA ESTRELLA 0.0 1L",
      "CRUZCAMPO ROSCA 1L",
      "CRUZCAMPO 750ML",
      "CRUZCAMPO PACK 6",
      "CRUZCAMPO BOTELLIN CAJA 24",
      "CRUZCAMPO BOTELLIN CAJA 20",
      "CRUZCAMPO SIN ALCOHOL PACK",
      "ESTRELLA DEL SUR PACK 6",
    ],
  },
  {
    name: "VINOS Y LICORES",
    products: [
      "VINO BLANCO GRAN DUQUE 1L",
      "VINO TINTO GRAN DUQUE 1L",
      "VINO BLANCO RIVILLA 2L",
      "VINO TINTO RIVILLA 2L",
      "VINO TINTO DON SIMON 1L",
      "VINO BLANCO DON SIMON 1L",
      "VINO RIOJA SEÑORES 3/4",
      "TINTO VERANO CASERA 1.5L",
      "RON CACIQUE 70CL",
      "RON BARCELO AÑEJO 70CL",
      "RON NEGRITA 70CL",
      "WHISKY WHITE LABEL 70CL",
      "WHISKY BALLANTINES 70CL",
      "WHISKY J&B 70CL",
      "WHISKY JHONNIE WALKER E/ROJA 3/4",
      "WHISKY JHONNIE WALKER E/ROJA MINIATURA",
      "GINEBRA LARIOS 1L",
      "GINEBRA BEEFEATER 70CL",
      "BRANDY TERRY 1L",
      "ANIS CASTELLANA 70CL",
      "LICOR MIURA 70CL",
      "MINI WHISKY WHITE LABEL",
      "MINI RON BARCELO",
      "MINI BALLANTINES",
    ],
  },
  {
    name: "LÁCTEOS",
    products: [
      "LECHE COVAP ENTERA 1L",
      "LECHE COVAP SEMIDESNATADA 1L",
      "LECHE COVAP SIN LACTOSA ENTERA 1L",
      "LECHE COVAP SIN LACTOSA SEMI 1L",
      "LECHE PULEVA ENTERA 1L",
      "LECHE PULEVA SEMI 1L",
      "BATIDO PULEVA CACAO 1L",
      "BATIDO PULEVA FRESA 1L",
      "BATIDO PULEVA VAINILLA 1L",
      "BAT.PULEVA CACAO P6 200",
      "BAT.PULEVA FRESA P6 200",
      "BAT.PULEVA VAINILLA P6 200",
      "CAFE FRIO LANDESSA CAPUCHINO",
      "CAFE FRIO LANDESSA CON LECHE",
      "CAFE FRIO LANDESSA SOLO",
      "CAFE FRIO LANDESSA CARAMELO",
      "CAFE FRIO LANDESSA VAINILLA",
      "MARGARINA TULIPAN 225G",
      "MARGARINA TULIPAN 400G",
      "NATA COCINA RENY PICOT 200ML",
    ],
  },
  {
    name: "ALIMENTACIÓN",
    products: [
      "ACEITE GIRASOL ROSIL 1L",
      "ACEITE GIRASOL ROSIL 5L",
      "ACEITE OLIVA VIRGEN ROSIL 1L",
      "AZUCAR 1KG",
      "SAL FINA 1KG",
      "SAL GRUESA CHALUPA 1KG",
      "TOMATE FRITO ORLANDO 400G",
      "TOMATE FRITO ORLANDO 800G",
      "TOMATE FRITO ORLANDO 350G",
      "TOMATE FRITO MARTINETE 810G",
      "TOMATE FRITO MARTINETE 400G",
      "TOMATE TRITURADO MARTINETE 810G",
      "TOMATE TRITURADO MARTINETE 400G",
      "YATEKOMO POLLO 60G",
      "CALDO G.BLANCA POLLO 1L",
      "GARBANZOS FRASCO 560G",
      "PAN RALLADO PANAERAS 300G",
      "ARROZ BRILLANTE 1KG",
      "ARROZ BRILLANTE 500G",
      "MAYONESA YBARRA 450G",
      "KETCHUP ORLANDO 265G",
    ],
  },
  {
    name: "APERITIVOS",
    products: [
      "PIPAS SEVILLANAS",
      "REBUJINAS SEVILLANAS 120G",
      "RISKETOS 120G",
      "BUSCALIOS BARBACOA",
      "TOSTAITOS SEVILLANOS",
      "PATATAS HISPALANA 140G",
      "PRINGLES CREAM ONION 70G",
      "PRINGLES ORIGINAL 70G",
      "PRINGLES ORIGINAL 165G",
      "BOLAS MATCHBALL 105G",
      "REVUELTO CARTUJANO 120G",
      "PATATAS RUEDAS 100G",
      "TOTAS ESTILO CASERO 100G",
      "TOTAS CAMPESINA 100G",
      "GOFRE CON CHOCO 110G",
      "PALOMITA KETCHUP MOSTAZA 8U",
    ],
  },
  {
    name: "LIMPIEZA",
    products: [
      "LEJIA PINO PERFUMADA KIRIKO 2L",
      "LEJIA AMARILLA KIRIKO 2L",
      "LEJIA LAVADORA KIRIKO 2L",
      "LEJIA + DETERGENTE KIRIKO 2L",
      "LEJIA LIMON PERFUMADA KIRIKO 2L",
      "DETERGENTE KIRIKO MARSELLA 3L",
      "DETERGENTE KIRIKO BASICO 2.8L",
      "LAVAVAJILLAS FLOTA 1.1L",
      "FLOTA VAJILLAS 750ML",
      "FREGASUELOS PINO KIRIKO 1.5L",
      "FREGASUELOS DAMA NOCHE 1.5L",
      "FREGASUELOS J.MARSELLA 1.5L",
      "FREGASUELOS SPA 1.5L",
      "LIMPIACRISTALES KIRIKO 500ML",
      "PAPEL HIGIENICO FAMADIS 6R",
      "HIGIENICO ECONOMICO P12",
      "SECAMANO BUENO",
      "TOALLITAS BEBE 120U",
      "ESCOBA PRIMER PRECIO",
      "PASTA COLGATE 75ML",
    ],
  },
  {
    name: "VARIOS",
    products: [
      "ANDALUZA CAJA 47U",
      "ANDALUZA GOURMET CAJA 54U",
      "VIENA ARTESANA CAJA 65U",
      "HUEVOS P12 L",
      "BANDEJA T89 NEGRA",
      "BOLSA VERDE OFERTA 42X53",
      "BOLSA BLANCA 42X53 1KG",
      "ROLLO COMPOSTABLE 30X40 1KG",
      "BOLSA BASURA COMUNIDAD 180L",
      "BOLSA BASURA NORMAL 30L",
      "BOLSAS PANADERIA 30X43",
      "SERVILLETA DOBLE BLANCA P2",
      "ARENA GATO MIC&FRIENDS 5KG",
      "VASO PLASTICO 350CC",
      "PAPEL OCB 100U",
      "CARBON",
      "PAPEL ALUMINIO IND",
      "FILM INDUSTRIAL 200M",
      "PASTILLAS ENCENDIDO",
      "ESTUCHES DE LOS REYES",
    ],
  },
  {
    name: "CHARCUTERÍA",
    products: [
      "CHOPPED TERNERA CAMPOFRIO KG",
      "CHOPPED CERDO CAMPOFRIO KG",
      "QUESO GOUDA BARRA KG",
      "QUESO SEMI PUROVI 1.50E",
      "POLLO RELLENO CARLOTEÑA KG",
      "POLLO RELLENO BLANCE KG",
      "LOMO AL HORNO FAMADESA KG",
      "MAGRETA AL AJILLO FAMADESA KG",
      "JAMON COCIDO 1A KG",
      "PALETA REVILLA KG",
      "PECHUGA PAVO NOEL KG",
      "PECHUGA PAVOFRIO KG",
      "CHORIZO EXTRA VILLAR KG",
      "CHORIZO TRADICIONAL KG",
      "CHORIZO CULAR IBERICO KG",
      "SALCHICHON TURON KG",
      "CHOPPED BEEF CAMPOFRIO 95G",
      "CHOPPED CERDO CAMPOFRIO 95G",
      "MORTADELA SICILIANA 95G",
      "MORTADELA C/A CAMPOFRIO 95G",
      "JAMON CURADO NAVIDUL 50G",
      "PECHUGA PAVO CAMPOFRIO 70G",
      "JAMON COCIDO EXTRA 75G",
      "CHORIZO REVILLA 65G",
      "CHORIZO PAMPLONA REVILLA 65G",
      "SALAMI REVILLA 65G",
      "SALCHICHON REVILLA 65G",
      "TAQUITOS NAVIDUL 50G",
      "BACON O.MAYER 100G",
      "SALCHICHAS CAMPOFRIO FRANKFURT",
      "OFERTAS PIZZAS C.FRIO",
      "PIZZA CAMPOFRIO 4 QUESOS",
      "PIZZA CAMPOFRIO JAMON QUESO",
      "PIZZA CAMPOFRIO BOLOÑESA",
      "PIZZA CAMPOFRIO CARBONARA",
      "PIZZA CAMPOFRIO BARBACOA",
      "PIZZA JAMON BACON CEBOLLA",
      "PIZZA PEPPERONI CAMPOFRIO",
      "PIZZA POLLO KANSAS",
      "PIZZA POLLO MOSTAZA MIEL",
      "PIZZA SALSA MEXICANA",
    ],
  },
];

const hiddenProductsRaw = [];

const imageModules = import.meta.glob("./assets/productos/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const productImagesByIdnum = Object.fromEntries(
  Object.entries(imageModules).map(([path, src]) => {
    const fileName = path.split("/").pop();
    const idnum = Number(fileName.replace(/\.[^/.]+$/, ""));
    return [idnum, src];
  })
);

/* =========================
   ✅ SISTEMA FIJO DE IDNUM

   Ahora puedes escribir los productos de dos formas:

   1) Forma recomendada, con idnum fijo:
      { idnum: 1, name: "AGUA FUENTELAJARA 1.5L" }

   2) Forma antigua, solo texto:
      "AGUA FUENTELAJARA 1.5L"

   Si usas la forma recomendada, puedes mover el artículo de sitio
   y seguirá conservando su foto.

   Ejemplo:
      { idnum: 23, name: "COCA COLA 2L" }

   Foto correspondiente:
      23.jpg / 23.png / 23.webp
========================= */
const getProductName = (product) =>
  typeof product === "string" ? product : product.name;

const getProductIdnum = (product, fallbackIdnum) =>
  typeof product === "string" ? fallbackIdnum : product.idnum;

const fixedProduct = (idnum, name) => ({ idnum, name });

const normalizeForCompare = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ]+/gi, "")
    .trim();

const normalizeText = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const productMatchesSearch = (product, searchText) => {
  const normalizedProduct = normalizeText(product);
  const searchWords = normalizeText(searchText)
    .split(/[^a-z0-9ñ]+/i)
    .filter(Boolean);

  return searchWords.every((searchWord) =>
    normalizedProduct.includes(searchWord)
  );
};

let autoIdnum = 1;

const visibleProductsBase = departments.flatMap((department) =>
  department.products.map((productEntry) => {
    const name = getProductName(productEntry);
    const idnum = getProductIdnum(productEntry, autoIdnum);
    autoIdnum = Math.max(autoIdnum + 1, Number(idnum) + 1);

    return {
      id: `${department.name}-${name}`,
      idnum,
      name,
      department: department.name,
      hidden: false,
    };
  })
);

const visibleProductNamesForCompare = new Set(
  visibleProductsBase.map((product) => normalizeForCompare(product.name))
);

const hiddenProductsUnique = [];
        return !visibleProductNamesForCompare.has(normalizeForCompare(name));
      })
      .map((productEntry) => [normalizeForCompare(getProductName(productEntry)), productEntry])
  ).values()
);

const hiddenProductsFormattedBase = hiddenProductsUnique.map((productEntry) => {
  const name = getProductName(productEntry);
  const idnum = getProductIdnum(productEntry, autoIdnum);
  autoIdnum = Math.max(autoIdnum + 1, Number(idnum) + 1);

  return {
    id: `ARTÍCULOS BUSCADOS-${name}`,
    idnum,
    name,
    department: "ARTÍCULOS BUSCADOS",
    hidden: true,
  };
});

const products = [...visibleProductsBase, ...hiddenProductsFormattedBase];

// Lista para consultar qué foto corresponde a cada artículo.
// Abre la consola del navegador y verás: idnum, artículo y departamento.
console.table(
  products.map((product) => ({
    idnum: product.idnum,
    foto: `${product.idnum}.jpg`,
    articulo: product.name,
    departamento: product.department,
  }))
);

/* =========================
   🔧 CONVERTIDOR AUTOMÁTICO A SISTEMA FIJO

   1. Abre la consola del navegador (F12)
   2. Ejecuta:

      exportFixedProducts()

   3. Copia el resultado
   4. Sustituye tus departments actuales por el resultado

   El sistema convertirá automáticamente:

      "COCA COLA 2L"

   en:

      { idnum: 25, name: "COCA COLA 2L" }

========================= */
window.exportFixedProducts = () => {
  let counter = 1;

  const converted = departments.map((department) => ({
    name: department.name,
    products: department.products.map((product) => {
      if (typeof product === "string") {
        return {
          idnum: counter++,
