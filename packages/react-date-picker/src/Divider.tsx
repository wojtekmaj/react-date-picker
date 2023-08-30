import React from 'react';

type DividerProps = {
  children?: React.ReactNode;
};

export default function Divider({ children }: DividerProps) {
  return <span className="react-date-picker__inputGroup__divider">{children}</span>;
}
