import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const milestones = [
  "Round 1 → Enrollment & Kickoff",
  "Sweet 16 → Design & Development",
  "Elite 8 → Populating & QA",
  "Final 4 → Client Approval",
  "Championship → Pre-Launch & Website Launch! 🎉"
];

const milestoneColors = [
  "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-orange-200", "bg-purple-300"
];

const milestoneIcons = [
  "🚀", "🎨", "🛠️", "✅", "🎉"
];

const LOCAL_STORAGE_KEY = "marchMadnessBoard";

export default function MarchMadnessBoard() {
  const [progress, setProgress] = useState({});
  const [clients, setClients] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProgress(parsedData.progress);
      setClients(parsedData.clients);
    } else {
      const initialClients = Array(24).fill(null).map(() => ({ name: "", manager: "" }));
      setProgress(initialClients.reduce((acc, _, index) => ({ ...acc, [index]: 0 }), {}));
      setClients(initialClients.reduce((acc, _, index) => ({ ...acc, [index]: { name: "", manager: "" } }), {}));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ progress, clients }));
  }, [progress, clients]);

  const advanceClient = (index) => {
    setProgress((prev) => ({
      ...prev,
      [index]: Math.min(prev[index] + 1, milestones.length - 1)
    }));
  };

  const updateClient = (index, field, value) => {
    setClients((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value }
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">March Madness Website Launch!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(clients).map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`p-4 flex flex-col gap-2 shadow-lg rounded-lg ${milestoneColors[progress[index]]}`}>
              <CardContent>
                <input
                  type="text"
                  placeholder="Client Name"
                  value={clients[index]?.name || ""}
                  onChange={(e) => updateClient(index, "name", e.target.value)}
                  className="w-full p-2 border rounded-md text-sm mb-2"
                />
                <input
                  type="text"
                  placeholder="Project Manager"
                  value={clients[index]?.manager || ""}
                  onChange={(e) => updateClient(index, "manager", e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                />
                <p className="text-sm text-gray-800 flex items-center gap-2 mt-2">
                  <span className="text-xl">{milestoneIcons[progress[index]]}</span>
                  {milestones[progress[index]]}
                </p>
              </CardContent>
              <Button onClick={() => advanceClient(index)} className="bg-indigo-500 text-white hover:bg-indigo-600">Advance</Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
