export const ProfileButton = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="shadow-sm bg-zinc-100/50 w-full p-3 py-4 rounded-md text-zinc-600 font-medium flex items-center justify-between cursor-pointer select-none">
      {children}
    </div>
  );
};
