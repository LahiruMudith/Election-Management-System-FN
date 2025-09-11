"use client"

import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  Camera,
  CheckCircle,
  Shield,
  Eye,
  RefreshCw,
  FileText,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  Info,
  Zap,
  Lock,
  Scan,
} from "lucide-react"
import Link from "next/link"
import SelfieCapture from "../register-candidate/SelfieCapture"

interface NICData {
  nicNumber: string
  fullName: string
  dateOfBirth: string
  gender: string
  address: string
  issuedDate: string
}

type FileType = "nicFront" | "nicBack" | "selfie"

export default function NICVerifyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<{
    nicFront: File | null
    nicBack: File | null
    selfie: File | null
  }>({
    nicFront: null,
    nicBack: null,
    selfie: null,
  })
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [extractedData, setExtractedData] = useState<NICData | null>(null)
  const [verificationId, setVerificationId] = useState<string>("")
  const [showWebcam, setShowWebcam] = useState(false)

  const fileInputRefs = {
    nicFront: useRef<HTMLInputElement>(null),
    nicBack: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
  }

  const handleFileChange = (fileType: FileType, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be 5MB or less.")
      return
    }
    setUploadedFiles((prev) => ({ ...prev, [fileType]: file }))
  }

  const triggerFileSelect = (fileType: FileType) => {
    fileInputRefs[fileType].current?.click()
  }

  const canProceedToVerification = () =>
      uploadedFiles.nicFront && uploadedFiles.nicBack && uploadedFiles.selfie

  const startVerification = async () => {
    if (!canProceedToVerification()) return

    setVerificationStatus("processing")
    setVerificationId(`VER-${Date.now().toString().slice(-8)}`)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setExtractedData({
      nicNumber: "200012345678",
      fullName: "John Doe Silva",
      dateOfBirth: "2000-05-15",
      gender: "Male",
      address: "123 Main Street, Colombo 07",
      issuedDate: "2018-06-01",
    })

    setCurrentStep(2)
    setVerificationStatus("success")
  }

  const FileUploadCard = ({
                            title,
                            description,
                            fileType,
                            icon: Icon,
                            uploadedFile,
                            onSelectClick,
                            inputRef,
                            onFileChange,
                            accept = "image/*",
                          }: {
    title: string
    description: string
    fileType: FileType
    icon: any
    uploadedFile: File | null
    onSelectClick: () => void
    inputRef: React.RefObject<HTMLInputElement | null>
    onFileChange: (file: File) => void
    accept?: string
  }) => (
      <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
              uploadedFile
                  ? "border-green-300 bg-green-50"
                  : "border-dashed border-gray-300 hover:border-blue-400"
          }`}
          onClick={onSelectClick}
      >
        <CardContent className="p-6 text-center">
          <input
              type="file"
              accept={accept}
              style={{ display: "none" }}
              ref={inputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onFileChange(file)
              }}
          />
          {uploadedFile ? (
              <div className="space-y-3">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <div>
                  <p className="font-medium text-green-700">{title} Uploaded</p>
                  <p className="text-sm text-green-600">{uploadedFile.name}</p>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        alert("Preview not implemented")
                      }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectClick()
                      }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Replace
                  </Button>
                </div>
              </div>
          ) : (
              <div className="space-y-3">
                <Icon className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="font-medium text-gray-700">{title}</p>
                  <p className="text-sm text-gray-500">{description}</p>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                </div>
                <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectClick()
                    }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
          )}
        </CardContent>
      </Card>
  )

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold">E-Vote NIC Verify</span>
                </Link>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Scan className="h-3 w-3 mr-1" />
                  AI-Powered Facial Verification
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Lock className="h-3 w-3 mr-1" />
                  Secure & Encrypted
                </Badge>
                {verificationId && (
                    <Badge variant="outline" className="font-mono">
                      ID: {verificationId}
                    </Badge>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex justify-end items-center mb-6">
              <div className="text-sm text-gray-600">
                Step {currentStep} of 2
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Verification Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                uploadedFiles.nicFront ? "bg-green-500 text-white" : "bg-gray-200"
                            }`}
                        >
                          {uploadedFiles.nicFront ? "✓" : "1"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">NIC Front Side</p>
                          <p className="text-xs text-gray-600">Clear, well-lit photo</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                uploadedFiles.nicBack ? "bg-green-500 text-white" : "bg-gray-200"
                            }`}
                        >
                          {uploadedFiles.nicBack ? "✓" : "2"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">NIC Back Side</p>
                          <p className="text-xs text-gray-600">All text readable</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                uploadedFiles.selfie ? "bg-green-500 text-white" : "bg-gray-200"
                            }`}
                        >
                          {uploadedFiles.selfie ? "✓" : "3"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Selfie Photo</p>
                          <p className="text-xs text-gray-600">Face clearly visible</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      AI Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Automatic data extraction</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Document authenticity check</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Facial recognition matching</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-500" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <Lock className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>256-bit encryption</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Secure data processing</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Step 1: Document Upload */}
              {currentStep === 1 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Upload className="h-6 w-6 mr-2" />
                          Upload Your Documents
                        </CardTitle>
                        <CardDescription>
                          Upload clear, high-quality photos of your National Identity Card and take a selfie for
                          verification
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <FileUploadCard
                              title="NIC Front Side"
                              description="Upload front side of your NIC"
                              fileType="nicFront"
                              icon={FileText}
                              uploadedFile={uploadedFiles.nicFront}
                              onSelectClick={() => triggerFileSelect("nicFront")}
                              inputRef={fileInputRefs.nicFront}
                              onFileChange={(file) => handleFileChange("nicFront", file)}
                          />
                          <FileUploadCard
                              title="NIC Back Side"
                              description="Upload back side of your NIC"
                              fileType="nicBack"
                              icon={FileText}
                              uploadedFile={uploadedFiles.nicBack}
                              onSelectClick={() => triggerFileSelect("nicBack")}
                              inputRef={fileInputRefs.nicBack}
                              onFileChange={(file) => handleFileChange("nicBack", file)}
                          />
                        </div>
                        <div className="mb-6">
                          {/* Selfie Upload */}
                          <div
                              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                  uploadedFiles.selfie
                                      ? "border-green-300 bg-green-50"
                                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                              }`}
                          >
                            {uploadedFiles.selfie ? (
                                <div className="space-y-3">
                                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                                  <div>
                                    <p className="text-lg font-semibold text-green-700">Selfie Photo Uploaded</p>
                                    <p className="text-sm text-green-600">Click to replace</p>
                                  </div>
                                  <button
                                      onClick={() => {
                                        setUploadedFiles((prev) => ({ ...prev, selfie: null }))
                                      }}
                                      className="mt-2 underline text-sm text-blue-600"
                                      type="button"
                                  >
                                    Remove and re-upload
                                  </button>
                                </div>
                            ) : showWebcam ? (
                                <SelfieCapture
                                    onCapture={(file) => {
                                      handleFileChange("selfie", file)
                                      setShowWebcam(false)
                                    }}
                                    onCancel={() => setShowWebcam(false)}
                                />
                            ) : (
                                <>
                                  <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                                  <div>
                                    <p className="text-lg font-semibold text-gray-700">Upload Selfie Photo</p>
                                    <p className="text-sm text-gray-500">Take or upload a clear selfie for verification</p>
                                    <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                                  </div>
                                  <div className="flex flex-col items-center gap-2 mt-4">
                                    <button
                                        onClick={() => setShowWebcam(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded"
                                        type="button"
                                    >
                                      Take a Selfie
                                    </button>
                                    <span className="text-gray-500 text-xs">or</span>
                                    <button
                                        onClick={() => fileInputRefs.selfie.current?.click()}
                                        className="bg-gray-100 px-4 py-2 rounded border"
                                        type="button"
                                    >
                                      Upload File
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        ref={fileInputRefs.selfie}
                                        onChange={(e) => {
                                          const file = e.target.files?.[0]
                                          if (file) {
                                            if (file.size > 5 * 1024 * 1024) {
                                              alert("File size must be 5MB or less.")
                                              return
                                            }
                                            handleFileChange("selfie", file)
                                          }
                                        }}
                                    />
                                  </div>
                                </>
                            )}
                          </div>
                        </div>
                        <Alert className="mb-6">
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Photo Guidelines:</strong> Ensure documents are flat, well-lit, and all text is clearly
                            readable. Avoid shadows, glare, or blurry images for best results.
                          </AlertDescription>
                        </Alert>
                        <div className="flex justify-between">
                          <Link href="/">
                            <Button variant="outline">
                              <ArrowLeft className="h-4 w-4 mr-2" />
                              Back to Home
                            </Button>
                          </Link>
                          <Button
                              onClick={startVerification}
                              disabled={!canProceedToVerification()}
                              className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start AI Verification
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
              )}

              {/* Step 2: Verification Complete */}
              {currentStep === 2 && verificationStatus === "success" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                          <CheckCircle className="h-16 w-16 text-green-600" />
                        </div>
                        <CardTitle className="text-3xl text-green-700">Verification Successful!</CardTitle>
                        <CardDescription className="text-lg">
                          Your NIC has been successfully verified and your voter profile is now active
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Verification Summary */}
                          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                            <h3 className="font-semibold mb-4 text-green-800">Verification Summary</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span>Verification ID:</span>
                                <span className="font-mono font-medium">{verificationId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <Badge className="bg-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Completed:</span>
                                <span className="font-medium">{new Date().toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Valid Until:</span>
                                <span className="font-medium">
                              {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </span>
                              </div>
                            </div>
                          </div>

                          {/* Verified Information */}
                          {extractedData && (
                              <div>
                                <h3 className="font-semibold mb-4">Verified Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                      <User className="h-5 w-5 text-gray-500" />
                                      <div>
                                        <p className="text-sm text-gray-600">Full Name</p>
                                        <p className="font-medium">{extractedData.fullName}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <FileText className="h-5 w-5 text-gray-500" />
                                      <div>
                                        <p className="text-sm text-gray-600">NIC Number</p>
                                        <p className="font-medium font-mono">{extractedData.nicNumber}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <Calendar className="h-5 w-5 text-gray-500" />
                                      <div>
                                        <p className="text-sm text-gray-600">Date of Birth</p>
                                        <p className="font-medium">{extractedData.dateOfBirth}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <User className="h-5 w-5 text-gray-500" />
                                      <div>
                                        <p className="text-sm text-gray-600">Gender</p>
                                        <p className="font-medium">{extractedData.gender}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div className="flex items-start space-x-3">
                                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-gray-600">Registered Address</p>
                                      <p className="font-medium">{extractedData.address}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          )}

                          {/* Next Steps */}
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              <strong>What's Next?</strong> You can now participate in elections, access your voter
                              dashboard, and receive election notifications. Your verification is valid for one year.
                            </AlertDescription>
                          </Alert>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/voter-dashboard" className="flex-1">
                              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <User className="h-4 w-4 mr-2" />
                                Go to Voter Dashboard
                              </Button>
                            </Link>
                            <Link href="/elections" className="flex-1">
                              <Button variant="outline" className="w-full bg-transparent">
                                <FileText className="h-4 w-4 mr-2" />
                                View Active Elections
                              </Button>
                            </Link>
                          </div>

                          {/* Contact Support */}
                          <div className="text-center pt-4 border-t">
                            <p className="text-sm text-gray-600 mb-2">Need help or have questions?</p>
                            <div className="flex justify-center space-x-4">
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-2" />
                                Call Support
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 mr-2" />
                                Email Help
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}