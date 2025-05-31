import {sqliteTable, integer, text} from "drizzle-orm/sqlite-core"

export const tiendaSchema = sqliteTable("usuario", {
    id: integer("id").primaryKey(),
    nombre: text("nombre").notNull(),
    direccion: text("direccion").notNull(),
    telefono: text("telefono").notNull(),
    correo: text("correo").notNull(),
})

export const productoSchema = sqliteTable("producto", {
    id: integer("id").primaryKey(),
    nombre: text("nombre").notNull(),
    precio: integer("precio").notNull(),
    cantidad: integer("cantidad").notNull(),
    descripcion: text("descripcion").notNull(),
    imagen: text("imagen").notNull(),
})



