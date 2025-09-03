import { Tables } from "@/database.types";
import { Heart } from "lucide-react";

export default function Donations({
  campaigns,
  slug,
}: {
  campaigns: Tables<"donation_campaigns">[];
  slug: string;
}) {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-0">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-theme-gradient">
              Support Our Causes
            </h1>
            <p className="text-xl text-gray-600">
              Your generous donations help us maintain and grow our services to
              the community. Choose a campaign below to contribute.
            </p>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          {campaigns.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign: Tables<"donation_campaigns">) => (
                <a
                  href={`/${slug}/donation/${campaign.id}`}
                  key={campaign.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 block"
                >
                  <div className="relative h-48 overflow-hidden">
                    {campaign.image ? (
                      <img 
                        src={campaign.image} 
                        alt={campaign.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-theme-gradient/10 flex items-center justify-center">
                        <Heart className="w-16 h-16 text-theme opacity-70" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col h-[180px]">
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">{campaign.name}</h3>
                    
                    <div className="mt-auto">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-theme h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (campaign.amount_raised / campaign.target_amount) * 100)}%` }}
                        ></div>
                      </div>
                      
                      <p className="font-semibold text-lg truncate">
                        ${campaign.amount_raised.toLocaleString()} donated of ${campaign.target_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              No active donation campaigns at the moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
