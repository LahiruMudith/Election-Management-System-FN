"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Plus,
    ArrowLeft,
    CheckCircle,
    Info,
    Calendar,
    Settings,
    Users,
    Shield,
    Vote,
    Trash2,
    Edit,
    Upload,
    X,
} from "lucide-react"
import Link from "next/link"

export default function CreateElectionPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showAddCandidateModal, setShowAddCandidateModal] = useState(false)

    const [formData, setFormData] = useState({
        // Step 1: Basic Details
        title: "",
        type: "",
        description: "",
        startDate: "",
        endDate: "",

        // Step 2: Election Settings
        votingMethod: "single-choice",
        eligibleDistricts: [] as string[],
        minAge: "18",
        requireVerification: true,
        allowEarlyResults: false,
        enableNotifications: true,

        // Step 3: Candidates
        candidates: [] as Array<{
            id: string
            name: string
            party: string
            age: string
            profession: string
            manifesto: string
            photo: string | null
        }>,
    })

    const [newCandidate, setNewCandidate] = useState({
        name: "",
        party: "",
        age: "",
        profession: "",
        manifesto: "",
        photo: null as string | null,
    })

    const districts = [
        "Colombo",
        "Kandy",
        "Galle",
        "Jaffna",
        "Anuradhapura",
        "Polonnaruwa",
        "Kurunegala",
        "Ratnapura",
        "Badulla",
        "Batticaloa",
        "Ampara",
        "Trincomalee",
        "Kalutara",
        "Gampaha",
        "Matara",
        "Hambantota",
        "Monaragala",
        "Kegalle",
        "Puttalam",
        "Vavuniya",
        "Mullaitivu",
        "Kilinochchi",
        "Mannar",
        "Nuwara Eliya",
        "Matale",
    ]

    const electionTypes = [
        { value: "presidential", label: "Presidential Election" },
        { value: "parliamentary", label: "Parliamentary Election" },
        { value: "provincial", label: "Provincial Council Election" },
        { value: "local", label: "Local Government Election" },
        { value: "referendum", label: "Referendum" },
    ]

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleDistrictToggle = (district: string) => {
        setFormData((prev) => ({
            ...prev,
            eligibleDistricts: prev.eligibleDistricts.includes(district)
                ? prev.eligibleDistricts.filter((d) => d !== district)
                : [...prev.eligibleDistricts, district],
        }))
    }

    const handleAddCandidate = () => {
        if (newCandidate.name && newCandidate.party) {
            const candidate = {
                ...newCandidate,
                id: Date.now().toString(),
                photo:
                    newCandidate.photo ||
                    `/placeholder.svg?height=100&width=100&text=${newCandidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}`,
            }

            setFormData((prev) => ({
                ...prev,
                candidates: [...prev.candidates, candidate],
            }))

            setNewCandidate({
                name: "",
                party: "",
                age: "",
                profession: "",
                manifesto: "",
                photo: null,
            })

            setShowAddCandidateModal(false)
        }
    }

    const handleRemoveCandidate = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            candidates: prev.candidates.filter((c) => c.id !== id),
        }))
    }

    const handleSubmit = () => {
        // Simulate election creation
        console.log("Creating election:", formData)
        setIsSubmitted(true)
    }

    const canProceedToStep2 = () => {
        return formData.title && formData.type && formData.description && formData.startDate && formData.endDate
    }

    const canProceedToStep3 = () => {
        return formData.votingMethod && formData.eligibleDistricts.length > 0
    }

    const canSubmit = () => {
        return formData.candidates.length >= 2
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl text-green-700">Election Created!</CardTitle>
                        <CardDescription>Your election has been successfully created</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Election Details:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Election ID:</span>
                                    <span className="font-mono">
                    ELC-2024-
                                        {Math.floor(Math.random() * 10000)
                                            .toString()
                                            .padStart(4, "0")}
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Title:</span>
                                    <span>{formData.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Type:</span>
                                    <span className="capitalize">{formData.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Candidates:</span>
                                    <span>{formData.candidates.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                        Draft
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                Your election has been created in draft mode. You can review and activate it from the admin dashboard.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <Link href="/admin">
                                <Button className="w-full">Go to Admin Dashboard</Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => {
                                    setIsSubmitted(false)
                                    setCurrentStep(1)
                                    setFormData({
                                        title: "",
                                        type: "",
                                        description: "",
                                        startDate: "",
                                        endDate: "",
                                        votingMethod: "single-choice",
                                        eligibleDistricts: [],
                                        minAge: "18",
                                        requireVerification: true,
                                        allowEarlyResults: false,
                                        enableNotifications: true,
                                        candidates: [],
                                    })
                                }}
                            >
                                Create Another Election
                            </Button>
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
                            <Link href="/admin" className="flex items-center space-x-2">
                                <Vote className="h-8 w-8 text-blue-600" />
                                <span className="text-2xl font-bold">Create Election</span>
                            </Link>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                <Settings className="h-3 w-3 mr-1" />
                                Admin Portal
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                <Shield className="h-3 w-3 mr-1" />
                                Secure Session
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Create New Election</h1>
                        <div className="text-sm text-gray-600">Step {currentStep} of 4</div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                        currentStep > step
                                            ? "bg-green-600 border-green-600 text-white"
                                            : currentStep === step
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "bg-gray-200 border-gray-300 text-gray-500"
                                    }`}
                                >
                                    {currentStep > step ? (
                                        <CheckCircle className="h-5 w-5" />
                                    ) : (
                                        <span className="text-sm font-bold">{step}</span>
                                    )}
                                </div>
                                {step < 4 && <div className={`w-24 h-1 mx-4 ${currentStep > step ? "bg-green-600" : "bg-gray-200"}`} />}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-sm">
                        <div className="text-center max-w-24">
                            <p
                                className={`font-medium ${currentStep === 1 ? "text-blue-600" : currentStep > 1 ? "text-green-600" : "text-gray-500"}`}
                            >
                                Basic Details
                            </p>
                            <p className="text-gray-500 text-xs mt-1">Title, dates, type</p>
                        </div>
                        <div className="text-center max-w-24">
                            <p
                                className={`font-medium ${currentStep === 2 ? "text-blue-600" : currentStep > 2 ? "text-green-600" : "text-gray-500"}`}
                            >
                                Settings
                            </p>
                            <p className="text-gray-500 text-xs mt-1">Voting rules, districts</p>
                        </div>
                        <div className="text-center max-w-24">
                            <p
                                className={`font-medium ${currentStep === 3 ? "text-blue-600" : currentStep > 3 ? "text-green-600" : "text-gray-500"}`}
                            >
                                Candidates
                            </p>
                            <p className="text-gray-500 text-xs mt-1">Add participants</p>
                        </div>
                        <div className="text-center max-w-24">
                            <p className={`font-medium ${currentStep === 4 ? "text-blue-600" : "text-gray-500"}`}>Review</p>
                            <p className="text-gray-500 text-xs mt-1">Final check</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Step 1: Basic Details */}
                    {currentStep === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-6 w-6 mr-2" />
                                    Basic Election Details
                                </CardTitle>
                                <CardDescription>Set up the fundamental information for your election</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Election Title *</Label>
                                        <Input
                                            id="title"
                                            placeholder="Presidential Election 2024"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Election Type *</Label>
                                        <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select election type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {electionTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the purpose and scope of this election..."
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date & Time *</Label>
                                        <Input
                                            id="startDate"
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">End Date & Time *</Label>
                                        <Input
                                            id="endDate"
                                            type="datetime-local"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange("endDate", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        Make sure the election dates don't conflict with other active elections. The end date must be after
                                        the start date.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex justify-between pt-6">
                                    <Link href="/admin">
                                        <Button variant="outline">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back to Admin
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!canProceedToStep2()}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Continue to Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Election Settings */}
                    {currentStep === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="h-6 w-6 mr-2" />
                                    Election Settings
                                </CardTitle>
                                <CardDescription>Configure voting rules and eligibility requirements</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <Label>Voting Method *</Label>
                                    <RadioGroup
                                        value={formData.votingMethod}
                                        onValueChange={(value) => handleInputChange("votingMethod", value)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="single-choice" id="single" />
                                            <Label htmlFor="single">Single Choice - Voters select one candidate</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="multiple-choice" id="multiple" />
                                            <Label htmlFor="multiple">Multiple Choice - Voters can select multiple candidates</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="ranked-choice" id="ranked" />
                                            <Label htmlFor="ranked">Ranked Choice - Voters rank candidates by preference</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="approval" id="approval" />
                                            <Label htmlFor="approval">Approval Voting - Voters approve/disapprove each candidate</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-4">
                                    <Label>Eligible Districts * (Select at least one)</Label>
                                    <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
                                        {districts.map((district) => (
                                            <div key={district} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={district}
                                                    checked={formData.eligibleDistricts.includes(district)}
                                                    onCheckedChange={() => handleDistrictToggle(district)}
                                                />
                                                <Label htmlFor={district} className="text-sm">
                                                    {district}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500">Selected: {formData.eligibleDistricts.length} districts</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="minAge">Minimum Voting Age</Label>
                                        <Select value={formData.minAge} onValueChange={(value) => handleInputChange("minAge", value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="16">16 years</SelectItem>
                                                <SelectItem value="18">18 years</SelectItem>
                                                <SelectItem value="21">21 years</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label>Additional Settings</Label>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="verification"
                                                checked={formData.requireVerification}
                                                onCheckedChange={(checked) => handleInputChange("requireVerification", checked)}
                                            />
                                            <Label htmlFor="verification">Require voter verification before voting</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="earlyResults"
                                                checked={formData.allowEarlyResults}
                                                onCheckedChange={(checked) => handleInputChange("allowEarlyResults", checked)}
                                            />
                                            <Label htmlFor="earlyResults">Allow viewing partial results before election ends</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="notifications"
                                                checked={formData.enableNotifications}
                                                onCheckedChange={(checked) => handleInputChange("enableNotifications", checked)}
                                            />
                                            <Label htmlFor="notifications">Send email notifications to voters</Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentStep(3)}
                                        disabled={!canProceedToStep3()}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Continue to Candidates
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Candidates */}
                    {currentStep === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Users className="h-6 w-6 mr-2" />
                                        Election Candidates
                                    </div>
                                    <Button onClick={() => setShowAddCandidateModal(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Candidate
                                    </Button>
                                </CardTitle>
                                <CardDescription>Add candidates who will participate in this election</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {formData.candidates.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No candidates added yet</h3>
                                        <p className="text-gray-500 mb-4">Add at least 2 candidates to proceed</p>
                                        <Button onClick={() => setShowAddCandidateModal(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add First Candidate
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {formData.candidates.map((candidate) => (
                                            <Card key={candidate.id} className="p-4">
                                                <div className="flex items-start space-x-4">
                                                    <img
                                                        src={
                                                            candidate.photo ||
                                                            `/placeholder.svg?height=80&width=80&text=${candidate.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}`
                                                        }
                                                        alt={candidate.name}
                                                        className="w-20 h-20 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-lg font-semibold">{candidate.name}</h3>
                                                                <p className="text-sm text-gray-600">{candidate.party}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    Age: {candidate.age} • {candidate.profession}
                                                                </p>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => handleRemoveCandidate(candidate.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        {candidate.manifesto && (
                                                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{candidate.manifesto}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {formData.candidates.length > 0 && (
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertDescription>
                                            You have added {formData.candidates.length} candidate(s). You can add more or proceed to review.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex justify-between pt-6">
                                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentStep(4)}
                                        disabled={!canSubmit()}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Continue to Review
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CheckCircle className="h-6 w-6 mr-2" />
                                    Review Election Details
                                </CardTitle>
                                <CardDescription>Review all information before creating the election</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid lg:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Basic Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <Label className="text-sm text-gray-500">Title</Label>
                                                <p className="font-medium">{formData.title}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm text-gray-500">Type</Label>
                                                <p className="font-medium capitalize">{formData.type.replace("-", " ")}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm text-gray-500">Description</Label>
                                                <p className="text-sm">{formData.description}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-sm text-gray-500">Start Date</Label>
                                                    <p className="text-sm">{new Date(formData.startDate).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500">End Date</Label>
                                                    <p className="text-sm">{new Date(formData.endDate).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Election Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <Label className="text-sm text-gray-500">Voting Method</Label>
                                                <p className="font-medium capitalize">{formData.votingMethod.replace("-", " ")}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm text-gray-500">Eligible Districts</Label>
                                                <p className="text-sm">{formData.eligibleDistricts.length} districts selected</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm text-gray-500">Minimum Age</Label>
                                                <p className="font-medium">{formData.minAge} years</p>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-sm text-gray-500">Additional Settings</Label>
                                                <div className="space-y-1 text-sm">
                                                    <p>✓ Require verification: {formData.requireVerification ? "Yes" : "No"}</p>
                                                    <p>✓ Early results: {formData.allowEarlyResults ? "Allowed" : "Not allowed"}</p>
                                                    <p>✓ Notifications: {formData.enableNotifications ? "Enabled" : "Disabled"}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Candidates ({formData.candidates.length})</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {formData.candidates.map((candidate) => (
                                                <div key={candidate.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                                    <img
                                                        src={
                                                            candidate.photo ||
                                                            `/placeholder.svg?height=50&width=50&text=${candidate.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}`
                                                        }
                                                        alt={candidate.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{candidate.name}</p>
                                                        <p className="text-sm text-gray-600">{candidate.party}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        Once created, the election will be in draft status. You can activate it from the admin dashboard
                                        when ready.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex justify-between pt-6">
                                    <Button variant="outline" onClick={() => setCurrentStep(3)}>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 px-8">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Create Election
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Add Candidate Modal */}
            {showAddCandidateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-2xl mx-4">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Add New Candidate</CardTitle>
                                <Button variant="outline" size="sm" onClick={() => setShowAddCandidateModal(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="candidateName">Full Name *</Label>
                                    <Input
                                        id="candidateName"
                                        placeholder="John Silva"
                                        value={newCandidate.name}
                                        onChange={(e) => setNewCandidate((prev) => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="candidateParty">Political Party *</Label>
                                    <Input
                                        id="candidateParty"
                                        placeholder="Democratic Party"
                                        value={newCandidate.party}
                                        onChange={(e) => setNewCandidate((prev) => ({ ...prev, party: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="candidateAge">Age</Label>
                                    <Input
                                        id="candidateAge"
                                        type="number"
                                        placeholder="52"
                                        value={newCandidate.age}
                                        onChange={(e) => setNewCandidate((prev) => ({ ...prev, age: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="candidateProfession">Profession</Label>
                                    <Input
                                        id="candidateProfession"
                                        placeholder="Former Minister"
                                        value={newCandidate.profession}
                                        onChange={(e) => setNewCandidate((prev) => ({ ...prev, profession: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="candidateManifesto">Manifesto</Label>
                                <Textarea
                                    id="candidateManifesto"
                                    placeholder="Brief description of candidate's platform and goals..."
                                    value={newCandidate.manifesto}
                                    onChange={(e) => setNewCandidate((prev) => ({ ...prev, manifesto: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Candidate Photo</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload photo (optional)</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setShowAddCandidateModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddCandidate} disabled={!newCandidate.name || !newCandidate.party}>
                                    Add Candidate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
