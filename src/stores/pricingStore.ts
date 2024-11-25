export interface PricingPlan {
  name: string;
  price: string;
  receipts: number;
  features: string[];
}

export const defaultPlans: Record<string, PricingPlan> = {
  start: {
    name: "Start",
    price: "19",
    receipts: 10,
    features: ["Até 10 recibos", "Modelos básicos", "Suporte por email"]
  },
  gold: {
    name: "Ouro",
    price: "95",
    receipts: 50,
    features: ["Até 50 recibos", "Todos os modelos", "Suporte prioritário"]
  },
  supergold: {
    name: "Super Ouro",
    price: "290",
    receipts: 500,
    features: ["Até 500 recibos", "Todos os recursos", "Suporte VIP 24/7"]
  }
};