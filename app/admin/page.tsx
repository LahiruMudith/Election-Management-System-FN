"use client"

import React, { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { useTokenValidation } from "@/hooks/useTokenValidation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";


export default function AdminDashboard() {
  const { isValid } = useTokenValidation();
  const [activeTab, setActiveTab] = useState("overview")

  const stats = {
    totalVoters: 2847563,
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
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
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
            <TabsTrigger value="voters">Voters</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVoters.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified Voters</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.verifiedVoters.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">94.8% verification rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
                  <Vote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeElections}</div>
                  <p className="text-xs text-muted-foreground">2 elections in progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.systemUptime}</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            activity.type === "user"
                              ? "bg-blue-100"
                              : activity.type === "election"
                                ? "bg-green-100"
                                : activity.type === "verification"
                                  ? "bg-yellow-100"
                                  : "bg-gray-100"
                          }`}
                        >
                          {activity.type === "user" ? (
                            <Users className="h-4 w-4" />
                          ) : activity.type === "election" ? (
                            <Vote className="h-4 w-4" />
                          ) : activity.type === "verification" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Database className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Election
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Voter Registrations
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    System Configuration
                  </Button>
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

          {/* Voters Tab */}
          <TabsContent value="voters" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Voter Management</h2>
              <div className="flex space-x-2">
                <Input placeholder="Search voters..." className="w-64" />
                <Button variant="outline">Export</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Verifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">1,247</div>
                  <p className="text-sm text-gray-600">Voters awaiting verification</p>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    Review Pending
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verified Voters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">2,698,432</div>
                  <p className="text-sm text-gray-600">Successfully verified voters</p>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    View All
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rejected Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">1,884</div>
                  <p className="text-sm text-gray-600">Applications rejected</p>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    Review Rejected
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Voter List Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Voter Registrations</CardTitle>
                <CardDescription>Latest voter registration applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "John Silva",
                      nic: "123456789V",
                      district: "Colombo",
                      status: "verified",
                      date: "2024-01-15",
                    },
                    {
                      name: "Maria Fernando",
                      nic: "987654321V",
                      district: "Kandy",
                      status: "pending",
                      date: "2024-01-14",
                    },
                    {
                      name: "David Perera",
                      nic: "456789123V",
                      district: "Galle",
                      status: "verified",
                      date: "2024-01-13",
                    },
                    {
                      name: "Sarah Jayawardena",
                      nic: "789123456V",
                      district: "Jaffna",
                      status: "rejected",
                      date: "2024-01-12",
                    },
                  ].map((voter, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{voter.name}</h4>
                        <p className="text-sm text-gray-600">
                          {voter.nic} • {voter.district}
                        </p>
                        <p className="text-xs text-gray-500">{voter.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            voter.status === "verified"
                              ? "default"
                              : voter.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {voter.status === "verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {voter.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {voter.status === "rejected" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {voter.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                    <SelectValue placeholder="Select Election" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presidential">Presidential Election 2024</SelectItem>
                    <SelectItem value="provincial">Provincial Council Election</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
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
                      { name: "John Silva", party: "Democratic Party", votes: 456789, percentage: 37.2 },
                      { name: "Maria Fernando", party: "Progressive Alliance", votes: 398456, percentage: 32.4 },
                      { name: "David Perera", party: "National Unity", votes: 234567, percentage: 19.1 },
                      { name: "Sarah Jayawardena", party: "Future Forward", votes: 139876, percentage: 11.3 },
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
                        <Progress value={candidate.percentage} className="h-2" />
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
                      { district: "Colombo", totalVotes: 234567, turnout: 72.3 },
                      { district: "Kandy", totalVotes: 156789, turnout: 68.9 },
                      { district: "Galle", totalVotes: 123456, turnout: 75.1 },
                      { district: "Jaffna", totalVotes: 98765, turnout: 71.2 },
                      { district: "Anuradhapura", totalVotes: 87654, turnout: 69.8 },
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

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">System Management</h2>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Database Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Backup Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Up to date
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Security Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <Shield className="h-3 w-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>System Load</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Actions</CardTitle>
                  <CardDescription>Administrative system operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Database className="h-4 w-4 mr-2" />
                    Create System Backup
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Activity className="h-4 w-4 mr-2" />
                    View System Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Manage User Permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
