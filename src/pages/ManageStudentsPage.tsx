
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { studentData } from "@/types/studentData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Expanded student data with course information
const enhancedStudentData = studentData.map(student => ({
  ...student,
  course: ["Bachelor of Information Technology", "Bachelor of Software Engineering", "Bachelor of Computer Science"][Math.floor(Math.random() * 3)],
}));

const ManageStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(enhancedStudentData);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search by registration number, student number or course
    if (searchTerm) {
      const filteredStudents = enhancedStudentData.filter(student => 
        student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setStudents(filteredStudents);
    } else {
      setStudents(enhancedStudentData);
    }
  };

  // Group students by course
  const groupedStudents = useMemo(() => {
    const groups: Record<string, typeof students> = {};
    
    students.forEach(student => {
      if (!groups[student.course]) {
        groups[student.course] = [];
      }
      groups[student.course].push(student);
    });
    
    return Object.entries(groups).map(([course, students]) => ({
      course,
      students,
      count: students.length
    }));
  }, [students]);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="md:pl-64 pt-16 md:pt-0">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Manage Students</h1>
          </div>
          
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by reg number, student number or course"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <div className="space-y-6">
            {groupedStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No students found. Try a different search term.
              </div>
            )}
            
            {groupedStudents.map((group) => (
              <Card key={group.course} className="overflow-hidden">
                <Accordion type="single" collapsible defaultValue={group.course}>
                  <AccordionItem value={group.course} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/30">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-left">
                          <h3 className="font-medium text-lg">{group.course}</h3>
                          <p className="text-sm text-muted-foreground">
                            {group.count} student{group.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="divide-y">
                        {group.students.map((student) => (
                          <div key={student.studentNumber} className="px-6 py-4 hover:bg-muted/20 transition-colors">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">{student.firstName} {student.lastName}</div>
                                  <Badge className="bg-green-500">VALID</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mb-1">Reg Number: {student.registrationNumber}</div>
                                <div className="text-sm">Student Number: {student.studentNumber}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsPage;
