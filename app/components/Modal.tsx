"use client";

import {
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export default function Modal({ children }: { children: ReactNode }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({
  children,
  opens: opensWindowName,
}: {
  children: ReactElement<{ onClick?: () => void }>;
  opens: string;
}) {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal.Open must be used within a Modal");
  }

  return cloneElement(children, {
    onClick: () => context.open(opensWindowName),
  });
}

function Close({
  children,
}: {
  children: ReactElement<{ onClick?: () => void }>;
}) {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal.Open must be used within a Modal");
  }

  return cloneElement(children, {
    onClick: () => context.close(),
  });
}

function Window({ children, name }: { children: ReactNode; name: string }) {
  const context = useContext(ModalContext);

  useEffect(() => {
    if (!context || context.openName !== name) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        context.close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [context, name]);

  if (!context) {
    throw new Error("Modal.Window must be used within a Modal");
  }

  if (context.openName !== name) {
    return null;
  }

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          context.close();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-950/50 p-4"
    >

      <div className="relative flex max-h-[calc(100dvh-2rem)] w-full min-w-0 max-w-7xl items-center justify-center overflow-hidden">
        {children}
      </div>
    </div>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Close = Close;
Modal.Window = Window;
