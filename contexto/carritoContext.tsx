import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { CartState, CartAction, CartItem } from "./cart";

// Estado inicial
const initialState: CartState = {
  items: [],
  total: 0,
};

// Función para calcular el total del carrito
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.subtotal, 0);
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { id, producto, cantidad, precio } = action.payload;

      // Verificar si el producto ya existe
      const existingItemIndex = state.items.findIndex((item) => item.id === id);

      if (existingItemIndex >= 0) {
        // Si existe, actualizar la cantidad
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newCantidad = item.cantidad + cantidad;
            return {
              ...item,
              cantidad: newCantidad,
              subtotal: newCantidad * item.precio,
            };
          }
          return item;
        });

        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      } else {
        // Si no existe, agregar nuevo item
        const newItem: CartItem = {
          id,
          producto,
          cantidad,
          precio,
          subtotal: cantidad * precio,
        };

        const updatedItems = [...state.items, newItem];

        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }
    }

    case "UPDATE_QUANTITY": {
      const { id, cantidad } = action.payload;

      if (cantidad <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        const updatedItems = state.items.filter((item) => item.id !== id);
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            cantidad,
            subtotal: cantidad * item.precio,
          };
        }
        return item;
      });

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "REMOVE_ITEM": {
      const { id } = action.payload;
      const updatedItems = state.items.filter((item) => item.id !== id);

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "CLEAR_CART": {
      return initialState;
    }

    default:
      return state;
  }
};

// Contexto
const CartContext = createContext<
  | {
      state: CartState;
      addItem: (item: Omit<CartItem, "subtotal">) => void;
      updateQuantity: (id: string, cantidad: number) => void;
      removeItem: (id: string) => void;
      clearCart: () => void;
    }
  | undefined
>(undefined);

// Provider
interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ( {children}:CartProviderProps ) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: Omit<CartItem, "subtotal">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const updateQuantity = (id: string, cantidad: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, cantidad } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }

  return context;
};
