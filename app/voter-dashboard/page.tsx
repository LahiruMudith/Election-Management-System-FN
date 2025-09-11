"use client"

import React, {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Bell, Vote, Clock, CheckCircle, AlertCircle, User, History, Settings, AlertTriangle} from "lucide-react"
import Link from "next/link"
import LoginPage from "../page";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import Cookies from "js-cookie";



export default function VoterDashboard() {
  const { isValid } = useTokenValidation();
  const nicVerified = false;


  const [notifications] = useState([
    { id: 1, message: "Presidential Election voting is now open", type: "info", time: "2 hours ago" },
    { id: 2, message: "Your voter registration has been verified", type: "success", time: "1 day ago" },
    { id: 3, message: "Reminder: Local Council Election ends tomorrow", type: "warning", time: "2 days ago" },
  ])

  const [activeElections] = useState([
    {
      id: 1,
      title: "Presidential Election 2024",
      description: "Choose the next President of Sri Lanka",
      endDate: "2024-02-15",
      status: "active",
      hasVoted: false,
      candidates: 8,
    },
    {
      id: 2,
      title: "Provincial Council Election",
      description: "Western Province Council Election",
      endDate: "2024-03-01",
      status: "active",
      hasVoted: true,
      candidates: 12,
    },
  ])

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

  if (isValid === null) {
    // Still loading, don't redirect or render protected content yet
    return <div>Loading...</div>;
  }

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
              <Badge variant="secondary">Voter Portal</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <CardTitle>John Doe</CardTitle>
                <CardDescription>Voter ID: 123456789V</CardDescription>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>District:</span>
                    <span className="font-medium">Colombo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Polling Division:</span>
                    <span className="font-medium">Colombo Central</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Registration Date:</span>
                    <span className="font-medium">Jan 15, 2024</span>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
                <p className="text-gray-600">Stay updated with active elections and cast your vote securely.</p>
              </div>

              {/* Notifications */}
              <Card>
              <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                        <div
                          className={`p-1 rounded-full ${
                            notification.type === "success"
                              ? "bg-green-100"
                              : notification.type === "warning"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                          }`}
                        >
                          {notification.type === "success" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : notification.type === "warning" ? (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <Bell className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                    {activeElections.map((election) => (
                      <div key={election.id} className="border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{election.title}</h3>
                            <p className="text-gray-600 mb-3">{election.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Ends: {election.endDate}
                              </span>
                              <span>{election.candidates} candidates</span>
                            </div>
                          </div>
                          <Badge variant={election.hasVoted ? "secondary" : "default"}>
                            {election.hasVoted ? "Voted" : "Active"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Link href="/candidates">
                              <Button variant="outline" size="sm">
                                View Candidates
                              </Button>
                            </Link>
                            {!election.hasVoted && (
                              <Link href="/voting">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  Vote Now
                                </Button>
                              </Link>
                            )}
                          </div>
                          {election.hasVoted && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">Vote Cast Successfully</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Voting History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
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
                          <CheckCircle className="h-3 w-3 mr-1" />
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
