import logoUrl from "@assets/TravelMate.ai Logo _1758536903515.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-card-border">
      <div className="flex items-center">
        <img 
          src={logoUrl} 
          alt="TravelMate.ai" 
          className="h-80"
          data-testid="img-logo"
        />
      </div>
    </header>
  );
}