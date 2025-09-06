"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Vote, Shield, Clock, CheckCircle, ArrowLeft, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"

export default function VotingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [voteSubmitted, setVoteSubmitted] = useState(false)

  const candidates = [
    {
      id: "1",
      name: "John Silva",
      party: "Democratic Party",
      symbol: "🌟",
      manifesto: "Focus on economic development and education reform",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Maria Fernando",
      party: "Progressive Alliance",
      symbol: "🌱",
      manifesto: "Environmental protection and sustainable development",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "David Perera",
      party: "National Unity",
      symbol: "⭐",
      manifesto: "Unity, peace, and social justice for all citizens",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "4",
      name: "Sarah Jayawardena",
      party: "Future Forward",
      symbol: "🚀",
      manifesto: "Technology innovation and youth empowerment",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const handleVoteSubmit = () => {
    setVoteSubmitted(true)
    setCurrentStep(3)
  }

  const getSelectedCandidateInfo = () => {
    return candidates.find((c) => c.id === selectedCandidate)
  }

  if (voteSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Vote Submitted Successfully!</CardTitle>
            <CardDescription>Your vote has been securely recorded and encrypted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Vote Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Election:</span>
                  <span className="font-medium">Presidential Election 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Vote ID:</span>
                  <span className="font-mono">VT-2024-001234</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <Lock className="h-3 w-3 mr-1" />
                    Encrypted & Verified
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Your vote is anonymous and cannot be traced back to you. Thank you for participating in the democratic
                process!
              </p>
              <div className="space-y-2">
                <Link href="/results">
                  <Button className="w-full">View Live Results</Button>
                </Link>
                <Link href="/voter-dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/voter-dashboard" className="flex items-center space-x-2">
                <Vote className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">E-Vote</span>
              </Link>
              <Badge variant="secondary">Secure Voting</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Encrypted Session
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Clock className="h-3 w-3 mr-1" />
                Time Remaining: 2:45:30
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Presidential Election 2024</h1>
            <div className="text-sm text-gray-600">Step {currentStep} of 3</div>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className={currentStep >= 1 ? "text-blue-600 font-medium" : ""}>Select Candidate</span>
            <span className={currentStep >= 2 ? "text-blue-600 font-medium" : ""}>Confirm Vote</span>
            <span className={currentStep >= 3 ? "text-blue-600 font-medium" : ""}>Vote Submitted</span>
          </div>
        </div>

        {/* Step 1: Candidate Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Candidate</CardTitle>
                <CardDescription>
                  Select one candidate to cast your vote. You can only vote once in this election.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                  <div className="grid gap-6">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <RadioGroupItem value={candidate.id} id={candidate.id} />
                        <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={candidate.image || "/placeholder.svg"} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-semibold">{candidate.name}</h3>
                                <div className="text-2xl">{candidate.symbol}</div>
                              </div>
                              <p className="text-gray-600 font-medium mb-1">{candidate.party}</p>
                              <p className="text-sm text-gray-500">{candidate.manifesto}</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Link href="/voter-dashboard">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedCandidate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Confirmation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Vote Confirmation */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Confirm Your Vote</CardTitle>
                <CardDescription>
                  Please review your selection carefully. Once submitted, your vote cannot be changed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCandidate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">You are voting for:</h3>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={getSelectedCandidateInfo()?.image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {getSelectedCandidateInfo()
                            ?.name.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-2xl font-bold">{getSelectedCandidateInfo()?.name}</h4>
                          <div className="text-3xl">{getSelectedCandidateInfo()?.symbol}</div>
                        </div>
                        <p className="text-lg text-gray-700 font-medium">{getSelectedCandidateInfo()?.party}</p>
                        <p className="text-gray-600">{getSelectedCandidateInfo()?.manifesto}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Important Security Information</h4>
                      <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                        <li>• Your vote will be encrypted and anonymized</li>
                        <li>• No one can trace your vote back to you</li>
                        <li>• Your vote cannot be changed once submitted</li>
                        <li>• You can only vote once in this election</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Vote className="h-4 w-4 mr-2" />
                    Submit My Vote
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Vote Submission</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to submit your vote for <strong>{getSelectedCandidateInfo()?.name}</strong>?
                      This action cannot be undone and you will not be able to vote again in this election.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleVoteSubmit} className="bg-green-600 hover:bg-green-700">
                      Yes, Submit Vote
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
