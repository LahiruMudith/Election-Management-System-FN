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
  FileCheck
} from "lucide-react"
import Link from "next/link"
import SelfieCapture from "../register-candidate/SelfieCapture"
import Cookies from "js-cookie"
import toast from "react-hot-toast";
import { useTokenValidation } from "@/hooks/useTokenValidation";


type FileType = "nicFront" | "nicBack" | "selfie"

interface RegistrationData {
  nicNumber: string
  phoneNumber: string
  fullName: string
  district: string
}

export default function NICVerifyPage() {
  const { isValid,loading} = useTokenValidation();
  // Step state
  const [currentStep, setCurrentStep] = useState(1)
  // Registration form state
  const [formData, setFormData] = useState<RegistrationData>({
    nicNumber: "",
    phoneNumber: "",
    fullName: "",
    district: "",
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  // File upload state
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
  const [verificationId, setVerificationId] = useState<string>("")
  const [showWebcam, setShowWebcam] = useState(false)

  const fileInputRefs = {
    nicFront: useRef<HTMLInputElement>(null),
    nicBack: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
  }

  // Simple validation
  const validateForm = () => {
    let errors: {[key: string]: string} = {}
    if (!formData.nicNumber) errors.nicNumber = "NIC number is required"
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required"
    if (!formData.fullName) errors.fullName = "Full name is required"
    if (!formData.district) errors.district = "District is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Step 1: Register user
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // You can POST formData to your backend here to register the voter
    // Example:
    // await fetch("/api/v1/voter/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${Cookies.get("token")}` },
    //   body: JSON.stringify(formData),
    // })

    setCurrentStep(2)
  }

  // Step 2: File uploads
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

  // 1) In startVerification, check for 201
  const startVerification = async () => {
    if (!canProceedToVerification()) return

    setVerificationStatus("processing")
    setVerificationId(`VER-${Date.now().toString().slice(-8)}`)

    const formDataUpload = new FormData()
    formDataUpload.append("nicNumber", formData.nicNumber)
    formDataUpload.append("phoneNumber", formData.phoneNumber)
    formDataUpload.append("fullName", formData.fullName)
    formDataUpload.append("district", formData.district)
    formDataUpload.append("username", Cookies.get("username") || "unknown")
    if (uploadedFiles.nicFront) formDataUpload.append("nicFront", uploadedFiles.nicFront)
    if (uploadedFiles.nicBack) formDataUpload.append("nicBack", uploadedFiles.nicBack)
    if (uploadedFiles.selfie) formDataUpload.append("selfie", uploadedFiles.selfie)

    const token = Cookies.get("token")

    try {
      const response = await fetch("http://localhost:8080/api/v1/voter/verifyNic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      })

      // Show success only when backend returns 201 Created
      if (response.status === 201) {
        setVerificationStatus("success")
        toast.success("Verification submitted successfully!")
        // Optional: scroll to success section
        setTimeout(() => document.getElementById("verification-result")?.scrollIntoView({ behavior: "smooth" }), 0)
      } else {
        // Read text if available to help debug
        const errText = await response.text().catch(() => "")
        setVerificationStatus("failed")
        toast.error(`NIC verification failed (${response.status}) ${errText ? "- " + errText : ""}`)
      }
    } catch (e) {
      console.log(e)
      setVerificationStatus("failed")
      toast.error("NIC verification failed!")
    }
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
                console.log(file)
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
                        toast.error("Preview not implemented yet.")
                      }}                  >
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

  if (loading || isValid === null) {
    return <div>Checking session…</div>;
  }

  if (!isValid) {
    window.location.href = "/";
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("username");

    return null; // prevent rendering rest of component
  }

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
                                currentStep === 1 ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                            }`}
                        >
                          1
                        </div>
                        <div>
                          <p className="text-sm font-medium">Register</p>
                          <p className="text-xs text-gray-600">Enter your details</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                currentStep === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                        >
                          2
                        </div>
                        <div>
                          <p className="text-sm font-medium">Upload Documents</p>
                          <p className="text-xs text-gray-600">NIC images & selfie</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/*/!* AI Features *!/*/}
                {/*<Card>*/}
                {/*  <CardHeader>*/}
                {/*    <CardTitle className="text-lg flex items-center">*/}
                {/*      <Zap className="h-5 w-5 mr-2 text-yellow-500" />*/}
                {/*      AI Features*/}
                {/*    </CardTitle>*/}
                {/*  </CardHeader>*/}
                {/*  <CardContent className="space-y-3 text-sm">*/}
                {/*    <div className="flex items-start space-x-2">*/}
                {/*      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />*/}
                {/*      <span>Automatic data extraction</span>*/}
                {/*    </div>*/}
                {/*    <div className="flex items-start space-x-2">*/}
                {/*      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />*/}
                {/*      <span>Document authenticity check</span>*/}
                {/*    </div>*/}
                {/*    <div className="flex items-start space-x-2">*/}
                {/*      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />*/}
                {/*      <span>Facial recognition matching</span>*/}
                {/*    </div>*/}
                {/*  </CardContent>*/}
                {/*</Card>*/}

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
              {/* Step 1: Registration Form */}
              {currentStep === 1 && (
                  <form onSubmit={handleRegister}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="h-6 w-6 mr-2" />
                          Register as Voter
                        </CardTitle>
                        <CardDescription>
                          Enter your NIC and personal details to begin registration.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block font-medium mb-1">
                              NIC Number
                              <input
                                  type="text"
                                  className="mt-1 w-full px-3 py-2 border rounded"
                                  value={formData.nicNumber}
                                  onChange={e => setFormData({...formData, nicNumber: e.target.value})}
                                  required
                              />
                              {formErrors.nicNumber && (
                                  <div className="text-red-500 text-xs mt-1">{formErrors.nicNumber}</div>
                              )}
                            </label>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">
                              Phone Number
                              <input
                                  type="text"
                                  className="mt-1 w-full px-3 py-2 border rounded"
                                  value={formData.phoneNumber}
                                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                                  required
                              />
                              {formErrors.phoneNumber && (
                                  <div className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</div>
                              )}
                            </label>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">
                              Full Name
                              <input
                                  type="text"
                                  className="mt-1 w-full px-3 py-2 border rounded"
                                  value={formData.fullName}
                                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                                  required
                              />
                              {formErrors.fullName && (
                                  <div className="text-red-500 text-xs mt-1">{formErrors.fullName}</div>
                              )}
                            </label>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">
                              District
                              <select
                                  className="mt-1 w-full px-3 py-2 border rounded"
                                  value={formData.district}
                                  onChange={e => setFormData({...formData, district: e.target.value})}
                                  required
                              >
                                <option value="">Select your district</option>
                                <option value="Ampara">Ampara</option>
                                <option value="Anuradhapura">Anuradhapura</option>
                                <option value="Badulla">Badulla</option>
                                <option value="Batticaloa">Batticaloa</option>
                                <option value="Colombo">Colombo</option>
                                <option value="Galle">Galle</option>
                                <option value="Gampaha">Gampaha</option>
                                <option value="Hambantota">Hambantota</option>
                                <option value="Jaffna">Jaffna</option>
                                <option value="Kalutara">Kalutara</option>
                                <option value="Kandy">Kandy</option>
                                <option value="Kegalle">Kegalle</option>
                                <option value="Kilinochchi">Kilinochchi</option>
                                <option value="Kurunegala">Kurunegala</option>
                                <option value="Mannar">Mannar</option>
                                <option value="Matale">Matale</option>
                                <option value="Matara">Matara</option>
                                <option value="Monaragala">Monaragala</option>
                                <option value="Mullaitivu">Mullaitivu</option>
                                <option value="Nuwara Eliya">Nuwara Eliya</option>
                                <option value="Polonnaruwa">Polonnaruwa</option>
                                <option value="Puttalam">Puttalam</option>
                                <option value="Ratnapura">Ratnapura</option>
                                <option value="Trincomalee">Trincomalee</option>
                                <option value="Vavuniya">Vavuniya</option>
                              </select>
                              {formErrors.district && (
                                  <div className="text-red-500 text-xs mt-1">{formErrors.district}</div>
                              )}
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-between mt-8">
                          <Link href="/">
                            <Button variant="outline">
                              <ArrowLeft className="h-4 w-4 mr-2"/>
                              Back to Home
                            </Button>
                          </Link>
                          <Button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700"
                          >
                            Continue to Document Upload
                            <ArrowRight className="h-4 w-4 ml-2"/>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
              )}

              {currentStep === 2 && (
                  verificationStatus === "success" ? (
                      <div id="verification-result" className="space-y-6">
                        {/* Success UI */}
                        <Card>
                          <div className="space-y-6">
                            <Card>
                              <CardHeader className="text-center">
                                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                                  <CheckCircle className="h-16 w-16 text-green-600"/>
                                </div>
                                <CardTitle className="text-3xl text-green-700">Verification Send Successfully!</CardTitle>
                                <CardDescription className="text-lg">
                                  Your NIC verification details have been sent successfully. Your voter profile will be activated after review.
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-6">
                                  <div className="w-full max-w-md mx-auto">
                                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                      <h3 className="font-semibold mb-4 text-green-800">Verification Summary</h3>
                                      <div className="grid md:grid-cols-1 gap-4 text-sm">
                                        <div className="flex justify-between">
                                          <span>Status:</span>
                                          <Badge className="bg-yellow-600">
                                            <FileCheck className="h-3 w-3 mr-1"/>
                                            Pending
                                          </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Completed:</span>
                                          <span className="font-medium">{new Date().toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <Alert>
                                    <Info className="h-4 w-4"/>
                                    <AlertDescription>
                                      <strong>What's Next?</strong> You can now participate in elections, access your
                                      voter
                                      dashboard, and receive election notifications. Your verification is valid for one
                                      year.
                                    </AlertDescription>
                                  </Alert>
                                  <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/voter-dashboard" className="flex-1">
                                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        <User className="h-4 w-4 mr-2"/>
                                        Go to Voter Dashboard
                                      </Button>
                                    </Link>
                                  </div>
                                  <div className="text-center pt-4 border-t">
                                    <p className="text-sm text-gray-600 mb-2">Need help or have questions?</p>
                                    <div className="flex justify-center space-x-4">
                                      <a href="tel:+94761298256">
                                        <Button variant="outline" size="sm" asChild>
                                          <span>
                                            <Phone className="h-4 w-4 mr-2"/>
                                              Call Support
                                          </span>
                                        </Button>
                                      </a>
                                      <a href="mailto:lahimudith@gmail.com">
                                        <Button variant="outline" size="sm" asChild>
                                          <span>
                                            <Mail className="h-4 w-4 mr-2"/>
                                            Email Help
                                          </span>
                                        </Button>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </Card>
                      </div>
                  ) : (
                      <div className="space-y-6">
                        {/* Upload UI */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Upload className="h-6 w-6 mr-2"/>
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
                                  onFileChange={file => handleFileChange("nicFront", file)}
                              />
                              <FileUploadCard
                                  title="NIC Back Side"
                                  description="Upload back side of your NIC"
                                  fileType="nicBack"
                                  icon={FileText}
                                  uploadedFile={uploadedFiles.nicBack}
                                  onSelectClick={() => triggerFileSelect("nicBack")}
                                  inputRef={fileInputRefs.nicBack}
                                  onFileChange={file => handleFileChange("nicBack", file)}
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
                                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto"/>
                                      <div>
                                        <p className="text-lg font-semibold text-green-700">Selfie Photo Uploaded</p>
                                        <p className="text-sm text-green-600">Click to replace</p>
                                      </div>
                                      <button
                                          onClick={() => {
                                            setUploadedFiles(prev => ({...prev, selfie: null}))
                                          }}
                                          className="mt-2 underline text-sm text-blue-600"
                                          type="button"
                                      >
                                        Remove and re-upload
                                      </button>
                                    </div>
                                ) : showWebcam ? (
                                    <SelfieCapture
                                        onCapture={file => {
                                          handleFileChange("selfie", file)
                                          setShowWebcam(false)
                                        }}
                                        onCancel={() => setShowWebcam(false)}
                                    />
                                ) : (
                                    <>
                                      <Camera className="h-16 w-16 text-gray-400 mx-auto"/>
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
                                            onChange={e => {
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
                                <strong>Photo Guidelines:</strong> Ensure documents are flat, well-lit, and all text is clearly readable. Avoid shadows, glare, or blurry images for best results.
                              </AlertDescription>
                            </Alert>
                            <div className="flex justify-between">
                              <Button
                                  variant="outline"
                                  onClick={() => setCurrentStep(1)}
                              >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Registration
                              </Button>
                              <Button
                                  onClick={startVerification}
                                  disabled={!canProceedToVerification()}
                                  className="bg-blue-600 hover:bg-blue-700"
                              >
                                Start Verification
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                  )
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 2 && (
                  <div className="space-y-6">

                  </div>
              )}

              {/* Step 2b: Show Success (anchor for smooth scroll) */}
              {currentStep === 2 && verificationStatus === "success" && (
                  <div id="verification-result" className="space-y-6">
                    <Card>

                    </Card>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}