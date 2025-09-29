import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Judge } from "@shared/schema";
import { AlertTriangle, CheckCircle, TriangleAlert } from "lucide-react";

interface JudgeCardProps {
  judge: Judge;
}

export default function JudgeCard({ judge }: JudgeCardProps) {
  const getRiskIcon = () => {
    switch (judge.riskLevel) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "moderate":
        return <TriangleAlert className="h-4 w-4 text-amber-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getRiskColor = () => {
    switch (judge.riskLevel) {
      case "high":
        return "bg-red-100";
      case "moderate":
        return "bg-amber-100";
      case "low":
        return "bg-blue-100";
      case "excellent":
        return "bg-green-100";
    }
  };

  const getPrisonRateColor = () => {
    if (judge.prisonRate >= 40) return "text-red-500";
    if (judge.prisonRate >= 35) return "text-amber-500";
    return "text-green-500";
  };

  const getReversalRateColor = () => {
    if (judge.reversalRate >= 20) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <Card className="border-periwinkle/20 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{judge.name}</h3>
            <p className="text-secondary-text text-sm">
              {judge.county} County {judge.court}
            </p>
          </div>
          <div className={`p-2 rounded-full ${getRiskColor()}`}>
            {getRiskIcon()}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-secondary-text">Prison Rate</span>
            <span className={`font-medium ${getPrisonRateColor()}`}>
              {judge.prisonRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-text">Cases (5yr)</span>
            <span className="font-medium">{judge.totalCases.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-text">Appeal Rate</span>
            <span className="font-medium">{judge.appealRate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary-text">Reversal Rate</span>
            <span className={`font-medium ${getReversalRateColor()}`}>
              {judge.reversalRate.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <Button className="w-full mt-4 bg-slate-blue hover:bg-slate-blue/90">
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
}
