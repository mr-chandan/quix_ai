"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

interface AggregatedData {
  totalScore: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  assignmentCount: number;
  topStudents: {
    studentUUID: string;
    studentName: string;
    totalMarks: number;
  }[];
  questionStats: Record<
    string,
    { correctAnswers: number; totalAnswers: number; questionText: string }
  >;
  studentsScores: Record<
    string,
    {
      studentName: string;
      totalMarks: number;
      submissions: {
        assignmentId: string;
        scoredMarks: number;
        submissionDate: number;
      }[];
    }
  >;
  lastUpdated: any;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function InputMaterialFile() {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedStudentUUID, setSelectedStudentUUID] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const params = useParams();
  const classid = params.classid as string;
  const randomImage = ["02.png", "01.png", "03.png", "04.png", "05.png"][
    Math.floor(Math.random() * 5)
  ];

  const paginatedSubmissions = useMemo(() => {
    if (!selectedStudentUUID) return [];

    const submissions =
      aggregatedData?.studentsScores[selectedStudentUUID]?.submissions || [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return submissions.slice(startIndex, endIndex);
  }, [currentPage, selectedStudentUUID, aggregatedData]);

  const totalSubmissions =
    selectedStudentUUID &&
    aggregatedData?.studentsScores[selectedStudentUUID]?.submissions
      ? aggregatedData.studentsScores[selectedStudentUUID].submissions.length
      : 0;

  const totalPages = Math.ceil(totalSubmissions / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchAggregatedData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        try {
          const docRef = doc(
            db,
            `Classrooms/${classid}/AggregatedData/classroom_assignmentsSummary`
          );
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            setAggregatedData(docSnapshot.data() as AggregatedData);
          } else {
            setAggregatedData(null);
            toast({
              variant: "destructive",
              title: "No Data Found",
              description: `There is no enough data available currently for this class visit after some time.`,
            });
          }
        } catch (error) {
          console.error("Error fetching aggregated data:", error);
          setError("There was an error fetching the aggregated data.");
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        }
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [classid]);

  useEffect(() => {
    if (classid) {
      fetchAggregatedData();
    }
  }, [classid, fetchAggregatedData]);

  const sortedTopStudents =
    aggregatedData?.topStudents
      .sort((a, b) => b.totalMarks - a.totalMarks)
      .slice(0, 5) || [];

  const leaderboardData =
    Object.values(aggregatedData?.studentsScores || {}).map((student) => ({
      name: student.studentName,
      totalMarks: student.totalMarks,
    })) || [];

  if (aggregatedData?.topStudents.length && !selectedStudentUUID) {
    setSelectedStudentUUID(aggregatedData.topStudents[0].studentUUID);
  }

  if (aggregatedData === null) {
    return (
      <div className="text-center mt-48">
        There is no enough data available currently for this class visit after
        some time
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assignment Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregatedData?.assignmentCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total number of assignments submitted
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregatedData?.averageScore?.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average score of all students
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregatedData?.highestScore}
            </div>
            <p className="text-xs text-muted-foreground">
              Highest scored marks
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregatedData?.lowestScore}
            </div>
            <p className="text-xs text-muted-foreground">Lowest scored marks</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Top 5 Students</CardTitle>
              <CardDescription>Top 5 students by total marks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-right">Total Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTopStudents.map((student, index) => (
                    <TableRow
                      key={student.studentUUID}
                      onClick={() =>
                        setSelectedStudentUUID(student.studentUUID)
                      }
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <img
                            src={`/04.png`}
                            alt="Player Avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <span>{student.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {student.totalMarks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>Top students by total marks</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={leaderboardData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="totalMarks"
                    fill="var(--color-desktop)"
                    radius={8}
                    barSize={50}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Top Students by Total Marks <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing the leaderboard for the top students
              </div>
            </CardFooter>
          </Card>
        </div>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Detailed Student Scores</CardTitle>
              <CardDescription className="mt-1">
                Detailed scores of each students
              </CardDescription>
            </div>
            <div>
              <Select
                onValueChange={(value) => setSelectedStudentUUID(value)}
                value={selectedStudentUUID as string}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {aggregatedData?.topStudents.map((student) => (
                      <SelectItem
                        key={student.studentUUID}
                        value={student.studentUUID}
                      >
                        {student.studentName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Assignment ID</TableHead>
                  <TableHead>Scored Marks</TableHead>
                  <TableHead>Submission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubmissions.length > 0 ? (
                  paginatedSubmissions.map((submission, index) => (
                    <TableRow key={`${selectedStudentUUID}-${index}`}>
                      <TableCell>
                        {selectedStudentUUID &&
                          aggregatedData?.studentsScores[selectedStudentUUID]
                            ?.studentName}
                      </TableCell>
                      <TableCell>{submission.assignmentId}</TableCell>
                      <TableCell>{submission.scoredMarks}</TableCell>
                      <TableCell>
                        {new Date(
                          submission.submissionDate
                        ).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalSubmissions)} of{" "}
                {totalSubmissions} submissions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
