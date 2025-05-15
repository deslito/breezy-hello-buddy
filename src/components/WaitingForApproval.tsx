
import React from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WaitingForApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/90">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="animate-pulse mb-6">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-university-orange" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold animate-fade-in">Waiting for Admin Approval</h1>
        
        <div className="animate-fade-in delay-100">
          <p className="text-muted-foreground mb-4">
            The exam session needs to be approved by an administrator before you can verify students.
          </p>
        </div>
        
        <div className="flex justify-center mt-4 animate-fade-in delay-200">
          <div className="relative w-64 h-2 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-university-orange animate-loading-bar"></div>
          </div>
        </div>
        
        <Alert className="mt-8 animate-fade-in delay-300 border-university-orange/30 bg-university-orange/10">
          <AlertDescription className="text-sm">
            Please contact the exam administrator to approve this exam session.
          </AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          className="mt-6 animate-fade-in delay-400 hover:bg-university-blue/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default WaitingForApproval;
