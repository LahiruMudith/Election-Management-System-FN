"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Camera, CheckCircle, Shield, FileText, Info, User, Clock } from "lucide-react"
import Link from "next/link"

export default function VerificationPage() {
  const [uploadedFiles, setUploadedFiles] = useState({
    nicFront: false,
    nicBack: false,
    selfie: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFileUpload = (fileType: string) => {
    setUploadedFiles((prev) => ({ ...prev, [fileType]: true }))
  }

  const canSubmit = () => {
    return uploadedFiles.nicFront && uploadedFiles.nicBack && uploadedFiles.selfie
  }

  const handleSubmit = () => {
    if (canSubmit()) {
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Verification Submitted!</CardTitle>
            <CardDescription>Your documents have been submitted for verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Submission Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Application ID:</span>
                  <span className="font-mono">VER-2024-001234</span>
                </div>
                <div className="flex justify-between">
                  <span>Submitted:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    <Clock className="h-3 w-3 mr-1" />
                    Under Review
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Expected Processing:</span>
                  <span>2-3 business days</span>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You will receive an SMS and email notification once your verification is complete. You can check your
                status anytime in your voter dashboard.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Link href="/voter-dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Return Home
                </Button>
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
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">E-Vote Verification</span>
              </Link>
              <Badge variant="secondary">Identity Verification</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Secure Process
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voter Identity Verification</h1>
            <p className="text-gray-600">Upload your NIC documents and selfie photo to verify your identity</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-6 w-6 mr-2" />
                Upload Required Documents
              </CardTitle>
              <CardDescription>
                Please upload clear, high-quality photos of your documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Upload Areas */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* NIC Front */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    uploadedFiles.nicFront
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onClick={() => handleFileUpload("nicFront")}
                >
                  {uploadedFiles.nicFront ? (
                    <div className="space-y-3">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-green-700">NIC Front Uploaded</p>
                        <p className="text-sm text-green-600">Click to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Upload NIC Front</p>
                        <p className="text-sm text-gray-500">Click to upload front side of your NIC</p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* NIC Back */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    uploadedFiles.nicBack
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onClick={() => handleFileUpload("nicBack")}
                >
                  {uploadedFiles.nicBack ? (
                    <div className="space-y-3">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-green-700">NIC Back Uploaded</p>
                        <p className="text-sm text-green-600">Click to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Upload NIC Back</p>
                        <p className="text-sm text-gray-500">Click to upload back side of your NIC</p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
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

              {/* Guidelines */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Photo Guidelines:</strong> Ensure all documents are flat, well-lit, and clearly readable. For
                  the selfie, make sure your face is clearly visible and matches your NIC photo. Avoid shadows, glare,
                  or blurry images for best results.
                </AlertDescription>
              </Alert>

              {/* Requirements Checklist */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Verification Requirements
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        uploadedFiles.nicFront ? "bg-green-500 text-white" : "bg-gray-300"
                      }`}
                    >
                      {uploadedFiles.nicFront ? "✓" : "1"}
                    </div>
                    <span className={uploadedFiles.nicFront ? "text-green-700 font-medium" : "text-gray-600"}>
                      NIC Front Side - Clear photo of front side
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        uploadedFiles.nicBack ? "bg-green-500 text-white" : "bg-gray-300"
                      }`}
                    >
                      {uploadedFiles.nicBack ? "✓" : "2"}
                    </div>
                    <span className={uploadedFiles.nicBack ? "text-green-700 font-medium" : "text-gray-600"}>
                      NIC Back Side - All text must be readable
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

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <Link href="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                  className={`px-8 ${canSubmit() ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit for Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
