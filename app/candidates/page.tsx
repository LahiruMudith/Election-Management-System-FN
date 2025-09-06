"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Users,
  Calendar,
  FileText,
  Star,
  Vote,
  Info,
  GraduationCap,
  Briefcase,
  Award,
  Heart,
  Target,
  TrendingUp,
  Phone,
  Mail,
  Globe,
  Facebook,
  Twitter,
} from "lucide-react"
import Link from "next/link"

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParty, setSelectedParty] = useState("all")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [selectedElection, setSelectedElection] = useState("presidential")

  const candidates = [
    {
      id: 1,
      name: "John Silva",
      party: "Democratic Party",
      symbol: "🌟",
      candidateNumber: 1,
      district: "National",
      age: 52,
      experience: "15 years",
      education: "PhD in Economics, University of Colombo; MBA, Harvard Business School",
      profession: "Former Finance Minister & Economist",
      manifesto:
        "Focus on economic development, job creation, and education reform. Committed to reducing poverty and improving healthcare accessibility for all Sri Lankan citizens.",
      keyPolicies: [
        "Create 500,000 new jobs in 5 years through industrial development",
        "Increase education budget by 25% and modernize curriculum",
        "Universal healthcare coverage with free basic medical services",
        "Digital infrastructure development in rural areas",
        "Reduce income tax for middle-class families",
        "Establish technology parks in every province",
      ],
      achievements: [
        "Reduced national debt by 15% as Finance Minister",
        "Implemented successful poverty reduction programs",
        "Led digital transformation initiatives",
      ],
      image: "/placeholder.svg?height=150&width=150",
      socialMedia: {
        facebook: "johnsilva2024",
        twitter: "@johnsilva_lk",
        website: "www.johnsilva2024.lk",
        email: "contact@johnsilva2024.lk",
        phone: "+94 77 123 4567",
      },
      campaignStats: {
        events: 45,
        attendees: 125000,
        districts: 22,
        endorsements: 156,
      },
      currentVotes: 456789,
      votePercentage: 37.2,
      ranking: 1,
    },
    {
      id: 2,
      name: "Maria Fernando",
      party: "Progressive Alliance",
      symbol: "🌱",
      candidateNumber: 2,
      district: "National",
      age: 48,
      experience: "12 years",
      education: "Masters in Public Administration, Harvard University; LLB, University of Peradeniya",
      profession: "Environmental Lawyer & Human Rights Activist",
      manifesto:
        "Champion of environmental protection and sustainable development. Advocate for women's rights, social justice, and inclusive economic growth that benefits all communities.",
      keyPolicies: [
        "Achieve carbon neutrality by 2035 through renewable energy",
        "50% renewable energy target by 2030",
        "Women's economic empowerment programs",
        "Sustainable agriculture and organic farming initiatives",
        "Free legal aid for marginalized communities",
        "Environmental protection and reforestation programs",
      ],
      achievements: [
        "Successfully defended 200+ environmental cases",
        "Established women's rights legal clinic",
        "Led climate change awareness campaigns",
      ],
      image: "/placeholder.svg?height=150&width=150",
      socialMedia: {
        facebook: "mariafernando2024",
        twitter: "@maria_fernando",
        website: "www.mariafernando.lk",
        email: "info@mariafernando.lk",
        phone: "+94 77 234 5678",
      },
      campaignStats: {
        events: 38,
        attendees: 98000,
        districts: 20,
        endorsements: 134,
      },
      currentVotes: 398456,
      votePercentage: 32.4,
      ranking: 2,
    },
    {
      id: 3,
      name: "David Perera",
      party: "National Unity",
      symbol: "⭐",
      candidateNumber: 3,
      district: "National",
      age: 59,
      experience: "20 years",
      education: "LLB, University of Peradeniya; Masters in International Law, Oxford University",
      profession: "Supreme Court Lawyer & Former Attorney General",
      manifesto:
        "Unity, peace, and social justice for all citizens. Focus on reconciliation, national harmony, and building bridges between communities while ensuring equal opportunities for everyone.",
      keyPolicies: [
        "National reconciliation and unity programs",
        "Comprehensive justice system reform",
        "Anti-corruption measures and transparency",
        "Rural development and infrastructure projects",
        "Inter-community dialogue and peace building",
        "Constitutional reforms for better governance",
      ],
      achievements: [
        "Led major constitutional reform initiatives",
        "Established community mediation programs",
        "Reduced case backlogs by 40% as Attorney General",
      ],
      image: "/placeholder.svg?height=150&width=150",
      socialMedia: {
        facebook: "davidperera2024",
        twitter: "@david_perera",
        website: "www.davidperera.lk",
        email: "contact@davidperera.lk",
        phone: "+94 77 345 6789",
      },
      campaignStats: {
        events: 52,
        attendees: 87000,
        districts: 25,
        endorsements: 189,
      },
      currentVotes: 234567,
      votePercentage: 19.1,
      ranking: 3,
    },
    {
      id: 4,
      name: "Sarah Jayawardena",
      party: "Future Forward",
      symbol: "🚀",
      candidateNumber: 4,
      district: "National",
      age: 44,
      experience: "8 years",
      education: "MBA, London Business School; BSc Computer Science, University of Moratuwa",
      profession: "Tech Entrepreneur & Innovation Leader",
      manifesto:
        "Technology innovation and youth empowerment. Building a digital-first economy for the future with focus on entrepreneurship, innovation, and preparing Sri Lanka for the digital age.",
      keyPolicies: [
        "National digital transformation initiative",
        "Youth entrepreneurship fund worth Rs. 10 billion",
        "STEM education expansion in all schools",
        "Innovation hubs and tech parks in every district",
        "Digital government services and e-governance",
        "Startup visa program to attract global talent",
      ],
      achievements: [
        "Founded 3 successful tech companies",
        "Created 5000+ jobs in tech sector",
        "Led national digitization projects",
      ],
      image: "/placeholder.svg?height=150&width=150",
      socialMedia: {
        facebook: "sarahjayawardena2024",
        twitter: "@sarah_j_lk",
        website: "www.sarahj2024.lk",
        email: "hello@sarahj2024.lk",
        phone: "+94 77 456 7890",
      },
      campaignStats: {
        events: 29,
        attendees: 65000,
        districts: 18,
        endorsements: 98,
      },
      currentVotes: 139876,
      votePercentage: 11.3,
      ranking: 4,
    },
  ]

  const elections = [
    { id: "presidential", name: "Presidential Election 2024", active: true },
    { id: "parliamentary", name: "Parliamentary Election 2024", active: false },
    { id: "provincial", name: "Provincial Council Election", active: true },
  ]

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.profession.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesParty = selectedParty === "all" || candidate.party === selectedParty
    const matchesDistrict = selectedDistrict === "all" || candidate.district === selectedDistrict

    return matchesSearch && matchesParty && matchesDistrict
  })

  const CandidateCard = ({ candidate }: { candidate: (typeof candidates)[0] }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-3 gap-0">
          {/* Candidate Photo and Basic Info */}
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={candidate.image || "/placeholder.svg"} alt={candidate.name} />
                <AvatarFallback className="text-4xl bg-white">{candidate.symbol}</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {candidate.candidateNumber}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{candidate.name}</h3>
            <Badge className="mb-2" variant="secondary">
              {candidate.party}
            </Badge>
            <div className="text-6xl mb-4">{candidate.symbol}</div>

            <div className="space-y-2 text-sm text-gray-600 w-full">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Age: {candidate.age}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Award className="h-4 w-4" />
                <span>{candidate.experience} experience</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Rank #{candidate.ranking}</span>
              </div>
            </div>

            {/* Live Stats */}
            <div className="mt-4 p-3 bg-white rounded-lg w-full">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{candidate.votePercentage}%</div>
                <div className="text-xs text-gray-600">{candidate.currentVotes.toLocaleString()} votes</div>
              </div>
            </div>
          </div>

          {/* Candidate Details */}
          <div className="lg:col-span-2 p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="background">Background</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Election Manifesto
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{candidate.manifesto}</p>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Quick Facts
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profession:</span>
                        <span className="font-medium">{candidate.profession.split("&")[0].trim()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{candidate.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{candidate.district}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Campaign Stats
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Events:</span>
                        <span className="font-medium">{candidate.campaignStats.events}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Attendees:</span>
                        <span className="font-medium">{candidate.campaignStats.attendees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Districts:</span>
                        <span className="font-medium">{candidate.campaignStats.districts}/25</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Info className="h-4 w-4 mr-2" />
                        More Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={candidate.image || "/placeholder.svg"} />
                            <AvatarFallback>{candidate.symbol}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-bold">{candidate.name}</h3>
                            <p className="text-gray-600">{candidate.party}</p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Key Achievements</h4>
                          <ul className="space-y-1">
                            {candidate.achievements.map((achievement, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start">
                                <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Full Education Background</h4>
                          <p className="text-sm text-gray-700">{candidate.education}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Professional Experience</h4>
                          <p className="text-sm text-gray-700">{candidate.profession}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Link href="/voting">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Vote className="h-4 w-4 mr-2" />
                      Vote for {candidate.name.split(" ")[0]}
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="policies" className="space-y-4 mt-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Key Policy Positions
                </h4>
                <div className="grid gap-3">
                  {candidate.keyPolicies.map((policy, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1">{policy}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Full Manifesto (PDF)
                </Button>
              </TabsContent>

              <TabsContent value="background" className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{candidate.education}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Professional Background
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{candidate.profession}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Key Achievements
                  </h4>
                  <div className="space-y-2">
                    {candidate.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Political Experience
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Extensive experience in {candidate.experience} of political leadership, policy development, and
                    public administration. Known for commitment to democratic values, transparent governance, and
                    serving the people of Sri Lanka with dedication and integrity.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-4">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Get in Touch
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-gray-600">{candidate.socialMedia.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-gray-600">{candidate.socialMedia.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <p className="text-sm text-blue-600">{candidate.socialMedia.website}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Facebook className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">Facebook</p>
                        <p className="text-sm text-gray-600">{candidate.socialMedia.facebook}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h5 className="font-semibold mb-3">Follow Campaign Updates</h5>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Newsletter
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">E-Vote Candidates</span>
              </Link>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {elections.find((e) => e.id === selectedElection)?.name}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Users className="h-3 w-3 mr-1" />
                {filteredCandidates.length} Candidates
              </Badge>
              <Link href="/voting">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Vote className="h-4 w-4 mr-2" />
                  Vote Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meet the Candidates</h1>
          <p className="text-gray-600">
            Learn about the candidates, their policies, and make an informed choice for your vote.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Find Candidates
            </CardTitle>
            <CardDescription>Search and filter candidates by name, party, or district</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Election</label>
                <Select value={selectedElection} onValueChange={setSelectedElection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((election) => (
                      <SelectItem key={election.id} value={election.id} disabled={!election.active}>
                        {election.name} {!election.active && "(Inactive)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Party</label>
                <Select value={selectedParty} onValueChange={setSelectedParty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parties</SelectItem>
                    <SelectItem value="Democratic Party">Democratic Party</SelectItem>
                    <SelectItem value="Progressive Alliance">Progressive Alliance</SelectItem>
                    <SelectItem value="National Unity">National Unity</SelectItem>
                    <SelectItem value="Future Forward">Future Forward</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="Colombo">Colombo</SelectItem>
                    <SelectItem value="Kandy">Kandy</SelectItem>
                    <SelectItem value="Galle">Galle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <div className="space-y-8">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>

        {/* No Results */}
        {filteredCandidates.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters to find candidates.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedParty("all")
                  setSelectedDistrict("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Voting Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Info className="h-5 w-5 mr-2" />
              How to Vote
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Review Candidates</h4>
                  <p>Study each candidate's policies and background</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Make Your Choice</h4>
                  <p>Select the candidate that best represents your values</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Cast Your Vote</h4>
                  <p>Use the secure online voting system to submit your ballot</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/voting">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Vote className="h-4 w-4 mr-2" />
                  Start Voting Process
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
