CREATE TABLE `categoria` (
	`id_categoria` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `cliente` (
	`id_cliente` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`celular` text NOT NULL,
	`correo` text
);
--> statement-breakpoint
CREATE TABLE `detalle_venta` (
	`id_detalle` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_venta` integer NOT NULL,
	`id_producto` integer NOT NULL,
	`cantidad` integer NOT NULL,
	`precio_unitario` real NOT NULL,
	`subtotal` real NOT NULL,
	FOREIGN KEY (`id_venta`) REFERENCES `venta`(`id_venta`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_producto`) REFERENCES `producto`(`id_producto`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `producto` (
	`id_producto` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codigo` text NOT NULL,
	`nombre` text NOT NULL,
	`imagen` text NOT NULL,
	`descripcion` text,
	`precio` real NOT NULL,
	`stock` integer NOT NULL,
	`id_categoria` integer NOT NULL,
	FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `producto_codigo_unique` ON `producto` (`codigo`);--> statement-breakpoint
CREATE TABLE `vendedor` (
	`id_vendedor` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`celular` text NOT NULL,
	`correo` text,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `venta` (
	`id_venta` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fecha` text DEFAULT CURRENT_TIMESTAMP,
	`total` real NOT NULL,
	`id_cliente` integer NOT NULL,
	`id_vendedor` integer NOT NULL,
	FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor`(`id_vendedor`) ON UPDATE no action ON DELETE no action
);
