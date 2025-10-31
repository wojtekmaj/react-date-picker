type DividerProps = {
  children?: React.ReactNode;
};

export default function Divider({ children }: DividerProps): React.ReactElement {
  return (
    <span className="react-date-picker__inputGroup__divider" data-testid="divider">
      {children}
    </span>
  );
}
