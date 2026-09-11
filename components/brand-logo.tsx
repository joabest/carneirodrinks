export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/carneiro-drinks-logo.svg"
      alt="Carneiro Drinks"
      className={"object-contain " + className}
      draggable={false}
    />
  );
}
