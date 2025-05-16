
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCode, Clock, AlertTriangle } from "lucide-react";
import NavBar from "@/components/NavBar";
import { StudentData } from "@/types/student";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import PermitCard from "@/components/PermitCard";
import { useAuth } from "@/contexts/AuthContext";
import { studentData } from "@/types/studentData";

const ScanQRPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const [lastScannedPermit, setLastScannedPermit] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("regular");

  // Generic scan function for the main scan button
  const handleScan = (simulationState?: string) => {
    setScanning(true);
    setIsDrawerOpen(true);
    
    // Simulate QR code scanning with mock data
    setTimeout(() => {
      setScanning(false);
      
      // Get a random student from the studentData array
      const randomIndex = Math.floor(Math.random() * studentData.length);
      const student = studentData[randomIndex];
      
      const mockPermit = {
        id: `PERM-${student.studentNumber}`,
        studentNumber: student.studentNumber,
        regNumber: student.registrationNumber,
        status: "valid" as const,
        printDate: new Date().toISOString()
      };
      
      setLastScannedPermit(mockPermit);
      navigate("/student-details", { 
        state: { 
          studentData: {
            id: student.studentNumber,
            name: `${student.firstName} ${student.lastName}`,
            regNumber: student.registrationNumber,
            course: "Bachelor in Information Technology",
            gender: student.gender,
            programme: "Day",
            semester: "Year 2 Semester I",
            feesBalance: 0,
            permitStatus: "VALID",
            photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
          },
          forceState: simulationState
        }
      });
      toast.success(`QR Code for Student #${student.studentNumber} scanned successfully!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">QR Code Scanner</h1>

        <Tabs defaultValue="regular" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full border-b">
            <TabsTrigger value="regular" className="flex-1">Regular Scan</TabsTrigger>
            <TabsTrigger value="simulation" className="flex-1">Simulation</TabsTrigger>
          </TabsList>
          <TabsContent value="regular" className="py-4">
            {lastScannedPermit && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Last Scanned Permit</h2>
                <div className="bg-white rounded-lg p-4 shadow border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Student Number: {lastScannedPermit.studentNumber}</p>
                      <p className="text-sm text-muted-foreground">Registration Number: {lastScannedPermit.regNumber}</p>
                      <div className="mt-1">
                        <Badge status={lastScannedPermit.status} />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/student-details", { 
                        state: { 
                          studentData: { 
                            studentNumber: lastScannedPermit.studentNumber, 
                            regNumber: lastScannedPermit.regNumber, 
                            feesBalance: lastScannedPermit.status === "valid" ? 0 : 500000,
                            permitStatus: lastScannedPermit.status === "valid" ? "VALID" : "INVALID"
                          } 
                        } 
                      })}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <div className="mb-8 aspect-square max-w-xs mx-auto border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                {scanning ? (
                  <div className="text-center space-y-2">
                    <div className="animate-pulse">
                      <QrCode className="w-16 h-16 mx-auto text-muted-foreground" />
                    </div>
                    <p>Scanning...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <QrCode className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="text-sm">Camera preview will appear here</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={() => handleScan()} 
                  disabled={scanning}
                  className="w-full bg-university-blue hover:bg-university-blue/80"
                >
                  {scanning ? "Scanning..." : "Start Scanning"}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="simulation" className="py-4">
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-card">
                <h3 className="text-lg font-medium mb-3">Simulation Options</h3>
                <p className="text-muted-foreground mb-6">
                  Select one of the following options to simulate different exam approval states:
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Button 
                    onClick={() => handleScan("waiting")}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-3"
                  >
                    <div className="bg-university-orange/20 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-university-orange" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Admin Approval Pending</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Simulate the waiting for admin approval state
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => handleScan("expired")}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-3"
                  >
                    <div className="bg-university-orange/20 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-university-orange" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Exam Session Expired</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Simulate the state when exam session expired (4+ hours)
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={() => handleScan()} 
                className="w-full bg-university-green hover:bg-university-green/90"
              >
                Normal Scan (Approved Session)
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className={isMobile ? "h-[85%]" : ""}>
          <DrawerHeader>
            <DrawerTitle>Scan Results</DrawerTitle>
          </DrawerHeader>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <NavBar />
    </div>
  );
};

const Badge = ({ status }: { status: string }) => {
  let classes = "px-2 py-1 rounded-full text-xs font-medium";
  
  if (status === "valid" || status === "approved") {
    classes += " bg-green-100 text-green-800";
  } else {
    classes += " bg-red-100 text-red-800";
  }
  
  return <span className={classes}>{status.toUpperCase()}</span>;
};

export default ScanQRPage;
