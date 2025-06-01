import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";

// Tabla: Categoria
export const categoria = sqliteTable("categoria", {
  idCategoria: integer("id_categoria").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
});

// Tabla: Producto
export const producto = sqliteTable("producto", {
  idProducto: integer("id_producto").primaryKey({ autoIncrement: true }),
  codigo: text("codigo").notNull().unique(),
  nombre: text("nombre").notNull(),
  image: text("imagen").notNull(),
  descripcion: text("descripcion"),
  price: real("precio").notNull(),
  cantidad: integer("stock").notNull(),
  idCategoria: integer("id_categoria")
    .references(() => categoria.idCategoria)
    .notNull(),
});

// Tabla: Cliente
export const cliente = sqliteTable("cliente", {
  idCliente: integer("id_cliente").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  celular: text("celular").notNull(),
  correo: text("correo"),
});

// Tabla: Vendedor
export const vendedor = sqliteTable("vendedor", {
  idVendedor: integer("id_vendedor").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  celular: text("celular").notNull(),
  correo: text("correo"),
  password: text("password").notNull(),
});

// Tabla: Venta
export const venta = sqliteTable("venta", {
  idVenta: integer("id_venta").primaryKey({ autoIncrement: true }),
  fecha: text("fecha").default(sql`CURRENT_TIMESTAMP`),
  total: real("total").notNull(),
  idCliente: integer("id_cliente")
    .references(() => cliente.idCliente)
    .notNull(),
  idVendedor: integer("id_vendedor")
    .references(() => vendedor.idVendedor)
    .notNull(),
});

// Tabla: DetalleVenta
export const detalleVenta = sqliteTable("detalle_venta",{
    idDetalle: integer("id_detalle").primaryKey({ autoIncrement: true }),
    idVenta: integer("id_venta")
      .references(() => venta.idVenta)
      .notNull(),
    idProducto: integer("id_producto")
      .references(() => producto.idProducto)
      .notNull(),
    cantidad: integer("cantidad").notNull(),
    precioUnitario: real("precio_unitario").notNull(),
    subtotal: real("subtotal").notNull(),
  },
  (table) => ({
    uniqueProductoEnVenta: primaryKey(table.idVenta, table.idProducto),
  })
);