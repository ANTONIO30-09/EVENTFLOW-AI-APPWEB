import { InventoryCategory } from "./types";

export interface CatalogEntry {
  name: string;
  category: InventoryCategory;
}

export const INVENTORY_CATALOG: CatalogEntry[] = [
  // Mobiliario
  { name: "Mesa redonda", category: "mobiliario" },
  { name: "Mesa rectangular", category: "mobiliario" },
  { name: "Mesa alta cóctel", category: "mobiliario" },
  { name: "Mesa baja lounge", category: "mobiliario" },
  { name: "Silla Tiffany", category: "mobiliario" },
  { name: "Silla Crossback", category: "mobiliario" },
  { name: "Silla fantasma", category: "mobiliario" },
  { name: "Silla ejecutiva", category: "mobiliario" },
  { name: "Sofá lounge", category: "mobiliario" },
  { name: "Sillón trono", category: "mobiliario" },
  { name: "Reclinatorio", category: "mobiliario" },
  { name: "Atril con logo", category: "mobiliario" },
  { name: "Mantel", category: "mobiliario" },
  { name: "Servilleta de tela", category: "mobiliario" },

  // Audio y sonido
  { name: "Parlante", category: "audio" },
  { name: "Consola de audio", category: "audio" },
  { name: "Micrófono inalámbrico", category: "audio" },
  { name: "Sistema de traducción simultánea", category: "audio" },

  // Iluminación
  { name: "Luz robótica", category: "iluminacion" },
  { name: "Luz arquitectónica", category: "iluminacion" },
  { name: "Túnel de luces LED", category: "iluminacion" },
  { name: "Letras luminosas gigantes", category: "iluminacion" },

  // Vajilla y cristalería
  { name: "Plato de sitio", category: "vajilla" },
  { name: "Vajilla completa", category: "vajilla" },
  { name: "Cubertería", category: "vajilla" },
  { name: "Copa de agua", category: "vajilla" },
  { name: "Copa de vino", category: "vajilla" },
  { name: "Copa de champán", category: "vajilla" },
  { name: "Hielera", category: "vajilla" },
  { name: "Bandeja de mozo", category: "vajilla" },
  { name: "Chafing dish", category: "vajilla" },
  { name: "Dispensador de café", category: "vajilla" },

  // Estructuras y escenario
  { name: "Toldo", category: "estructuras" },
  { name: "Tarima", category: "estructuras" },
  { name: "Pista de baile", category: "estructuras" },
  { name: "Valla de seguridad", category: "estructuras" },
  { name: "Arco floral", category: "estructuras" },
  { name: "Gazebo", category: "estructuras" },
  { name: "Backing", category: "estructuras" },
  { name: "Banner roll-up", category: "estructuras" },
  { name: "Bandera institucional", category: "estructuras" },

  // Tecnología y registro
  { name: "Pantalla LED", category: "tecnologia" },
  { name: "Proyector", category: "tecnologia" },
  { name: "Escáner de acreditación", category: "tecnologia" },
  { name: "Tablet", category: "tecnologia" },
  { name: "Puntero láser", category: "tecnologia" },
  { name: "Teleprompter", category: "tecnologia" },
  { name: "Cabina de fotos", category: "tecnologia" },
  { name: "Plataforma 360", category: "tecnologia" },

  // Decoración y ambientación
  { name: "Centro de mesa alto", category: "decoracion" },
  { name: "Centro de mesa bajo", category: "decoracion" },
  { name: "Vela", category: "decoracion" },
  { name: "Candelabro", category: "decoracion" },
  { name: "Candelabro de 15 velas", category: "decoracion" },
  { name: "Mesa de tortas", category: "decoracion" },
  { name: "Cake topper", category: "decoracion" },
  { name: "Libro de firmas", category: "decoracion" },
  { name: "Teléfono de audio para mensajes", category: "decoracion" },
  { name: "Cartel de bienvenida", category: "decoracion" },
  { name: "Almohadón para zapatos", category: "decoracion" },
  { name: "Cotillón", category: "decoracion" },
  { name: "Glitter bar", category: "decoracion" },
  { name: "Máquina de humo bajo", category: "decoracion" },
  { name: "Máquina de chispas frías", category: "decoracion" },
  { name: "Burbujero", category: "decoracion" },

  // Logística y señalética
  { name: "Generador eléctrico", category: "logistica" },
  { name: "Protector de cables", category: "logistica" },
  { name: "Estufa tipo hongo", category: "logistica" },
  { name: "Ventilador", category: "logistica" },
  { name: "Nebulizador", category: "logistica" },
  { name: "Señalética de baños", category: "logistica" },
  { name: "Señalética de salida de emergencia", category: "logistica" },
  { name: "Plano de mesas", category: "logistica" },
  { name: "Número de mesa", category: "logistica" },
];

export const findCatalogEntry = (name: string) => {
  const normalized = name.trim().toLowerCase();
  return INVENTORY_CATALOG.find((entry) => entry.name.toLowerCase() === normalized);
};
