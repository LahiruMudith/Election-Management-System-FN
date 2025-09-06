"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, ArrowLeft, CheckCircle, Info, User, Mail, FileText, Shield, Upload, Camera } from "lucide-react"
import Link from "next/link"

export default function RegisterCandidatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Account Setup
    email: "",
    username: "",
    password: "",
    confirmPassword: "",

    // Step 2: Personal Information
    fullName: "",
    age: "",
    profession: "",
    manifesto: "",

    // Step 3: Document Upload
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  })

  const [uploadedFiles, setUploadedFiles] = useState({
    idFront: false,
    idBack: false,
    selfie: false,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (fileType: "idFront" | "idBack" | "selfie") => {
    // Simulate file upload
    const mockFile = new File([""], `${fileType}.jpg`, { type: "image/jpeg" })
    setFormData((prev) => ({ ...prev, [fileType]: mockFile }))
    setUploadedFiles((prev) => ({ ...prev, [fileType]: true }))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const canProceedToStep2 = () => {
    return formData.email && formData.username && formData.password && formData.confirmPassword
  }

  const canProceedToStep3 = () => {
    return formData.fullName && formData.age && formData.profession && formData.manifesto
  }

  const canSubmit = () => {
    return uploadedFiles.idFront && uploadedFiles.idBack && uploadedFiles.selfie
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Registration Submitted!</CardTitle>
            <CardDescription>Your candidate registration has been submitted for review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Application Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Application ID:</span>
                  <span className="font-mono">CAN-2024-001234</span>
                </div>
                <div className="flex justify-between">
                  <span>Submitted:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Under Review
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Expected Processing:</span>
                  <span>5-7 business days</span>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your application will be reviewed by the Election Commission. You will receive an email notification
                once your candidacy is approved or if additional information is required.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Link href="/">
                <Button className="w-full">Return to Home</Button>
              </Link>
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
              <Link href="/" className="flex items-center space-x-2">
                <UserPlus className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">Candidate Registration</span>
              </Link>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <User className="h-3 w-3 mr-1" />
                Candidate Portal
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Secure Registration
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Register as Candidate</h1>
            <div className="text-sm text-gray-600">Step {currentStep} of 3</div>
          </div>

          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
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
                {step < 3 && <div className={`w-24 h-1 mx-4 ${currentStep > step ? "bg-green-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-center max-w-32">
              <p
                className={`font-medium ${currentStep === 1 ? "text-blue-600" : currentStep > 1 ? "text-green-600" : "text-gray-500"}`}
              >
                Account Setup
              </p>
              <p className="text-gray-500 text-xs mt-1">Email, username, password</p>
            </div>
            <div className="text-center max-w-32">
              <p
                className={`font-medium ${currentStep === 2 ? "text-blue-600" : currentStep > 2 ? "text-green-600" : "text-gray-500"}`}
              >
                Personal Info
              </p>
              <p className="text-gray-500 text-xs mt-1">Name, age, profession, manifesto</p>
            </div>
            <div className="text-center max-w-32">
              <p className={`font-medium ${currentStep === 3 ? "text-blue-600" : "text-gray-500"}`}>Document Upload</p>
              <p className="text-gray-500 text-xs mt-1">ID front, back, selfie</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Step 1: Account Setup */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-6 w-6 mr-2" />
                  Account Setup
                </CardTitle>
                <CardDescription>Create your login credentials for the candidate portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="candidate@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">This will be your login email</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="johnsilva2024"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Choose a unique username for your profile</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Your password should be at least 8 characters long and include uppercase, lowercase, numbers, and
                    special characters.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between pt-6">
                  <Link href="/">
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Personal Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Provide your personal details and candidate information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Silva"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="52"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profession *</Label>
                  <Input
                    id="profession"
                    placeholder="Former Finance Minister & Economist"
                    value={formData.profession}
                    onChange={(e) => handleInputChange("profession", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Your current or most recent profession</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manifesto">Election Manifesto *</Label>
                  <Textarea
                    id="manifesto"
                    placeholder="Focus on economic development, job creation, and education reform. Committed to reducing poverty and improving healthcare accessibility for all Sri Lankan citizens..."
                    value={formData.manifesto}
                    onChange={(e) => handleInputChange("manifesto", e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    Describe your vision, goals, and what you plan to achieve if elected
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Your manifesto will be publicly visible to voters. Make sure to clearly communicate your key
                    policies and vision for the country.
                  </AlertDescription>
                </Alert>

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
                    Continue to Document Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Document Upload
                </CardTitle>
                <CardDescription>Upload your ID documents and selfie photo for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ID Front Upload */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    uploadedFiles.idFront
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onClick={() => handleFileUpload("idFront")}
                >
                  {uploadedFiles.idFront ? (
                    <div className="space-y-3">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-green-700">ID Front Uploaded</p>
                        <p className="text-sm text-green-600">Click to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Upload ID Front Side</p>
                        <p className="text-sm text-gray-500">Click to upload front side of your National ID</p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ID Back Upload */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    uploadedFiles.idBack
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onClick={() => handleFileUpload("idBack")}
                >
                  {uploadedFiles.idBack ? (
                    <div className="space-y-3">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-green-700">ID Back Uploaded</p>
                        <p className="text-sm text-green-600">Click to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Upload ID Back Side</p>
                        <p className="text-sm text-gray-500">Click to upload back side of your National ID</p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selfie Upload */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    uploadedFiles.selfie
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onClick={() => handleFileUpload("selfie")}
                >
                  {uploadedFiles.selfie ? (
                    <div className="space-y-3">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-green-700">Selfie Photo Uploaded</p>
                        <p className="text-sm text-green-600">Click to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Upload Selfie Photo</p>
                        <p className="text-sm text-gray-500">Take or upload a clear selfie for verification</p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Guidelines */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Photo Guidelines:</strong> Ensure all documents are flat, well-lit, and clearly readable.
                    For the selfie, make sure your face is clearly visible and matches your ID photo. Avoid shadows,
                    glare, or blurry images for best results.
                  </AlertDescription>
                </Alert>

                {/* Requirements Checklist */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Requirements
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          uploadedFiles.idFront ? "bg-green-500 text-white" : "bg-gray-300"
                        }`}
                      >
                        {uploadedFiles.idFront ? "✓" : "1"}
                      </div>
                      <span className={uploadedFiles.idFront ? "text-green-700 font-medium" : "text-gray-600"}>
                        National ID Front Side - Clear photo of front side
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          uploadedFiles.idBack ? "bg-green-500 text-white" : "bg-gray-300"
                        }`}
                      >
                        {uploadedFiles.idBack ? "✓" : "2"}
                      </div>
                      <span className={uploadedFiles.idBack ? "text-green-700 font-medium" : "text-gray-600"}>
                        National ID Back Side - All text must be readable
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          uploadedFiles.selfie ? "bg-green-500 text-white" : "bg-gray-300"
                        }`}
                      >
                        {uploadedFiles.selfie ? "✓" : "3"}
                      </div>
                      <span className={uploadedFiles.selfie ? "text-green-700 font-medium" : "text-gray-600"}>
                        Selfie Photo - Face clearly visible for matching
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className={`px-8 ${canSubmit() ? "bg-green-600 hover:bg-green-700" : ""}`}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
