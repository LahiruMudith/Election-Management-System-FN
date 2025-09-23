"use client"

import React, {useEffect, useMemo, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Vote,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  Database,
  Activity,
  BookCheck, Flag,
} from "lucide-react"
import Link from "next/link"
import { useTokenValidation } from "@/hooks/useTokenValidation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import getAllVoters, {Voter} from "@/hooks/getAllVoters";
import { useVoterImages } from "@/hooks/getVoterPics";
import { exportVotersToPDF } from "../utils/exportVotersToPDF";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {useGetAllCandidates} from "@/hooks/useGetAllCandidates";
import {Candidate} from "@/types/candidate";
import {getCandidateImages} from "@/hooks/getCandidatePics";
import LogoutButton from "@/components/ui/logoutButton";



type ActiveList = "pending" | "verified" | "rejected" | null;

const fmt = new Intl.NumberFormat("en-US");

export default function AdminDashboard() {
  const token = Cookies.get("token") ?? null;


  const { isValid } = useTokenValidation();
  const [activeTab, setActiveTab] = useState("overview")
  const { voters, loading: votersLoading, error: votersError } = getAllVoters(Cookies.get("token") ?? null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [fullscreenSrc, setFullscreenSrc] = useState<string | null>(null);
  // const { images, loading: imagesLoading, error: imagesError, reload: reloadImages } = useVoterImages(selectedVoter?.nicFrontUrl, selectedVoter?.nicBackUrl, selectedVoter?.selfieUrl, Cookies.get("token") ?? null);
  const { candidates, candidatesLoading, candidatesError, refetchCandidates } = useGetAllCandidates(token);
  let selectedCandidateUsername = null
  const { images:candidateImages, loading: candidateImagesLoading, error: candidateImagesError } = getCandidateImages(selectedCandidateUsername, token);


  const [candidateActiveList, setCandidateActiveList] =
      useState<"pending" | "approved" | "rejected" | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [candidateFullscreenSrc, setCandidateFullscreenSrc] = useState<string | null>(null);

  const pendingCandidates = useMemo(
      () => candidates.filter(c => c.status === "PENDING"),
      [candidates]
  );
  const approvedCandidates = useMemo(
      () => candidates.filter(c => c.status === "APPROVED"),
      [candidates]
  );
  const rejectedCandidates = useMemo(
      () => candidates.filter(c => c.status === "REJECTED"),
      [candidates]
  );

  const candidateListToShow = useMemo(() => {
    switch (candidateActiveList) {
      case "pending": return pendingCandidates;
      case "approved": return approvedCandidates;
      case "rejected": return rejectedCandidates;
      default: return [];
    }
  }, [candidateActiveList, pendingCandidates, approvedCandidates, rejectedCandidates]);

  function normalizeStatus(status?: string) {
    return (status || "").toUpperCase();
  }
  const CANDIDATE_IMG_BASE = "http://localhost:8080/api/v1/candidate/images";

  function getUsernameFromCandidateImage(fileName: string): string | null {
    // Keep only the base name (remove folders, query, hash)
    const base = fileName.replace(/^.*[\\/]/, "").split("?")[0].split("#")[0];

    // Strip the last extension
    const dot = base.lastIndexOf(".");
    const name = dot !== -1 ? base.slice(0, dot) : base;

    // Known suffixes
    const suffixes = ["_idFront", "_idBack", "_selfie"];

    // Remove the matching suffix if present (case-insensitive)
    const lower = name.toLowerCase();
    for (const s of suffixes) {
      if (lower.endsWith(s.toLowerCase())) {
        return name.slice(0, -s.length);
      }
    }
    return null; // not a recognized pattern
  }

  function buildCandidateImgSrc(value?: string | null) {
    if (!value) return undefined;
    // If it's an absolute URL or data URI, use as-is; otherwise treat as a filename from the backend.
    if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
    return `${CANDIDATE_IMG_BASE}/${encodeURIComponent(value)}`;
  }



  // Normalize status for safer filtering
  const normalize = (s?: string) => (s ? s.trim().toUpperCase() : "");

  const votersSafe = voters ?? [];

  const pendingVotersCard = useMemo(
      () => votersSafe.filter((v: Voter) => normalize(v.verified) === "PENDING"),
      [votersSafe]
  );
  const verifiedVotersCard = useMemo(
      () => votersSafe.filter((v: Voter) => normalize(v.verified) === "VERIFIED"),
      [votersSafe]
  );
  const rejectedVotersCard = useMemo(
      () => votersSafe.filter((v: Voter) => normalize(v.verified) === "REJECTED"),
      [votersSafe]
  );

  const [activeList, setActiveList] = useState<ActiveList>(null);

  const listToShow = activeList === "pending"
      ? pendingVotersCard
      : activeList === "verified"
          ? verifiedVotersCard
          : activeList === "rejected"
              ? rejectedVotersCard
              : [];


  useEffect(() => {
    const anyOverlayOpen = modalOpen || Boolean(fullscreenSrc);
    if (!anyOverlayOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreenSrc(null);
        setModalOpen(false);
      }
    };

    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen, fullscreenSrc]);

  // optional: refresh images when the modal opens
  // useEffect(() => {
  //   if (modalOpen && selectedVoter?.nicNumber) {
  //     void reloadImages();
  //   }
  // }, [modalOpen, selectedVoter?.nicNumber, reloadImages]);

  const stats = {
    totalVoters: (voters ?? []).length,
    verifiedVoters: 2698432,
    activeElections: 2,
    completedElections: 15,
    totalVotes: 1456789,
    systemUptime: "99.9%",
  }

  const elections = [
    {
      id: 1,
      title: "Presidential Election 2024",
      status: "active",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      totalVotes: 1234567,
      candidates: 8,
      districts: 25,
    },
    {
      id: 2,
      title: "Provincial Council Election",
      status: "active",
      startDate: "2024-02-10",
      endDate: "2024-03-01",
      totalVotes: 456789,
      candidates: 12,
      districts: 9,
    },
    {
      id: 3,
      title: "Parliamentary Election 2023",
      status: "completed",
      startDate: "2023-08-01",
      endDate: "2023-08-15",
      totalVotes: 2156789,
      candidates: 156,
      districts: 25,
    },
  ]

  const recentActivity = [
    { id: 1, action: "New voter registered", user: "John Silva", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Election created", user: "Admin", time: "1 hour ago", type: "election" },
    {
      id: 3,
      action: "Voter verification completed",
      user: "Maria Fernando",
      time: "2 hours ago",
      type: "verification",
    },
    { id: 4, action: "System backup completed", user: "System", time: "6 hours ago", type: "system" },
  ]


  if (isValid === null) {
    // Still loading, don't redirect or render protected content yet
    return <div>Loading...</div>;
  }

  function getCountForMonth(data: any[], year: number, month: number) {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];
    return safeData.filter(item => {
      const date = new Date(item.creatAt);
      return date.getFullYear() === year && date.getMonth() === month;
    }).length;
  }

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed (0 = Jan)
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthCount = getCountForMonth(voters, currentYear, currentMonth);
  const lastMonthCount = getCountForMonth(voters, lastMonthYear, lastMonth);

  let percentChange = 0;
  if (lastMonthCount > 0) {
    percentChange = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
  }
  const formatted =
      lastMonthCount === 0
          ? "0% from last month"
          : `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(1)}% from last month`;

  // Defensive: voters might be undefined while loading
  const totalVoters = voters?.length ?? 0;
  const verifiedVoters = voters?.filter(voter => voter.verified === "VERIFIED").length ?? 0;
  const verificationRate = totalVoters > 0 ? (verifiedVoters / totalVoters) * 100 : 0;

// Filter elections that are in progress
  const electionsInProgress = elections.filter(
      (election) =>
          election.status === "VOTING_OPEN" || election.status === "COUNTING"
  );

  const inProgressCount = electionsInProgress.length;


  if (!isValid) {
    // Not valid, redirect to login
    window.location.href = "/";
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("username");

    return null; // prevent rendering rest of component
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Vote className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">E-Vote</span>
              </Link>
              <Badge variant="destructive">Admin Portal</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Secure Session
              </Badge>
              <LogoutButton/>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage elections, voters, and system operations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="voters">Voters</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            {/*<TabsTrigger value="system">System</TabsTrigger>*/}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVoters.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{formatted}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified Voters</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{verifiedVoters.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {verificationRate.toFixed(1)}% verification rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
                  <Vote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeElections}</div>
                  <p className="text-xs text-muted-foreground">
                    {inProgressCount} election{inProgressCount !== 1 ? "s" : ""} in progress
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-1 gap-6">
              {/*<Card>*/}
              {/*  <CardHeader>*/}
              {/*    <CardTitle>Recent Activity</CardTitle>*/}
              {/*    <CardDescription>Latest system activities and user actions</CardDescription>*/}
              {/*  </CardHeader>*/}
              {/*  <CardContent>*/}
              {/*    <div className="space-y-4">*/}
              {/*      {recentActivity.map((activity) => (*/}
              {/*        <div key={activity.id} className="flex items-center space-x-3">*/}
              {/*          <div*/}
              {/*            className={`p-2 rounded-full ${*/}
              {/*              activity.type === "user"*/}
              {/*                ? "bg-blue-100"*/}
              {/*                : activity.type === "election"*/}
              {/*                  ? "bg-green-100"*/}
              {/*                  : activity.type === "verification"*/}
              {/*                    ? "bg-yellow-100"*/}
              {/*                    : "bg-gray-100"*/}
              {/*            }`}*/}
              {/*          >*/}
              {/*            {activity.type === "user" ? (*/}
              {/*              <Users className="h-4 w-4" />*/}
              {/*            ) : activity.type === "election" ? (*/}
              {/*              <Vote className="h-4 w-4" />*/}
              {/*            ) : activity.type === "verification" ? (*/}
              {/*              <CheckCircle className="h-4 w-4" />*/}
              {/*            ) : (*/}
              {/*              <Database className="h-4 w-4" />*/}
              {/*            )}*/}
              {/*          </div>*/}
              {/*          <div className="flex-1">*/}
              {/*            <p className="text-sm font-medium">{activity.action}</p>*/}
              {/*            <p className="text-xs text-gray-500">*/}
              {/*              {activity.user} • {activity.time}*/}
              {/*            </p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      ))}*/}
              {/*    </div>*/}
              {/*  </CardContent>*/}
              {/*</Card>*/}

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/create-election">
                    <Button className="w-full justify-start mb-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Election
                    </Button>
                  </Link>
                  <Link href="/parties">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Flag className="h-4 w-4 mr-2" />
                      Manage Political Parties
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => {toast.error("It Under Development")}}>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Voter Registrations
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => {toast.error("It Under Development")}}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                  {/*<Button variant="outline" className="w-full justify-start bg-transparent">*/}
                  {/*  <Settings className="h-4 w-4 mr-2" />*/}
                  {/*  System Configuration*/}
                  {/*</Button>*/}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Elections Tab */}
          <TabsContent value="elections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Election Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Election
              </Button>
            </div>

            <div className="grid gap-6">
              {elections.map((election) => (
                <Card key={election.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{election.title}</span>
                          <Badge variant={election.status === "active" ? "default" : "secondary"}>
                            {election.status === "active" ? (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </>
                            )}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {election.startDate} - {election.endDate}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {election.status !== "active" && (
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Votes:</span>
                        <p className="font-semibold">{election.totalVotes.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Candidates:</span>
                        <p className="font-semibold">{election.candidates}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Districts:</span>
                        <p className="font-semibold">{election.districts}</p>
                      </div>
                    </div>
                    {election.status === "active" && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Voter Turnout</span>
                          <span>68.5%</span>
                        </div>
                        <Progress value={68.5} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            {/* Top Bar */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Candidate Management</h2>
              <div className="flex space-x-2">
                {/* Example export button (uncomment if you added util) */}
                {/* <Button
        variant="outline"
        onClick={() => exportCandidatesToPDF(candidates)}
        disabled={candidatesLoading || candidates.length === 0}
      >
        Export All Candidates
      </Button> */}
              </div>
            </div>

            {/*
    State setup (place these useState/useMemo calls in your component body ABOVE return):
    const { candidates, candidatesLoading, candidatesError } = useGetAllCandidates();
    const [candidateActiveList, setCandidateActiveList] = useState<"pending"|"approved"|"rejected"|null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate|null>(null);
    const [candidateModalOpen, setCandidateModalOpen] = useState(false);
    const [candidateFullscreenSrc, setCandidateFullscreenSrc] = useState<string|null>(null);

    const pendingCandidates = useMemo(() => candidates.filter(c => c.status === "PENDING"), [candidates]);
    const approvedCandidates = useMemo(() => candidates.filter(c => c.status === "APPROVED"), [candidates]);
    const rejectedCandidates = useMemo(() => candidates.filter(c => c.status === "REJECTED"), [candidates]);

    const candidateListToShow = useMemo(() => {
      if (!candidateActiveList) return [];
      switch (candidateActiveList) {
        case "pending": return pendingCandidates;
        case "approved": return approvedCandidates;
        case "rejected": return rejectedCandidates;
        default: return [];
      }
    }, [candidateActiveList, pendingCandidates, approvedCandidates, rejectedCandidates]);

    function normalizeStatus(s?: string) {
      if (!s) return "";
      return s.toUpperCase();
    }

    // Example approve/reject handlers (replace with real API calls):
    async function handleApprove(candidate: Candidate) { ... }
    async function handleReject(candidate: Candidate) { ... }
  */}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidatesLoading ? (
                      <div className="h-8 w-28 bg-gray-200 rounded animate-pulse mb-2" />
                  ) : (
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {pendingCandidates.length.toLocaleString()}
                      </div>
                  )}
                  <p className="text-sm text-gray-600">Awaiting review</p>
                  <Button
                      className="w-full mt-4 bg-transparent"
                      variant="outline"
                      onClick={() => setCandidateActiveList("pending")}
                      disabled={candidatesLoading || pendingCandidates.length === 0}
                  >
                    Review Pending
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approved Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidatesLoading ? (
                      <div className="h-8 w-36 bg-gray-200 rounded animate-pulse mb-2" />
                  ) : (
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {approvedCandidates.length.toLocaleString()}
                      </div>
                  )}
                  <p className="text-sm text-gray-600">Approved for ballot</p>
                  <Button
                      className="w-full mt-4 bg-transparent"
                      variant="outline"
                      onClick={() => setCandidateActiveList("approved")}
                      disabled={candidatesLoading || approvedCandidates.length === 0}
                  >
                    View All
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rejected Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidatesLoading ? (
                      <div className="h-8 w-28 bg-gray-200 rounded animate-pulse mb-2" />
                  ) : (
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        {rejectedCandidates.length.toLocaleString()}
                      </div>
                  )}
                  <p className="text-sm text-gray-600">Applications rejected</p>
                  <Button
                      className="w-full mt-4 bg-transparent"
                      variant="outline"
                      onClick={() => setCandidateActiveList("rejected")}
                      disabled={candidatesLoading || rejectedCandidates.length === 0}
                  >
                    Review Rejected
                  </Button>
                </CardContent>
              </Card>
            </div>

            {!candidatesLoading && candidatesError && (
                <div className="text-sm text-red-600">{candidatesError}</div>
            )}

            {/* Filtered List */}
            {candidateActiveList && !candidatesLoading && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      {candidateActiveList === "pending" && "Pending Approvals"}
                      {candidateActiveList === "approved" && "Approved Candidates"}
                      {candidateActiveList === "rejected" && "Rejected Applications"}
                      {" "}({candidateListToShow.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setCandidateActiveList(null)}>
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {candidateListToShow.length === 0 ? (
                        <div className="text-sm text-gray-600">No records found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                            <tr className="text-left text-gray-600 border-b">
                              <th className="py-2 pr-4">Full Name</th>
                              <th className="py-2 pr-4">Age</th>
                              <th className="py-2 pr-4 hidden md:table-cell">Manifesto</th>
                              <th className="py-2 pr-4 hidden md:table-cell">Profession</th>
                              <th className="py-2 pr-4">Party</th>
                              <th className="py-2 pr-4">Status</th>
                              <th className="py-2 pr-2">Details</th>
                              {(candidateActiveList === "pending" || candidateActiveList === "rejected") && (
                                  <th className="py-2 pr-2">Approve</th>
                              )}
                              {candidateActiveList === "pending" && (
                                  <th className="py-2 pr-2">Reject</th>
                              )}
                            </tr>
                            </thead>
                            <tbody>
                            {candidateListToShow.map((c, idx) => (
                                <tr key={(c.id ?? c.fullName) + "-" + idx} className="border-b">
                                  <td className="py-2 pr-4">{c.fullName}</td>
                                  <td className="py-2 pr-4">{c.age}</td>
                                  <td className="py-2 pr-4 hidden md:table-cell">
                                    {c.manifesto
                                        ? c.manifesto.length > 60
                                            ? c.manifesto.slice(0, 60) + "..."
                                            : c.manifesto
                                        : "-"}
                                  </td>
                                  <td className="py-2 pr-4 hidden md:table-cell">
                                    {c.profession || "-"}
                                  </td>
                                  <td className="py-2 pr-4">
                                    {c.partyName || (c.partyId ? `#${c.partyId}` : "Independent")}
                                  </td>
                                  <td className="py-2 pr-4">
        <span
            className={
                "px-2 py-1 rounded text-xs " +
                (normalizeStatus(c.status) === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : normalizeStatus(c.status) === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700")
            }
        >
          {normalizeStatus(c.status) || "-"}
        </span>
                                  </td>
                                  <td className="py-2 pr-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedCandidate(c);
                                          selectedCandidateUsername = getUsernameFromCandidateImage(c.nicFrontImg)
                                          setCandidateModalOpen(true);
                                        }}
                                    >
                                      View
                                    </Button>
                                  </td>
                                  {(candidateActiveList === "pending" || candidateActiveList === "rejected") && (
                                      <td className="py-2 pr-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-700 transition"
                                            onClick={() => {
                                              // handleApprove(c)
                                            }}
                                        >
                                          Approve
                                        </Button>
                                      </td>
                                  )}
                                  {candidateActiveList === "pending" && (
                                      <td className="py-2 pr-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-2 border-red-600 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-700 transition"
                                            onClick={() => {
                                              // handleReject(c)
                                            }}
                                        >
                                          Reject
                                        </Button>
                                      </td>
                                  )}
                                </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                    )}
                    {/* Candidate Detail Modal */}
                    {candidateModalOpen && selectedCandidate && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                          <div
                              className="bg-white p-8 rounded-2xl shadow-xl w-[900px] max-w-[95vw] relative"
                              role="dialog"
                              aria-modal="true"
                              aria-labelledby="candidate-modal-title"
                          >
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                                onClick={() => setCandidateModalOpen(false)}
                                title="Close"
                                aria-label="Close"
                            >
                              ×
                            </button>

                            <h2 id="candidate-modal-title" className="text-2xl font-bold mb-6 text-gray-900">
                              Candidate Details
                            </h2>

                            {/* Top details: Full Name, Age, Profession, Approved, Active */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Full Name</p>
                                <p className="mt-0.5 text-sm text-gray-900">{selectedCandidate.fullName}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Age</p>
                                <p className="mt-0.5 text-sm text-gray-900">{selectedCandidate.age}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Profession</p>
                                <p className="mt-0.5 text-sm text-gray-900">{selectedCandidate.profession || "-"}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Approved</p>
                                  <span
                                      className={
                                          "inline-block mt-0.5 px-2 py-1 rounded text-xs font-medium " +
                                          (selectedCandidate.approved
                                              ? "bg-green-100 text-green-700"
                                              : "bg-orange-100 text-orange-700")
                                      }
                                  >
              {selectedCandidate.approved ? "Yes" : "No"}
            </span>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Active</p>
                                  <span
                                      className={
                                          "inline-block mt-0.5 px-2 py-1 rounded text-xs font-medium " +
                                          (selectedCandidate.active
                                              ? "bg-green-100 text-green-700"
                                              : "bg-red-100 text-red-700")
                                      }
                                  >
              {selectedCandidate.active ? "Active" : "Inactive"}
            </span>
                                </div>
                              </div>
                            </div>

                            {/* Manifesto */}
                            <div className="mb-8">
                              <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1">
                                Manifesto
                              </p>
                              {selectedCandidate.manifesto ? (
                                  <div className="text-sm text-gray-800 whitespace-pre-line max-h-44 overflow-auto rounded border p-3 bg-gray-50">
                                    {selectedCandidate.manifesto}
                                  </div>
                              ) : (
                                  <p className="text-sm text-gray-400">No manifesto provided.</p>
                              )}
                            </div>

                            {/* Images: NIC Front, NIC Back, Selfie, Symbol */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                              {/* NIC Front */}
                              <div>
                                <h3 className="text-sm font-semibold mb-2 text-gray-700">NIC Front</h3>
                                {buildCandidateImgSrc(candidateImages.nicFrontUrl) ? (
                                    <img
                                        src={buildCandidateImgSrc(candidateImages.nicFrontUrl)}
                                        alt="NIC Front"
                                        className="w-full h-44 object-cover rounded border cursor-zoom-in hover:opacity-90 transition"
                                        onClick={() =>
                                            setCandidateFullscreenSrc(buildCandidateImgSrc(selectedCandidate.nicFrontImg)!)
                                        }
                                    />
                                ) : (
                                    <div className="w-full h-44 flex items-center justify-center rounded border text-gray-400 text-xs">
                                      Not available
                                    </div>
                                )}
                              </div>

                              {/* NIC Back */}
                              <div>
                                <h3 className="text-sm font-semibold mb-2 text-gray-700">NIC Back</h3>
                                {buildCandidateImgSrc(candidateImages.nicBackUrl) ? (
                                    <img
                                        src={buildCandidateImgSrc(candidateImages.nicBackUrl)}
                                        alt="NIC Back"
                                        className="w-full h-44 object-cover rounded border cursor-zoom-in hover:opacity-90 transition"
                                        onClick={() =>
                                            setCandidateFullscreenSrc(buildCandidateImgSrc(selectedCandidate.nicBackImg)!)
                                        }
                                    />
                                ) : (
                                    <div className="w-full h-44 flex items-center justify-center rounded border text-gray-400 text-xs">
                                      Not available
                                    </div>
                                )}
                              </div>

                              {/* Selfie */}
                              <div>
                                <h3 className="text-sm font-semibold mb-2 text-gray-700">Selfie</h3>
                                {buildCandidateImgSrc(candidateImages.nicBackUrl) ? (
                                    <img
                                        src={buildCandidateImgSrc(candidateImages.nicBackUrl)}
                                        alt="Selfie"
                                        className="w-44 h-44 object-cover rounded-full border mx-auto cursor-zoom-in hover:opacity-90 transition"
                                        onClick={() =>
                                            setCandidateFullscreenSrc(buildCandidateImgSrc(selectedCandidate.selfieImg)!)
                                        }
                                    />
                                ) : (
                                    <div className="w-44 h-44 flex items-center justify-center rounded-full border mx-auto text-gray-400 text-xs">
                                      Not available
                                    </div>
                                )}
                              </div>

                            </div>

                            <div className="mt-8 flex justify-end">
                              <Button variant="outline" onClick={() => setCandidateModalOpen(false)}>
                                Close
                              </Button>
                            </div>
                          </div>
                        </div>
                    )}

                    {/* Fullscreen overlay (reuses your existing block) */}
                    {candidateFullscreenSrc && (
                        <div
                            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
                            onClick={() => setCandidateFullscreenSrc(null)}
                            role="dialog"
                            aria-modal="true"
                        >
                          <button
                              className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCandidateFullscreenSrc(null);
                              }}
                              aria-label="Close full image"
                              title="Close"
                          >
                            ×
                          </button>

                          <img
                              src={candidateFullscreenSrc}
                              alt="Full-size preview"
                              className="max-w-[95vw] max-h-[95vh] object-contain rounded shadow-2xl"
                              onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                    )}
                  </CardContent>
                </Card>
            )}

            {/* Recent Candidate Registrations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Candidate Registrations</CardTitle>
                <CardDescription>Latest candidate application submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(candidates ?? []).slice(0, 5).map((c, index) => (
                      <div key={c.id ?? index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{c.fullName}</h4>
                          <p className="text-sm text-gray-600">
                            {c.manifesto || "-"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
              <span
                  className={
                      "text-xs font-medium px-2 py-1 rounded " +
                      (c.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : c.status === "PENDING"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700")
                  }
              >
                {c.status.toLowerCase()}
              </span>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCandidate(c);
                                setCandidateModalOpen(true);
                              }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voters Tab */}
          <TabsContent value="voters" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Voter Management</h2>
              <div className="flex space-x-2">
                {/*<Input placeholder="Search voters..." className="w-64"/>*/}
                {/*<Button onClick={() => exportVotersToPDF(voters)}>*/}
                {/*  Export All Voters to PDF*/}
                {/*</Button>*/}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pending Verifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {votersLoading ? (
                        <div className="h-8 w-28 bg-gray-200 rounded animate-pulse mb-2"/>
                    ) : (
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {fmt.format(pendingVotersCard.length)}
                        </div>
                    )}
                    <p className="text-sm text-gray-600">Voters awaiting verification</p>
                    <Button
                        className="w-full mt-4 bg-transparent"
                        variant="outline"
                        onClick={() => setActiveList("pending")}
                        disabled={votersLoading || pendingVotersCard.length === 0}
                    >
                      Review Pending
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verified Voters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {votersLoading ? (
                        <div className="h-8 w-36 bg-gray-200 rounded animate-pulse mb-2"/>
                    ) : (
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {fmt.format(verifiedVotersCard.length)}
                        </div>
                    )}
                    <p className="text-sm text-gray-600">Successfully verified voters</p>
                    <Button
                        className="w-full mt-4 bg-transparent"
                        variant="outline"
                        onClick={() => setActiveList("verified")}
                        disabled={votersLoading || verifiedVotersCard.length === 0}
                    >
                      View All
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rejected Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {votersLoading ? (
                        <div className="h-8 w-28 bg-gray-200 rounded animate-pulse mb-2"/>
                    ) : (
                        <div className="text-3xl font-bold text-red-600 mb-2">
                          {fmt.format(rejectedVotersCard.length)}
                        </div>
                    )}
                    <p className="text-sm text-gray-600">Applications rejected</p>
                    <Button
                        className="w-full mt-4 bg-transparent"
                        variant="outline"
                        onClick={() => setActiveList("rejected")}
                        disabled={votersLoading || rejectedVotersCard.length === 0}
                    >
                      Review Rejected
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {!votersLoading && votersError && (
                  <div className="text-sm text-red-600">{votersError}</div>
              )}

              {/* Details list for the selected category */}
              {activeList && !votersLoading && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">
                        {activeList === "pending" && "Pending Verifications"}
                        {activeList === "verified" && "Verified Voters"}
                        {activeList === "rejected" && "Rejected Applications"}
                        {" "}({listToShow.length})
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setActiveList(null)}>
                          Close
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {listToShow.length === 0 ? (
                          <div className="text-sm text-gray-600">No records found.</div>
                      ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead>
                              <tr className="text-left text-gray-600 border-b">
                                <th className="py-2 pr-4">Full Name</th>
                                <th className="py-2 pr-4">NIC</th>
                                <th className="py-2 pr-4 hidden md:table-cell">District</th>
                                <th className="py-2 pr-4 hidden md:table-cell">Phone</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-2">Images</th>
                                {(activeList === "pending" || activeList === "rejected") && (
                                    <th className="py-2 pr-2">Verify</th>
                                )}
                                {(activeList === "pending") && (
                                    <th className="py-2 pr-2">Reject</th>
                                )}
                              </tr>
                              </thead>
                              <tbody>
                              {listToShow.map((v: Voter, idx: number) => (
                                  <tr key={(v.id ?? v.nicNumber) + "-" + idx} className="border-b">
                                    <td className="py-2 pr-4">{v.fullName}</td>
                                    <td className="py-2 pr-4">{v.nicNumber}</td>
                                    <td className="py-2 pr-4 hidden md:table-cell">{v.district ?? "-"}</td>
                                    <td className="py-2 pr-4 hidden md:table-cell">{v.phoneNumber ?? "-"}</td>
                                    <td className="py-2 pr-4">
                          <span
                              className={
                                  "px-2 py-1 rounded text-xs " +
                                  (normalize(v.verified) === "VERIFIED"
                                      ? "bg-green-100 text-green-700"
                                      : normalize(v.verified) === "REJECTED"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-orange-100 text-orange-700")
                              }
                          >
                            {normalize(v.verified) || "-"}
                          </span>
                                    </td>
                                    <td className="py-2 pr-2">
                                      {/* Replace onClick with your modal logic or navigation */}
                                      <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            // Example: if you have modal state
                                            setSelectedVoter(v);
                                            console.log(v.nicFrontImg)
                                            console.log(v.nicBackImg)
                                            console.log(v.selfieImg)
                                            setModalOpen(true);
                                          }}
                                      >
                                        View
                                      </Button>
                                    </td>
                                    {(activeList === "pending" || activeList === "rejected") && (
                                        <td className="py-2 pr-2">
                                          <Button
                                              size="sm"
                                              variant="outline"
                                              className="flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-700 transition"
                                              onClick={() =>
                                                  showVerifyToast({
                                                    action: "verify",
                                                    voter: v,
                                                    token: Cookies.get("token"),
                                                    onAction: handleVerify, // must return a Promise
                                                  })
                                              }
                                          >
                                            <BookCheck className="text-xl" />
                                            Verify Voter
                                          </Button>
                                        </td>
                                    )}
                                    {(activeList === "pending") && (
                                        <td className="py-2 pr-2">
                                          <Button
                                              size="sm"
                                              variant="outline"
                                              className="flex items-center gap-2 border-red-600 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-700 transition"
                                              onClick={() =>
                                                  showVerifyToast({
                                                    action: "reject",
                                                    voter: v,
                                                    token: Cookies.get("token"),
                                                    onAction: handleReject, // must return a Promise
                                                  })
                                              }
                                          >
                                            <BookCheck className="text-xl" />
                                            Reject Voter
                                          </Button>
                                        </td>
                                    )}
                                  </tr>
                              ))}
                              </tbody>
                            </table>
                          </div>
                      )}
                    </CardContent>
                  </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Voter Registrations</CardTitle>
                <CardDescription>Latest voter registration applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(voters ?? []).slice(0, 5).map((voter, index) => (
                      <div key={voter.id ?? index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{voter.fullName}</h4>
                          <p className="text-sm text-gray-600">
                            {voter.nicNumber} • {voter.district}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(voter.creatAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                              variant={
                                voter.verified === "VERIFIED"
                                    ? "default"
                                    : voter.verified === "PENDING"
                                        ? "secondary"
                                        : "destructive"
                              }
                          >
                            {voter.verified === "VERIFIED" && <CheckCircle className="h-3 w-3 mr-1"/>}
                            {voter.verified === "PENDING" && <Clock className="h-3 w-3 mr-1"/>}
                            {voter.verified === "REJECTED" && <AlertCircle className="h-3 w-3 mr-1"/>}
                            {voter.verified.toLowerCase()}
                          </Badge>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVoter(voter);
                                console.log(voter.nicFrontImg)
                                console.log(voter.nicBackImg)
                                console.log(voter.selfieImg)
                                setModalOpen(true);

                              }}
                          >
                            <Eye className="h-4 w-4"/>
                          </Button>
                        </div>
                      </div>
                  ))}
                  {modalOpen && selectedVoter && (
                      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-1000 h-screen">
                        <div
                            className="bg-white p-8 rounded-2xl shadow-xl w-[700px] max-w-[92vw] relative max-h-screen overflow-y-auto"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="voter-modal-title"
                        >
                          <button
                              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                              onClick={() => setModalOpen(false)}
                              title="Close"
                              aria-label="Close"
                          >
                            ×
                          </button>

                          <h2 id="voter-modal-title" className="text-2xl font-bold mb-4 text-gray-900">
                            {selectedVoter.fullName}
                          </h2>

                          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                            <p className="text-base text-gray-700">
                              NIC: <span className="font-semibold">{selectedVoter.nicNumber}</span>
                            </p>
                            <p className="text-base text-gray-700">
                              District: <span className="font-semibold">{selectedVoter.district}</span>
                            </p>
                          </div>
                          <p className="text-base mb-5 text-gray-700">
                            Phone: <span className="font-semibold">{selectedVoter.phoneNumber}</span>
                          </p>


                          {/* Loading / error states for images */}
                          {/*{selectedVoter && (*/}
                          {/*    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">*/}
                          {/*      <div className="h-56 w-full bg-gray-200 rounded-lg"/>*/}
                          {/*      <div className="h-56 w-full bg-gray-200 rounded-lg"/>*/}
                          {/*      <div className="h-44 w-44 bg-gray-200 rounded-full mx-auto sm:col-span-2"/>*/}
                          {/*    </div>*/}
                          {/*)}*/}

                          {/* NIC Images */}
                          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <span className="font-semibold block mb-2">NIC Front:</span>
                              {selectedVoter.nicFrontImg ? (
                                  <img
                                      src={selectedVoter.nicFrontImg}
                                      alt="NIC Front"
                                      className="w-full h-56 object-cover rounded-lg border cursor-zoom-in hover:opacity-90 transition"
                                      onClick={() => setFullscreenSrc(selectedVoter.nicFrontImg!)}
                                  />
                              ) : (
                                  <img
                                      src="/placeholder-nic-front.png"
                                      alt="NIC Front not available"
                                      className="w-full h-56 object-cover rounded-lg border opacity-70"
                                  />
                              )}
                            </div>

                            <div>
                              <span className="font-semibold block mb-2">NIC Back:</span>
                              {selectedVoter.nicBackImg ? (
                                  <img
                                      src={selectedVoter.nicBackImg}
                                      alt="NIC Back"
                                      className="w-full h-56 object-cover rounded-lg border cursor-zoom-in hover:opacity-90 transition"
                                      onClick={() => setFullscreenSrc(selectedVoter.nicBackImg!)}
                                  />
                              ) : (
                                  <img
                                      src="/placeholder-nic-back.png"
                                      alt="NIC Back not available"
                                      className="w-full h-56 object-cover rounded-lg border opacity-70"
                                  />
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <span className="font-semibold block mb-2">Selfie:</span>
                            {selectedVoter.selfieImg ? (
                                <img
                                    src={selectedVoter.selfieImg}
                                    alt="Selfie"
                                    className="w-44 h-44 object-cover rounded-full border mx-auto cursor-zoom-in hover:opacity-90 transition"
                                    onClick={() => setFullscreenSrc(selectedVoter.selfieImg!)}
                                />
                            ) : (
                                <img
                                    src="/placeholder-selfie.png"
                                    alt="Selfie not available"
                                    className="w-44 h-44 object-cover rounded-full border mx-auto opacity-70"
                                />
                            )}
                          </div>
                        </div>
                      </div>
                  )}

                  {fullscreenSrc && (
                      <div
                          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
                          onClick={() => setFullscreenSrc(null)}
                          role="dialog"
                          aria-modal="true"
                      >
                        <button
                            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullscreenSrc(null);
                            }}
                            aria-label="Close full image"
                            title="Close"
                        >
                          ×
                        </button>

                        <img
                            src={fullscreenSrc}
                            alt="Full-size preview"
                            className="max-w-[95vw] max-h-[95vh] object-contain rounded shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Election Results</h2>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Election"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presidential">Presidential Election 2024</SelectItem>
                    <SelectItem value="provincial">Provincial Council Election</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2"/>
                  Export Results
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Vote Count</CardTitle>
                  <CardDescription>Presidential Election 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {name: "John Silva", party: "Democratic Party", votes: 456789, percentage: 37.2},
                      {name: "Maria Fernando", party: "Progressive Alliance", votes: 398456, percentage: 32.4},
                      {name: "David Perera", party: "National Unity", votes: 234567, percentage: 19.1},
                      {name: "Sarah Jayawardena", party: "Future Forward", votes: 139876, percentage: 11.3},
                    ].map((candidate, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{candidate.name}</h4>
                              <p className="text-sm text-gray-600">{candidate.party}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{candidate.votes.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{candidate.percentage}%</p>
                            </div>
                          </div>
                          <Progress value={candidate.percentage} className="h-2"/>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>District-wise Results</CardTitle>
                  <CardDescription>Vote distribution by district</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {district: "Colombo", totalVotes: 234567, turnout: 72.3},
                      {district: "Kandy", totalVotes: 156789, turnout: 68.9},
                      {district: "Galle", totalVotes: 123456, turnout: 75.1},
                      {district: "Jaffna", totalVotes: 98765, turnout: 71.2},
                      {district: "Anuradhapura", totalVotes: 87654, turnout: 69.8},
                    ].map((district, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <h4 className="font-medium">{district.district}</h4>
                            <p className="text-sm text-gray-600">{district.totalVotes.toLocaleString()} votes</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{district.turnout}%</p>
                            <p className="text-sm text-gray-600">Turnout</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/*/!* System Tab *!/*/}
          {/*<TabsContent value="system" className="space-y-6">*/}
          {/*  <div className="flex justify-between items-center">*/}
          {/*    <h2 className="text-2xl font-bold">System Management</h2>*/}
          {/*    <Button variant="outline">*/}
          {/*      <Settings className="h-4 w-4 mr-2"/>*/}
          {/*      Advanced Settings*/}
          {/*    </Button>*/}
          {/*  </div>*/}

          {/*  <div className="grid lg:grid-cols-2 gap-6">*/}
          {/*    <Card>*/}
          {/*      <CardHeader>*/}
          {/*        <CardTitle>System Status</CardTitle>*/}
          {/*        <CardDescription>Current system health and performance</CardDescription>*/}
          {/*      </CardHeader>*/}
          {/*      <CardContent className="space-y-4">*/}
          {/*        <div className="flex justify-between items-center">*/}
          {/*          <span>Database Status</span>*/}
          {/*          <Badge variant="outline" className="bg-green-50 text-green-700">*/}
          {/*            <CheckCircle className="h-3 w-3 mr-1"/>*/}
          {/*            Online*/}
          {/*          </Badge>*/}
          {/*        </div>*/}
          {/*        <div className="flex justify-between items-center">*/}
          {/*          <span>Backup Status</span>*/}
          {/*          <Badge variant="outline" className="bg-green-50 text-green-700">*/}
          {/*            <CheckCircle className="h-3 w-3 mr-1"/>*/}
          {/*            Up to date*/}
          {/*          </Badge>*/}
          {/*        </div>*/}
          {/*        <div className="flex justify-between items-center">*/}
          {/*          <span>Security Status</span>*/}
          {/*          <Badge variant="outline" className="bg-green-50 text-green-700">*/}
          {/*            <Shield className="h-3 w-3 mr-1"/>*/}
          {/*            Secure*/}
          {/*          </Badge>*/}
          {/*        </div>*/}
          {/*        <div className="flex justify-between items-center">*/}
          {/*          <span>System Load</span>*/}
          {/*          <span className="text-sm font-medium">23%</span>*/}
          {/*        </div>*/}
          {/*        <Progress value={23} className="h-2"/>*/}
          {/*      </CardContent>*/}
          {/*    </Card>*/}

          {/*    <Card>*/}
          {/*      <CardHeader>*/}
          {/*        <CardTitle>System Actions</CardTitle>*/}
          {/*        <CardDescription>Administrative system operations</CardDescription>*/}
          {/*      </CardHeader>*/}
          {/*      <CardContent className="space-y-3">*/}
          {/*        <Button variant="outline" className="w-full justify-start bg-transparent">*/}
          {/*          <Database className="h-4 w-4 mr-2" />*/}
          {/*          Create System Backup*/}
          {/*        </Button>*/}
          {/*        <Button variant="outline" className="w-full justify-start bg-transparent">*/}
          {/*          <Activity className="h-4 w-4 mr-2" />*/}
          {/*          View System Logs*/}
          {/*        </Button>*/}
          {/*        <Button variant="outline" className="w-full justify-start bg-transparent">*/}
          {/*          <Users className="h-4 w-4 mr-2" />*/}
          {/*          Manage User Permissions*/}
          {/*        </Button>*/}
          {/*        <Button variant="outline" className="w-full justify-start bg-transparent">*/}
          {/*          <Shield className="h-4 w-4 mr-2" />*/}
          {/*          Security Audit*/}
          {/*        </Button>*/}
          {/*      </CardContent>*/}
          {/*    </Card>*/}
          {/*  </div>*/}
          {/*</TabsContent>*/}
        </Tabs>
      </div>
    </div>
  )
}

type ActionOptions = {
  action: "verify" | "reject";
  voter: Voter;
  token?: string;
  onAction: (voter: Voter, token?: string) => Promise<any>;
};

function showVerifyToast({ action, voter, token, onAction }: ActionOptions) {
  const actionLabel = action === "verify" ? "Verify" : "Reject";
  const color = action === "reject" ? "red" : "green";
  const message =
      action === "verify"
          ? `Are you sure you want to verify`
          : `Are you sure you want to reject`;

  toast(
      (t) => (
          <div className="flex flex-col items-center justify-center min-w-[240px]">
        <span className="mb-2 text-center">
          {message} <b>{voter.fullName}</b>?
        </span>
            <div className="flex gap-2 mt-2">
              <button
                  className={`px-3 py-1 bg-${color}-600 text-white rounded hover:bg-${color}-700 flex items-center gap-2`}
                  onClick={() => {
                    toast.dismiss(t.id);
                    toast.promise(
                        onAction(voter, token ?? Cookies.get("token")),
                        {
                          loading: `${actionLabel}ing...`,
                          success: () => {
                            // Refresh page after success
                            setTimeout(() => window.location.reload(), 500); // short delay for user to see toast
                            return <b>Voter {actionLabel.toLowerCase()}ed!</b>;
                          },
                          error: (err) =>
                              err instanceof Error
                                  ? err.message
                                  : typeof err === "string"
                                      ? err
                                      : `Could not ${actionLabel.toLowerCase()}.`,
                        },
                        { position: "top-center" }
                    );
                  }}
              >
                <BookCheck className="text-xl" />
                Yes, {actionLabel}
              </button>
              <button
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => toast.dismiss(t.id)}
              >
                No
              </button>
            </div>
          </div>
      ),
      {
        duration: 6000,
        position: "top-center",
        style: { minWidth: "280px" },
      }
  );
}

/**
 * Verifies the voter by calling the backend.
 * Returns a promise for toast.promise.
 */
export async function handleVerify(
    voter: Voter,
    token?: string
): Promise<any> {
  if (!voter?.id) {
    throw new Error("No voter ID found!");
  }
  if (!token) {
    throw new Error("No auth token found!");
  }

  // If you have a token validation function, run it in your component.
  // Example: if (!isValid) { ...redirect... return; }

  try {
    const res = await fetch(
        `http://localhost:8080/api/v1/voter/verify/${voter.id}`,
        {
          method: "PATCH", // or "POST" depending on your API
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
    );
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Failed (${res.status})`);
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}

export async function handleReject(
    voter: Voter,
    token?: string
): Promise<any> {
  if (!voter?.id) {
    throw new Error("No voter ID found!");
  }
  if (!token) {
    throw new Error("No auth token found!");
  }

  try {
    const res = await fetch(
        `http://localhost:8080/api/v1/voter/reject/${voter.id}`,
        {
          method: "PATCH", // or "POST" depending on your API
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
    );
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Failed (${res.status})`);
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}