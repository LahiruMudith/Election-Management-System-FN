"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Vote, Shield, Users, BarChart3, Globe, CheckCircle, Lock, UserCheck, User, UserPlus } from "lucide-react"
import Link from "next/link"
import Cookies from "js-cookie";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import {signInWithGoogle} from "@/components/firebase";

export default function LandingPage() {
  const { isValid } = useTokenValidation();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/log/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });
      if (!res.ok) throw new Error("Registration failed");
      console.log(res);
      const data = await res.json();

      alert(data.message);

      if (data.status === 201) {
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
    }

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  }

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const url = `http://localhost:8080/api/log/login?email=${encodeURIComponent(loginForm.email)}&password=${encodeURIComponent(loginForm.password)}`;

    try {
      const res = await fetch(url, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      console.log(data)

      Cookies.set("role", data.data.role);
      Cookies.set("token", data.data.accessToken);
      Cookies.set("username", data.data.username);

      alert(data.message);

      window.location.href = `/voter-dashboard`;
    }  catch (err) {
      if (err instanceof Error) setLoginError(err.message);
      else setLoginError("Unknown error");
    } finally {
      setLoginLoading(false);
    }
  }

  const [language, setLanguage] = useState("en")

  const translations = {
    en: {
      title: "Secure Digital Voting Platform",
      subtitle: "Transparent, Secure, and Accessible Elections for Everyone",
      loginTitle: "Login",
      registerTitle: "Register as Voter",
      email: "Email Address",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      login: "Login",
      register: "Register as Voter",
      registerCandidate: "Register as Candidate",
      googleLogin: "Continue with Google",
      phoneLogin: "Continue with Phone",
      features: "Key Features",
      secureVoting: "Secure Voting",
      secureDesc: "End-to-end encryption with blockchain verification",
      realTimeResults: "Real-time Results",
      resultsDesc: "Live vote counting with transparent analytics",
      multiLanguage: "Multi-language Support",
      languageDesc: "Available in Sinhala, Tamil, and English",
      accessControl: "Role-based Access",
      accessDesc: "Separate interfaces for voters, candidates, and administrators",
    },
    si: {
      title: "ආරක්ෂිත ඩිජිටල් ඡන්ද වේදිකාව",
      subtitle: "සියලු දෙනා සඳහා විනිවිද දැකිය හැකි, ආරක්ෂිත සහ ප්‍රවේශ විය හැකි මැතිවරණ",
      loginTitle: "ප්‍රවේශ වන්න",
      registerTitle: "ඡන්දදායකයෙකු ලෙස ලියාපදිංචි වන්න",
      email: "විද්‍යුත් තැපැල් ලිපිනය",
      username: "පරිශීලක නාමය",
      password: "මුරපදය",
      confirmPassword: "මුරපදය තහවුරු කරන්න",
      login: "ප්‍රවේශ වන්න",
      register: "ඡන්දදායකයෙකු ලෙස ලියාපදිංචි වන්න",
      registerCandidate: "අපේක්ෂකයෙකු ලෙස ලියාපදිංචි වන්න",
      googleLogin: "Google සමඟ ඉදිරියට යන්න",
      phoneLogin: "දුරකථනය සමඟ ඉදිරියට යන්න",
      features: "ප්‍රධාන විශේෂාංග",
      secureVoting: "ආරක්ෂිත ඡන්ද දීම",
      secureDesc: "බ්ලොක්චේන් සත්‍යාපනය සමඟ අන්ත සිට අන්ත සංකේතනය",
      realTimeResults: "තත්‍ය කාලීන ප්‍රතිඵල",
      resultsDesc: "විනිවිද දැකිය හැකි විශ්ලේෂණ සමඟ සජීවී ඡන්ද ගණන් කිරීම",
      multiLanguage: "බහු භාෂා සහාය",
      languageDesc: "සිංහල, දමිළ සහ ඉංග්‍රීසි භාෂාවලින් ලබා ගත හැකිය",
      accessControl: "භූමිකා පදනම් වූ ප්‍රවේශය",
      accessDesc: "ඡන්දදායකයින්, අපේක්ෂකයින් සහ පරිපාලකයින් සඳහා වෙනම අතුරු මුහුණත්",
    },
    ta: {
      title: "பாதுகாப்பான டிஜிட்டல் வாக்களிப்பு தளம்",
      subtitle: "அனைவருக்கும் வெளிப்படையான, பாதுகாப்பான மற்றும் அணுகக்கூடிய தேர்தல்கள்",
      loginTitle: "வாக்களிக்க உள்நுழையவும்",
      registerTitle: "வாக்காளராக பதிவு செய்யவும்",
      email: "மின்னஞ்சல் முகவரி",
      username: "பயனர் பெயர்",
      password: "கடவுச்சொல்",
      confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      login: "உள்நுழையவும்",
      register: "வாக்காளராக பதிவு செய்யவும்",
      registerCandidate: "வேட்பாளராக பதிவு செய்யவும்",
      googleLogin: "Google உடன் தொடரவும்",
      phoneLogin: "தொலைபேசியுடன் தொடரவும்",
      features: "முக்கிய அம்சங்கள்",
      secureVoting: "பாதுகாப்பான வாக்களிப்பு",
      secureDesc: "பிளாக்செயின் சரிபார்ப்புடன் முடிவிலிருந்து முடிவு வரை குறியாக்கம்",
      realTimeResults: "நேரடி முடிவுகள்",
      resultsDesc: "வெளிப்படையான பகுப்பாய்வுடன் நேரடி வாக்கு எண்ணிக்கை",
      multiLanguage: "பல மொழி ஆதரவு",
      languageDesc: "சிங்களம், தமிழ் மற்றும் ஆங்கிலத்தில் கிடைக்கிறது",
      accessControl: "பங்கு அடிப்படையிலான அணுகல்",
      accessDesc: "வாக்காளர்கள், வேட்பாளர்கள் மற்றும் நிர்வாகிகளுக்கான தனி இடைமுகங்கள்",
    },
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">E-Vote</span>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="si">🇱🇰 සිංහල</SelectItem>
                <SelectItem value="ta">🇱🇰 தமிழ்</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">{t.title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">{t.subtitle}</p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t.secureVoting}</h3>
                  <p className="text-sm text-gray-600">{t.secureDesc}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t.realTimeResults}</h3>
                  <p className="text-sm text-gray-600">{t.resultsDesc}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Globe className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t.multiLanguage}</h3>
                  <p className="text-sm text-gray-600">{t.languageDesc}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <UserCheck className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t.accessControl}</h3>
                  <p className="text-sm text-gray-600">{t.accessDesc}</p>
                </div>
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/voter-dashboard">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Users className="h-4 w-4" />
                  <span>Voter Portal</span>
                </Button>
              </Link>
              <Link href="/candidates">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <User className="h-4 w-4" />
                  <span>View Candidates</span>
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Lock className="h-4 w-4" />
                  <span>Admin Portal</span>
                </Button>
              </Link>
              <Link href="/results">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <BarChart3 className="h-4 w-4" />
                  <span>Live Results</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Login/Register Forms */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t.login}</TabsTrigger>
                <TabsTrigger value="register">{t.register}</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                  <Card>
                    <CardHeader>
                      {/*<CardTitle className="text-2xl">{t.loginTitle}</CardTitle>*/}
                      <CardDescription>
                        Enter your credentials to access the system
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form onSubmit={handleLoginSubmit}>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t.email}</Label>
                          <Input
                              id="email"
                              type="email"
                              placeholder="voter@example.com"
                              onChange={handleLoginChange}
                              value={loginForm.email}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">{t.password}</Label>
                          <Input
                              id="password"
                              type="password"
                              onChange={handleLoginChange}
                              value={loginForm.password}
                          />
                        </div>
                        {loginError && (
                            <div className="text-red-600">{loginError}</div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loginLoading}
                        >
                          {loginLoading ? t.login + "..." : t.login}
                        </Button>
                      </form>

                      <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"/>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
                          </div>
                        </div>

                      <div className="grid grid-cols-1 gap-4">
                          <Button variant="outline" onClick={signInWithGoogle}>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                              {/* ...Google SVG paths... */}
                              <path
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                  fill="#4285F4"
                              />
                              <path
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                  fill="#34A853"
                              />
                              <path
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                  fill="#FBBC05"
                              />
                              <path
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                  fill="#EA4335"
                              />
                            </svg>
                            Google
                          </Button>
                        </div>
                    </CardContent>
                  </Card>
            </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Card className="space-y-6">
                    <CardHeader>
                      <CardTitle className="text-2xl">{t.registerTitle}</CardTitle>
                      <CardDescription>{"Create your voter account to participate in elections"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.email}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="voter@example.com"
                            onChange={handleChange}
                            value={form.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">{t.username}</Label>
                        <Input
                            id="username"
                            placeholder="Lahiru Mudith"
                            onChange={handleChange}
                            value={form.username}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">{t.password}</Label>
                          <Input
                              id="password"
                              type="password"
                              onChange={handleChange}
                              value={form.password}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                          <Input
                              id="confirmPassword"
                              type="password"
                              onChange={handleChange}
                              value={form.confirmPassword}
                          />
                        </div>
                      </div>
                      {error && <div className="text-red-600">{error}</div>}
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                        {loading ? t.register || "Registering..." : t.register}
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">Or</span>
                        </div>
                      </div>
                      <Link href="/register-candidate">
                        <Button variant="outline" className="w-full bg-transparent">
                          <UserPlus className="h-4 w-4 mr-2"/>
                          {t.registerCandidate}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
