import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  QrCode,
  CheckCircle,
  Shield,
  FileCheck,
  PenTool,
  History
} from "lucide-react";
import { LandingContent } from "@/components/admin/landing/types";

const iconMap: Record<string, React.ReactNode> = {
  QrCode: <QrCode className="h-6 w-6 text-primary" />,
  CheckCircle: <CheckCircle className="h-6 w-6 text-primary" />,
  Shield: <Shield className="h-6 w-6 text-primary" />,
  FileCheck: <FileCheck className="h-6 w-6 text-primary" />,
  PenTool: <PenTool className="h-6 w-6 text-primary" />,
  History: <History className="h-6 w-6 text-primary" />
};

const defaultContent: LandingContent = {
  heroTitle: "Recibos Autenticados com QR Code",
  heroDescription: "Sistema completo para gerenciamento de recibos autenticados com verificação via QR Code.",
  heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  features: [
    {
      title: "Autenticação via QR Code",
      description: "Verifique a autenticidade dos recibos instantaneamente através do QR Code.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      icon: "QrCode"
    },
    {
      title: "Verificação Autenticada",
      description: "Garanta a autenticidade dos seus recibos com nossa tecnologia avançada de verificação QR Code.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      icon: "Shield"
    },
    {
      title: "Segurança Garantida",
      description: "Sistema seguro e confiável para seus documentos importantes.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      icon: "Shield"
    },
    {
      title: "Recibos Profissionais",
      description: "Crie recibos com aparência profissional e autenticação digital.",
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07",
      icon: "FileCheck"
    },
    {
      title: "Assinatura Digital",
      description: "Adicione sua assinatura digital para maior segurança e autenticidade.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      icon: "PenTool"
    },
    {
      title: "Histórico Verificável",
      description: "Mantenha um histórico completo e verificável de todos os seus recibos.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      icon: "History"
    }
  ],
  ctaTitle: "Assine já e tenha recibos autenticados",
  ctaDescription: "Comece agora a emitir recibos com autenticação via QR Code"
};

const Landing = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<LandingContent>(defaultContent);

  useEffect(() => {
    loadLandingContent();
  }, []);

  const loadLandingContent = async () => {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("content")
      .eq("type", "landing")
      .single();

    if (error) {
      console.error("Error loading landing content:", error);
      return;
    }

    if (data?.content) {
      setContent(data.content as unknown as LandingContent);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {content.heroDescription}
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/register")}
                className="bg-primary hover:bg-primary/90 font-semibold"
              >
                Explore Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/prices")}
                className="border-primary text-primary hover:bg-primary/10 font-semibold"
              >
                Ver Preços
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={content.heroImage}
              alt="Sistema de Recibos Autenticados"
              className="rounded-lg shadow-2xl object-cover h-[400px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore Nossas Funcionalidades
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {iconMap[feature.icon] || <QrCode className="h-6 w-6 text-primary" />}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {content.ctaTitle}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {content.ctaDescription}
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/register")}
            className="bg-white text-primary hover:bg-gray-100 font-semibold"
          >
            Começar Gratuitamente
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
