import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

type Match = {
  _id: string;
  title?: string;
  requiredSkills?: string[]; // Backend returns this
  wasteType?: string; // Dummy data had this
  location: string;
  NGOID?: {
    _id: string;
    name: string;
    location: string;
  }; 
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:2000/api/matches", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            toast.error("Access Denied: You must be a Volunteer to view matches.");
            throw new Error(`Access Denied (403): User role mismatch.`);
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const matchesData = Array.isArray(data) ? data : (data.data || []);
        
        setMatches(matchesData);
        
        if (matchesData.length === 0) {
          toast.info("No matches found based on your skills and location.");
        } else {
          toast.success(`Found ${matchesData.length} opportunities for you!`);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch matches:", err);
        // Do not set dummy matches on error
        toast.error("Failed to load matches");
      });
  }, []);

  const setDummyMatches = () => {
    const dummyMatches: Match[] = [
      { _id: "1", wasteType: "Plastic", location: "Delhi" },
      { _id: "2", wasteType: "E-Waste", location: "Noida" },
    ];

    setMatches(dummyMatches);
    toast.success("You have new match suggestions");
  };

  const handleChat = (match: Match) => {
    // If it's a real match with NGOID, navigate to chat with that NGO
    if (match.NGOID && match.NGOID._id) {
        navigate(`/dashboard/volunteer/messages?userId=${match.NGOID._id}&name=${encodeURIComponent(match.NGOID.name)}`);
    } else {
        // Fallback for dummy data
        toast.info("This is a demo match.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Matched Opportunities</h1>

      {matches.length === 0 && (
        <p className="text-muted-foreground">No matches found</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {matches.map((match) => (
          <Card key={match._id} className="hover:shadow-md transition">
            <CardContent className="p-4 space-y-3">
              
              <div className="flex items-center justify-between">
                <span className="font-semibold">{match.title || "Waste Collection"}</span>
                {/* Display either exact wasteType or joined skills */}
                <Badge variant="secondary">
                  {match.wasteType || (match.requiredSkills?.join(", ") || "General")}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold">Location</span>
                <span className="text-muted-foreground">
                  📍 {match.location}
                </span>
              </div>
              
              {match.NGOID && (
                  <div className="text-sm text-muted-foreground">
                      Organization: <span className="font-medium text-foreground">{match.NGOID.name}</span>
                  </div>
              )}

            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => handleChat(match)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat with Organizer
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
