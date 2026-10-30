export function DialogWindow({children}:{children: React.ReactNode}){
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
    <div className="bg-play-button/60 w-[740px] min-h-[250px] py-6 px-9 rounded-4xl backdrop-blur-sm">
    {children}
    </div>
  </div>
  );
}