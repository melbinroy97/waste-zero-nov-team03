import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Match = {
  _id: string;
  wasteType: string;
  location: string;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch("http://localhost:2000/api/matches")
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setDummyMatches();
        } else {
          setMatches(data);
          toast.success("You have new match suggestions");
        }
      })
      .catch(() => {
        setDummyMatches();
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
                <span className="font-semibold">Type of Waste</span>
                <Badge variant="secondary">{match.wasteType}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold">Location</span>
                <span className="text-muted-foreground">
                  📍 {match.location}
                </span>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
