"use client"

import React, {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Bell, Vote, Clock, CheckCircle, AlertCircle, User, History, Settings, AlertTriangle, Ban} from "lucide-react"
import Link from "next/link"
import LoginPage from "../page";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import Cookies from "js-cookie";
import { useVoterDetails } from "@/hooks/getVoterDetails";
import toast from "react-hot-toast";
import {useElectionDetails} from "@/hooks/getElectionDetails";
import LogoutButton from "@/components/ui/logoutButton";


export default function VoterDashboard() {
  const { isValid, loading } = useTokenValidation();
  // const nicVerified = false;
  const token = Cookies.get("token") || null;
  const username = Cookies.get("username") || null;
  const { voterProfile, loading : voterLoading, error : voterError } = useVoterDetails(token, username);
  const { elections: fetchedElections, loading : electionLoading, error : electionError } = useElectionDetails(token);
  const nicVerified = voterProfile?.verified === "VERIFIED" || voterProfile?.verified === "PENDING";


  const [notifications] = useState([
    { id: 1, message: "Presidential Election voting is now open", type: "info", time: "2 hours ago" },
    { id: 2, message: "Your voter registration has been verified", type: "success", time: "1 day ago" },
    { id: 3, message: "Reminder: Local Council Election ends tomorrow", type: "warning", time: "2 days ago" },
  ])

  const activeElections = fetchedElections;

  const [votingHistory] = useState([
    {
      id: 1,
      election: "Parliamentary Election 2023",
      date: "2023-08-15",
      status: "completed",
      candidate: "John Silva",
    },
    {
      id: 2,
      election: "Local Government Election 2023",
      date: "2023-05-20",
      status: "completed",
      candidate: "Maria Fernando",
    },
  ])

  const electionStatusMap = {
    NOT_STARTED: {
      label: "Not Started",
      color: "bg-gray-200 text-gray-800 border-gray-300"
    },
    VOTING_OPEN: {
      label: "Voting Open",
      color: "bg-blue-100 text-blue-800 border-blue-300"
    },
    VOTING_CLOSED: {
      label: "Voting Closed",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300"
    },
    COUNTING: {
      label: "Counting",
      color: "bg-purple-100 text-purple-800 border-purple-300"
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border-green-300"
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 border-red-300"
    },
    DISPUTED: {
      label: "Disputed",
      color: "bg-orange-100 text-orange-800 border-orange-300"
    },
  };


  const nicStatusMap = {
    PENDING: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      icon: <Clock className="h-3 w-3 mr-1 text-yellow-700" />,
      label: "Pending"
    },
    VERIFIED: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle className="h-3 w-3 mr-1 text-green-700" />,
      label: "Verified"
    },
    SUSPENDED: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: <AlertCircle className="h-3 w-3 mr-1 text-orange-700" />,
      label: "Suspended"
    },
    DEACTIVATED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <Ban className="h-3 w-3 mr-1 text-red-700" />,
      label: "Deactivated"
    }
  };

