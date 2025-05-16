
import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { CheckCircle, Loader, AlertTriangle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import { StudentData } from "@/types/student";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import WaitingForApproval from "@/components/WaitingForApproval";

const StudentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentData = location.state?.studentData as StudentData;
  const [processingApproval, setProcessingApproval] = useState(false);
  const [permitStatus, setPermitStatus] = useState<'valid' | 'approved'>(
    studentData?.feesBalance === 0 ? 'valid' : 'valid'
  );
  const [scanHistory, setScanHistory] = useState<Array<{
    invigilator: string;
    timestamp: string;
    status: 'approved';
    staffId: string;
  }>>([]);
  
  // Check if admin has approved the exam
  const [examApproved, setExamApproved] = useState<boolean>(false);
  // Check if exam is expired (more than 4 hours since approval)
  const [examExpired, setExamExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  
  // Force state for demo purposes
  const forceState = location.state?.forceState;

  useEffect(() => {
    // Simulate checking for admin approval
    const checkExamApproval = () => {
      setLoading(true);
      // This would be an API call in a real application
      setTimeout(() => {
        // For demo purposes, use the forceState if provided
        if (forceState === "waiting") {
          setExamApproved(false);
          setExamExpired(false);
        } else if (forceState === "expired") {
          setExamApproved(true);
          setExamExpired(true);
        } else {
          setExamApproved(true);
          setExamExpired(false);
        }
        setLoading(false);
      }, 1000);
    };

    checkExamApproval();
  }, [forceState]);

  if (!studentData) {
    return <Navigate to="/scan" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8 text-university-blue" />
        <span className="ml-2">Checking exam status...</span>
      </div>
    );
  }

  // If exam not approved, show waiting screen
  if (!examApproved) {
    return <WaitingForApproval />;
  }

  // If exam expired (more than 4 hours since approval), show expired screen
  if (examExpired) {
    return <ExamExpired />;
  }

  const isPermitValid = true; // All students have cleared fees
  const isApproved = permitStatus === 'approved';

  const handleApprove = () => {
    setProcessingApproval(true);
    
    // Simulate API call
    setTimeout(() => {
      setPermitStatus('approved');
      
      // Add current invigilator to scan history
      const newScanRecord = {
        invigilator: user?.name || "Dr. Mugisha Joel",
        timestamp: new Date().toLocaleString(),
        status: 'approved' as const,
        staffId: user?.regNumber || "24/STAFF/001"
      };
      
      // Add to history with newest at the top
      setScanHistory([newScanRecord, ...scanHistory]);
      
      setProcessingApproval(false);
      toast.success("Permit approved successfully!");
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-university-blue text-white p-6">
        <h1 className="text-2xl font-bold">Student Details</h1>
      </div>

      {/* Scan history */}
      {scanHistory.length > 0 && (
        <div className="p-4 space-y-2">
          {scanHistory.map((record, index) => (
            <div 
              key={index} 
              className="p-4 mb-2 bg-green-50 border-l-4 border-green-500"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="font-medium">
                    Approved by: {record.invigilator}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Staff ID: {record.staffId} • Time: {record.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4">
        <Card className="p-6 neuro-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Student Number: {studentData.id || studentData.regNumber}</h2>
              <p className="text-muted-foreground">Registration Number: {studentData.regNumber}</p>
            </div>
            <Badge variant={isPermitValid ? "default" : "destructive"}>
              {isPermitValid ? "VALID" : "INVALID"}
            </Badge>
          </div>

          {isPermitValid && !isApproved && (
            <div className="mt-6 p-4 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Permit Valid</span>
              </div>
              <p className="mt-2 text-sm">
                Student is eligible to take the exam.
              </p>
            </div>
          )}

          <div className="mt-6">
            <Button 
              onClick={handleApprove} 
              className="w-full bg-university-green hover:bg-university-green/90"
              disabled={processingApproval || isApproved}
            >
              {processingApproval ? "Processing..." : isApproved ? "Approved" : "Approve"}
            </Button>
          </div>
        </Card>
      </div>

      <NavBar />
    </div>
  );
};

// Exam Expired Component
const ExamExpired = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/90">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="mb-6">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-university-orange" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold">Exam Session Expired</h1>
        
        <div>
          <p className="text-muted-foreground mb-4">
            This exam session has expired. The verification window was only available for 4 hours after admin approval.
          </p>
        </div>
        
        <Alert className="mt-8 border-university-orange/30 bg-university-orange/10">
          <AlertDescription className="text-sm">
            Please contact the exam administrator if you need to verify students for this exam.
          </AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          className="mt-6 hover:bg-university-blue/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
