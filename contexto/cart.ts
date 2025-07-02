export interface CartItem {
  id: string
  producto: string
  cantidad: number
  precio: number
  subtotal: number
}

export interface CartState {
  items: CartItem[]
  total: number
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "subtotal"> }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; cantidad: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "CLEAR_CART" }