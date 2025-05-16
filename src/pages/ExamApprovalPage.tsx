
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Calendar, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ExamSession {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "completed";
  venue: string;
  invigilators: number;
}

const ExamApprovalPage = () => {
  const [examSessions, setExamSessions] = useState<ExamSession[]>([
    {
      id: "EX001",
      courseCode: "CSC2100",
      courseName: "Web Development",
      date: "2025-05-16",
      time: "9:00 AM - 12:00 PM",
      status: "pending",
      venue: "Block B Room 12",
      invigilators: 3
    },
    {
      id: "EX002",
      courseCode: "CSC3101",
      courseName: "Software Engineering",
      date: "2025-05-17",
      time: "2:00 PM - 5:00 PM",
      status: "pending",
      venue: "Block A Room 5",
      invigilators: 2
    },
    {
      id: "EX003",
      courseCode: "CSC1102",
      courseName: "Introduction to Programming",
      date: "2025-05-18",
      time: "9:00 AM - 11:00 AM",
      status: "approved",
      venue: "Computer Lab 3",
      invigilators: 4
    }
  ]);

  const handleApproveExam = (examId: string) => {
    setExamSessions(exams => 
      exams.map(exam => 
        exam.id === examId ? { ...exam, status: "approved" } : exam
      )
    );
    
    toast.success("Exam Approved. Invigilators can now verify students for this exam");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatusBadge = ({ status }: { status: ExamSession['status'] }) => {
    const statusProps = {
      pending: {
        variant: "outline" as const,
        className: "border-university-orange text-university-orange",
        icon: <Clock className="w-3 h-3 mr-1" />
      },
      approved: {
        variant: "outline" as const,
        className: "border-university-green text-university-green",
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      },
      completed: {
        variant: "outline" as const,
        className: "border-muted-foreground text-muted-foreground",
        icon: <AlertCircle className="w-3 h-3 mr-1" />
      }
    };

    const { variant, className, icon } = statusProps[status];

    return (
      <Badge variant={variant} className={className}>
        <div className="flex items-center">
          {icon}
          <span className="capitalize">{status}</span>
        </div>
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="md:pl-64 pt-16 md:pt-0">
        <div className="p-4">
          {/* Header */}
          <div className="bg-university-blue text-white p-6 pt-8 md:pt-16">
            <h1 className="text-2xl font-bold">Exam Session Approval</h1>
            <p className="opacity-90 font-medium">Approve exam sessions for invigilators</p>
          </div>

          {/* Main content */}
          <div className="p-4 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Calendar className="mr-2 h-5 w-5 text-university-blue" />
                  <h2 className="text-xl font-semibold">Upcoming Exam Sessions</h2>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examSessions.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{exam.courseCode}</div>
                            <div className="text-sm text-muted-foreground">{exam.courseName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(exam.date)}</TableCell>
                        <TableCell>{exam.time}</TableCell>
                        <TableCell>{exam.venue}</TableCell>
                        <TableCell>
                          <StatusBadge status={exam.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {exam.status === "pending" ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveExam(exam.id)}
                              className="bg-university-green hover:bg-university-green/90"
                            >
                              Approve
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              disabled={true}
                            >
                              {exam.status === "approved" ? "Approved" : "Completed"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamApprovalPage;
