"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, MapPin, RefreshCw, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const [selectedElection, setSelectedElection] = useState("presidential")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLive, setIsLive] = useState(true)

  // Simulate live updates
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isLive])

  const electionData = {
    presidential: {
      title: "Presidential Election 2024",
      totalVotes: 1234567,
      totalRegistered: 2847563,
      turnout: 43.4,
      candidates: [
        {
          id: 1,
          name: "John Silva",
          party: "Democratic Party",
          symbol: "🌟",
          votes: 456789,
          percentage: 37.2,
          color: "bg-blue-500",
          districts: { colombo: 45.2, kandy: 32.1, galle: 41.8, jaffna: 28.9 },
        },
        {
          id: 2,
          name: "Maria Fernando",
          party: "Progressive Alliance",
          symbol: "🌱",
          votes: 398456,
          percentage: 32.4,
          color: "bg-green-500",
          districts: { colombo: 35.8, kandy: 38.7, galle: 29.3, jaffna: 31.2 },
        },
        {
          id: 3,
          name: "David Perera",
          party: "National Unity",
          symbol: "⭐",
          votes: 234567,
          percentage: 19.1,
          color: "bg-purple-500",
          districts: { colombo: 12.4, kandy: 19.8, galle: 22.1, jaffna: 25.6 },
        },
        {
          id: 4,
          name: "Sarah Jayawardena",
          party: "Future Forward",
          symbol: "🚀",
          votes: 139876,
          percentage: 11.3,
          color: "bg-orange-500",
          districts: { colombo: 6.6, kandy: 9.4, galle: 6.8, jaffna: 14.3 },
        },
      ],
    },
  }

  const currentElection = electionData[selectedElection as keyof typeof electionData]

  const districtResults = [
    { name: "Colombo", totalVotes: 234567, turnout: 72.3, leading: "John Silva" },
    { name: "Kandy", totalVotes: 156789, turnout: 68.9, leading: "Maria Fernando" },
    { name: "Galle", totalVotes: 123456, turnout: 75.1, leading: "John Silva" },
    { name: "Jaffna", totalVotes: 98765, turnout: 71.2, leading: "David Perera" },
    { name: "Anuradhapura", totalVotes: 87654, turnout: 69.8, leading: "John Silva" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">E-Vote Results</span>
              </Link>
              {isLive && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 animate-pulse">
                  <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                  LIVE
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Last updated: {lastUpdated.toLocaleTimeString()}</div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Election Selector */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Live Election Results</h1>
            <Select value={selectedElection} onValueChange={setSelectedElection}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presidential">Presidential Election 2024</SelectItem>
                <SelectItem value="provincial">Provincial Council Election</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentElection.totalVotes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  of {currentElection.totalRegistered.toLocaleString()} registered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentElection.turnout}%</div>
                <Progress value={currentElection.turnout} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leading Candidate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentElection.candidates[0].name}</div>
                <p className="text-xs text-muted-foreground">{currentElection.candidates[0].percentage}% of votes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Districts Reporting</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">22/25</div>
                <p className="text-xs text-muted-foreground">88% districts reported</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="districts">District Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Candidate Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Candidate Results
                  </CardTitle>
                  <CardDescription>Live vote count for {currentElection.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentElection.candidates.map((candidate, index) => (
                      <div key={candidate.id} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{candidate.symbol}</div>
                            <div>
                              <h4 className="font-semibold text-lg">{candidate.name}</h4>
                              <p className="text-sm text-gray-600">{candidate.party}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{candidate.percentage}%</div>
                            <p className="text-sm text-gray-600">{candidate.votes.toLocaleString()} votes</p>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={candidate.percentage} className="h-3" />
                          <div
                            className={`absolute top-0 left-0 h-3 rounded-full ${candidate.color}`}
                            style={{ width: `${candidate.percentage}%` }}
                          ></div>
                        </div>
                        {index === 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Leading
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vote Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Vote Distribution</CardTitle>
                  <CardDescription>Visual representation of current results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Simple bar chart representation */}
                    <div className="relative h-64 flex items-end justify-center space-x-4">
                      {currentElection.candidates.map((candidate) => (
                        <div key={candidate.id} className="flex flex-col items-center">
                          <div
                            className={`w-16 ${candidate.color} rounded-t-lg flex items-end justify-center text-white text-xs font-bold pb-2`}
                            style={{ height: `${(candidate.percentage / 40) * 200}px` }}
                          >
                            {candidate.percentage}%
                          </div>
                          <div className="text-xs mt-2 text-center">
                            <div className="text-lg mb-1">{candidate.symbol}</div>
                            <div className="font-medium">{candidate.name.split(" ")[0]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Districts Tab */}
          <TabsContent value="districts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    District Summary
                  </CardTitle>
                  <CardDescription>Vote count and turnout by district</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {districtResults.map((district, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{district.name}</h4>
                          <p className="text-sm text-gray-600">
                            {district.totalVotes.toLocaleString()} votes • {district.turnout}% turnout
                          </p>
                          <p className="text-sm font-medium text-blue-600">Leading: {district.leading}</p>
                        </div>
                        <Badge variant="outline">Reported</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>District-wise Breakdown</CardTitle>
                  <CardDescription>Detailed results by district</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(currentElection.candidates[0].districts).map(([district, percentage]) => (
                      <div key={district} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium capitalize">{district}</h4>
                          <span className="text-sm font-semibold">{percentage}%</span>
                        </div>
                        <div className="space-y-1">
                          {currentElection.candidates.map((candidate) => (
                            <div key={candidate.id} className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${candidate.color}`}></div>
                              <span className="text-sm">{candidate.name.split(" ")[0]}</span>
                              <span className="text-sm font-medium ml-auto">
                                {candidate.districts[district as keyof typeof candidate.districts]}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Voting Trends</CardTitle>
                  <CardDescription>Hourly voting patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Voting trend chart would be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">Real-time analytics visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Statistics</CardTitle>
                  <CardDescription>Important election metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">68.5%</div>
                      <p className="text-sm text-blue-700">Peak Turnout</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">2.1M</div>
                      <p className="text-sm text-green-700">Votes Processed</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">25</div>
                      <p className="text-sm text-purple-700">Districts</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">99.8%</div>
                      <p className="text-sm text-orange-700">System Uptime</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Election Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Voting started: 7:00 AM</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Peak voting: 2:30 PM</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Current time: {new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm">Voting ends: 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Link href="/voter-dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