// Fallback for unknown status
  const badgeProps = nicStatusMap[voterProfile?.verified as keyof typeof nicStatusMap] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    icon: <AlertCircle className="h-3 w-3 mr-1 text-gray-700" />,
    label: "Unknown"
  };

  if (isValid === null) {
    // Still loading, don't redirect or render protected content yet
    return <div>Loading...</div>;
  }

  if (loading || isValid === null) {
    return <div>Checking session…</div>;
  }

  if (!isValid) {
    // Not valid, redirect to login
    window.location.href = "/";
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("username");

    return null; // prevent rendering rest of component
  }

  if (!voterLoading && voterProfile === null) {
    toast.error("Failed to load voter details. Please log in again.");
    return null;
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
              <Badge variant="secondary">Voter Portal</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/*<Button variant="ghost" size="icon" className="relative">*/}
              {/*  <Bell className="h-5 w-5" />*/}
              {/*  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>*/}
              {/*</Button>*/}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center flex flex-col items-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <CardTitle>{voterProfile?.fullName}</CardTitle>
                <CardDescription>Voter ID: {voterProfile?.nicNumber}</CardDescription>
                <Badge variant="outline" className={` w-24 justify-center ${badgeProps.bg} ${badgeProps.text} ${badgeProps.border}` }>
                  {badgeProps.icon}
                  {badgeProps.label}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>District:</span>
                    <span className="font-medium">{voterProfile?.district}</span>
                  </div>
                  {/*<div className="flex justify-between text-sm">*/}
                  {/*  <span>Registration Date:</span>*/}
                  {/*  <span className="font-medium">{}</span>*/}
                  {/*</div>*/}
                  <div className="flex justify-between text-sm">
                    <span>Phone Number:</span>
                    <span className="font-medium">{voterProfile?.phoneNumber}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full mb-1 bg-transparent">
                    <User className="h-4 w-4 mr-2"/>
                    Edit Profile
                  </Button>
                  {!nicVerified && (
                      <Link href="/verify">
                        <Button variant="outline" className="w-full mb-1 bg-transparent">
                          <AlertTriangle className="h-4 w-4 mr-2"/>
                          Verify NIC
                        </Button>
                      </Link>
                  )}
                  <Button variant="outline" className="w-full mb-1 bg-transparent">
                    <Settings className="h-4 w-4 mr-2"/>
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {voterProfile?.fullName?.split(" ")[0]}!</h1>
                <p className="text-gray-600">Stay updated with active elections and cast your vote securely.</p>
              </div>

              {/*/!* Notifications *!/*/}
              {/*<Card>*/}
              {/*<CardHeader>*/}
              {/*    <CardTitle className="flex items-center">*/}
              {/*      <Bell className="h-5 w-5 mr-2" />*/}
              {/*      Recent Notifications*/}
              {/*    </CardTitle>*/}
              {/*  </CardHeader>*/}
              {/*  <CardContent>*/}
              {/*    <div className="space-y-4">*/}
              {/*      {notifications.map((notification) => (*/}
              {/*        <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">*/}
              {/*          <div*/}
              {/*            className={`p-1 rounded-full ${*/}
              {/*              notification.type === "success"*/}
              {/*                ? "bg-green-100"*/}
              {/*                : notification.type === "warning"*/}
              {/*                  ? "bg-yellow-100"*/}
              {/*                  : "bg-blue-100"*/}
              {/*            }`}*/}
              {/*          >*/}
              {/*            {notification.type === "success" ? (*/}
              {/*              <CheckCircle className="h-4 w-4 text-green-600" />*/}
              {/*            ) : notification.type === "warning" ? (*/}
              {/*              <AlertCircle className="h-4 w-4 text-yellow-600" />*/}
              {/*            ) : (*/}
              {/*              <Bell className="h-4 w-4 text-blue-600" />*/}
              {/*            )}*/}
              {/*          </div>*/}
              {/*          <div className="flex-1">*/}
              {/*            <p className="text-sm font-medium">{notification.message}</p>*/}
              {/*            <p className="text-xs text-gray-500">{notification.time}</p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*      ))}*/}
              {/*    </div>*/}
              {/*  </CardContent>*/}
              {/*</Card>*/}

              {/* Active Elections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Vote className="h-5 w-5 mr-2" />
                    Active Elections
                  </CardTitle>
                  <CardDescription>Elections currently open for voting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {electionLoading ? (
                        <div>Loading elections...</div>
                    ) : electionError ? (
                        <div className="text-red-600">Error loading elections: {electionError}</div>
                    ) : (
                        activeElections.map((election) => (
                            <div key={election.id} className="border rounded-lg p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold mb-2">{election.title}</h3>
                                  <p className="text-gray-600 mb-3">{election.description}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1"/>
                Ends: {election.endDate}
              </span>
                                    <span>{election.candidates.length} candidates</span>
                                  </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={`${electionStatusMap[election.status].color} w-fit`}
                                >
                                  {electionStatusMap[election.status].label}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2">
                                  <Link href="/candidates">
                                    <Button variant="outline" size="sm">
                                      View Candidates
                                    </Button>
                                  </Link>
                                  {!election.hasVoted && election.status === "VOTING_OPEN" && (
                                      <Link href="/voting">
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                          Vote Now
                                        </Button>
                                      </Link>
                                  )}
                                </div>
                                {election.hasVoted && (
                                    <div className="flex items-center text-green-600">
                                      <CheckCircle className="h-4 w-4 mr-1"/>
                                      <span className="text-sm font-medium">Vote Cast Successfully</span>
                                    </div>
                                )}
                              </div>
                            </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Voting History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2"/>
                    Voting History
                  </CardTitle>
                  <CardDescription>Your past voting records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {votingHistory.map((vote) => (
                        <div key={vote.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{vote.election}</h4>
                            <p className="text-sm text-gray-600">Voted for: {vote.candidate}</p>
                            <p className="text-xs text-gray-500">{vote.date}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1"/>
                            Completed
                          </Badge>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </div>
  )
}
