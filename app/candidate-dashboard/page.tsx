"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  BarChart3,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Edit,
  Camera,
  FileText,
  Share2,
  Activity,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useTokenValidation } from "@/hooks/useTokenValidation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";


export default function CandidateDashboard() {
  const { isValid } = useTokenValidation();

  const [candidateData] = useState({
    name: "John Silva",
    party: "Democratic Party",
    symbol: "🌟",
    position: "Presidential Candidate",
    district: "National",
    votes: 456789,
    percentage: 37.2,
    rank: 1,
    totalCandidates: 8,
    campaignEvents: 45,
    socialReach: 125000,
  })

  const [districtResults] = useState([
    { district: "Colombo", votes: 89456, percentage: 45.2, rank: 1 },
    { district: "Kandy", votes: 67234, percentage: 32.1, rank: 2 },
    { district: "Galle", votes: 54321, percentage: 41.8, rank: 1 },
    { district: "Jaffna", votes: 43210, percentage: 28.9, rank: 3 },
    { district: "Anuradhapura", votes: 38765, percentage: 35.4, rank: 2 },
  ])

  const [campaignEvents] = useState([
    { id: 1, title: "Rally in Colombo", date: "2024-02-10", attendees: 15000, status: "completed" },
    { id: 2, title: "Town Hall Meeting - Kandy", date: "2024-02-12", attendees: 8500, status: "completed" },
    { id: 3, title: "Youth Forum - Galle", date: "2024-02-14", attendees: 5200, status: "upcoming" },
    { id: 4, title: "Agricultural Summit", date: "2024-02-16", attendees: 3000, status: "upcoming" },
  ])

  const [manifesto, setManifesto] = useState({
    title: "Building a Better Tomorrow",
    summary: "A comprehensive plan for economic growth, education reform, and sustainable development.",
    keyPoints: [
      "Economic Development & Job Creation",
      "Education System Reform",
      "Healthcare Accessibility",
      "Environmental Protection",
      "Digital Infrastructure",
    ],
  })

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
                <User className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">E-Vote</span>
              </Link>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Candidate Portal
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Campaign Active
              </Badge>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JS</AvatarFallback>
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
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-3xl">{candidateData.symbol}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{candidateData.name}</CardTitle>
                <CardDescription>{candidateData.party}</CardDescription>
                <Badge className="mt-2">{candidateData.position}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">#{candidateData.rank}</div>
                  <p className="text-sm text-blue-700">Current Ranking</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Votes:</span>
                    <span className="font-bold">{candidateData.votes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vote Share:</span>
                    <span className="font-bold">{candidateData.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Campaign Events:</span>
                    <span className="font-bold">{candidateData.campaignEvents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Social Reach:</span>
                    <span className="font-bold">{candidateData.socialReach.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Update Photo
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {candidateData.name}!</h1>
                <p className="text-gray-600">Track your campaign performance and manage your election activities.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Live Votes</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{candidateData.votes.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last hour</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vote Share</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{candidateData.percentage}%</div>
                    <Progress value={candidateData.percentage} className="mt-2 h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ranking</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">#{candidateData.rank}</div>
                    <p className="text-xs text-muted-foreground">of {candidateData.totalCandidates} candidates</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Social Reach</CardTitle>
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{candidateData.socialReach.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Across all platforms</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs Content */}
              <Tabs defaultValue="performance" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="campaign">Campaign</TabsTrigger>
                  <TabsTrigger value="manifesto">Manifesto</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        District-wise Performance
                      </CardTitle>
                      <CardDescription>Your voting performance across different districts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {districtResults.map((district, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">{district.district}</span>
                                <Badge variant={district.rank === 1 ? "default" : "secondary"}>
                                  Rank #{district.rank}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{district.percentage}%</div>
                                <div className="text-sm text-gray-600">{district.votes.toLocaleString()} votes</div>
                              </div>
                            </div>
                            <Progress value={district.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Vote Trend</CardTitle>
                        <CardDescription>Hourly vote progression</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Vote trend chart</p>
                          <p className="text-sm text-gray-500 mt-2">Real-time voting analytics</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Metrics</CardTitle>
                        <CardDescription>Important performance indicators</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Lead Margin</span>
                          <span className="font-bold text-green-600">+58,333 votes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Districts Leading</span>
                          <span className="font-bold">3 of 5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Vote Growth Rate</span>
                          <span className="font-bold text-blue-600">+2.5%/hour</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Projected Final %</span>
                          <span className="font-bold">39.8%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Campaign Tab */}
                <TabsContent value="campaign" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Campaign Events
                      </CardTitle>
                      <CardDescription>Manage your campaign schedule and events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {campaignEvents.map((event) => (
                          <div key={event.id} className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.date}</p>
                              <p className="text-sm text-gray-500">
                                Expected: {event.attendees.toLocaleString()} attendees
                              </p>
                            </div>
                            <Badge variant={event.status === "completed" ? "default" : "secondary"}>
                              {event.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule New Event
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Campaign Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{candidateData.campaignEvents}</div>
                          <p className="text-sm text-blue-700">Total Events</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">89,200</div>
                          <p className="text-sm text-green-700">Total Attendees</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">15</div>
                          <p className="text-sm text-purple-700">Districts Covered</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Social Media Reach</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Facebook</span>
                          <span className="font-bold">45,000 followers</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Twitter</span>
                          <span className="font-bold">32,000 followers</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Instagram</span>
                          <span className="font-bold">28,000 followers</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">YouTube</span>
                          <span className="font-bold">20,000 subscribers</span>
                        </div>
                        <Button variant="outline" className="w-full mt-4 bg-transparent">
                          <Share2 className="h-4 w-4 mr-2" />
                          Manage Social Media
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Manifesto Tab */}
                <TabsContent value="manifesto" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Election Manifesto
                      </CardTitle>
                      <CardDescription>Manage your election promises and policy positions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="manifestoTitle">Manifesto Title</Label>
                          <Input
                            id="manifestoTitle"
                            value={manifesto.title}
                            onChange={(e) => setManifesto((prev) => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="manifestoSummary">Summary</Label>
                          <Textarea
                            id="manifestoSummary"
                            rows={3}
                            value={manifesto.summary}
                            onChange={(e) => setManifesto((prev) => ({ ...prev, summary: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">Key Policy Points</Label>
                        <div className="mt-3 space-y-2">
                          {manifesto.keyPoints.map((point, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                                {index + 1}
                              </div>
                              <span className="flex-1">{point}</span>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 bg-transparent">
                          Add New Policy Point
                        </Button>
                      </div>

                      <div className="flex space-x-4">
                        <Button>
                          <FileText className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Publish Manifesto
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Voter Demographics</CardTitle>
                        <CardDescription>Analysis of your voter base</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Demographic analysis chart</p>
                          <p className="text-sm text-gray-500 mt-2">Age, gender, and regional breakdown</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Campaign Impact</CardTitle>
                        <CardDescription>Event effectiveness analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Campaign impact metrics</p>
                          <p className="text-sm text-gray-500 mt-2">Event ROI and voter conversion</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Analytics</CardTitle>
                      <CardDescription>Comprehensive performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">68.5%</div>
                          <p className="text-xs text-blue-700">Voter Recognition</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">42.3%</div>
                          <p className="text-xs text-green-700">Approval Rating</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">89.2%</div>
                          <p className="text-xs text-purple-700">Message Clarity</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-xl font-bold text-orange-600">76.8%</div>
                          <p className="text-xs text-orange-700">Trust Score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
