import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { FileText, Receipt, FileSignature, CreditCard, User, FileSpreadsheet } from "lucide-react";

const TopMenu = () => {
  const navigate = useNavigate();

  const ListItem = ({
    className,
    title,
    children,
    icon: Icon,
    onClick,
  }: {
    className?: string;
    title: string;
    children: React.ReactNode;
    icon: any;
    onClick: () => void;
  }) => {
    return (
      <li onClick={onClick}>
        <NavigationMenuLink asChild>
          <a
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <div className="text-sm font-medium leading-none">{title}</div>
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  };

  return (
    <NavigationMenu className="max-w-full w-full justify-start px-4 hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Recibos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <ListItem
                title="Gerar Recibo"
                icon={Receipt}
                onClick={() => navigate("/")}
              >
                Crie recibos profissionais com verificação digital
              </ListItem>
              <ListItem
                title="Promissórias"
                icon={FileSignature}
                onClick={() => navigate("/promissory")}
              >
                Gere notas promissórias com garantia
              </ListItem>
              <ListItem
                title="Gerenciar Recibos"
                icon={FileSpreadsheet}
                onClick={() => navigate("/receipts")}
              >
                Visualize e gerencie todos os seus recibos
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Minha Conta</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <ListItem
                title="Dashboard"
                icon={FileText}
                onClick={() => navigate("/dashboard")}
              >
                Visualize seus recibos e estatísticas
              </ListItem>
              <ListItem
                title="Perfil"
                icon={User}
                onClick={() => navigate("/dashboard")}
              >
                Gerencie suas informações e preferências
              </ListItem>
              <ListItem
                title="Planos"
                icon={CreditCard}
                onClick={() => navigate("/prices")}
              >
                Conheça nossos planos e preços
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopMenu;