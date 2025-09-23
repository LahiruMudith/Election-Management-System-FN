"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
    Plus,
    ArrowLeft,
    Edit,
    Trash2,
    Search,
    Users,
    Flag,
    CheckCircle,
    AlertCircle,
    Save,
    Settings,
    Shield,
    Vote,
} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Party {
    id: string
    name: string
    symbol: string
    color: string
    description?: string
    foundedYear?: string
    leader?: string
    isActive: boolean
    memberCount?: number
    createdAt: string
}

export default function PartiesPage() {
    const token = Cookies.get("token");
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedParty, setSelectedParty] = useState<Party | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [partyToDelete, setPartyToDelete] = useState<Party | null>(null)

    // const [parties, setParties] = useState<Party[]>([
    //     {
    //         id: "1",
    //         name: "Democratic Party",
    //         symbol: "🌟",
    //         color: "#3B82F6",
    //         description: "A progressive political party focused on democratic values and social justice.",
    //         foundedYear: "1995",
    //         leader: "John Silva",
    //         isActive: true,
    //         memberCount: 125000,
    //         createdAt: "2024-01-15",
    //     },
    //     {
    //         id: "2",
    //         name: "Progressive Alliance",
    //         symbol: "🌱",
    //         color: "#10B981",
    //         description: "Environmental and social progressive political movement.",
    //         foundedYear: "2001",
    //         leader: "Maria Fernando",
    //         isActive: true,
    //         memberCount: 98000,
    //         createdAt: "2024-01-10",
    //     },
    //     {
    //         id: "3",
    //         name: "National Unity",
    //         symbol: "⭐",
    //         color: "#F59E0B",
    //         description: "Promoting national unity and reconciliation across all communities.",
    //         foundedYear: "1988",
    //         leader: "David Perera",
    //         isActive: true,
    //         memberCount: 156000,
    //         createdAt: "2024-01-08",
    //     },
    //     {
    //         id: "4",
    //         name: "Future Forward",
    //         symbol: "🚀",
    //         color: "#8B5CF6",
    //         description: "Technology-focused party for the digital age and youth empowerment.",
    //         foundedYear: "2018",
    //         leader: "Sarah Jayawardena",
    //         isActive: true,
    //         memberCount: 67000,
    //         createdAt: "2024-01-05",
    //     },
    //     {
    //         id: "5",
    //         name: "Traditional Values",
    //         symbol: "🏛️",
    //         color: "#DC2626",
    //         description: "Conservative party focused on traditional values and cultural preservation.",
    //         foundedYear: "1975",
    //         leader: "Ravi Wickramasinghe",
    //         isActive: false,
    //         memberCount: 45000,
    //         createdAt: "2024-01-01",
    //     },
    // ])

    // Changed: Start with empty array, load from backend
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParties = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:8080/api/v1/parties/getAll", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch parties");
                const data = await response.json();
                // Adapt this if needed to match your backend response format
                setParties(
                    data.data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        symbol: p.symbol,
                        color: p.color,
                        description: p.description,
                        foundedYear: p.founderYear,
                        leader: p.leaderName,
                        isActive: p.active,
                    }))
                );
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchParties();
    }, [token]);

    const [newParty, setNewParty] = useState({
        name: "",
        symbol: "",
        color: "",
        description: "",
        foundedYear: "",
        leader: "",
    })

    const [editParty, setEditParty] = useState({
        name: "",
        symbol: "",
        color: "",
        description: "",
        foundedYear: "",
        leader: "",
    })

    const filteredParties = parties.filter(
        (party) =>
            (party.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (party.leader?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (party.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // Modified: Remove isActive from the form, only use backend value to update state
    const handleAddParty = async () => {
        if (newParty.name && newParty.symbol) {
            // Prepare payload for backend
            const partyPayload = {
                name: newParty.name,
                symbol: newParty.symbol,
                color: newParty.color,
                description: newParty.description,
                founderYear: newParty.foundedYear, // match backend field
                leaderName: newParty.leader,       // match backend field
            };

            try {
                const response = await fetch("http://localhost:8080/api/v1/parties/save", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(partyPayload),
                });

                if (response.ok) {
                    const createdParty = await response.json();
                    setParties([...parties, {
                        id: createdParty.id,
                        name: createdParty.name,
                        symbol: createdParty.symbol,
                        color: createdParty.color,
                        description: createdParty.description,
                        foundedYear: createdParty.founderYear,
                        leader: createdParty.leaderName,
                        isActive: createdParty.isActive, // Always use backend value!
                        memberCount: createdParty.memberCount ?? 0,
                        createdAt: createdParty.createdAt,
                    }]);
                    setNewParty({
                        name: "",
                        symbol: "",
                        color: "",
                        description: "",
                        foundedYear: "",
                        leader: "",
                    });
                    setShowAddModal(false);
                    toast.success("Party added successfully!");
                } else {
                    toast.error("Failed to save party.");
                }
            } catch (err) {
                toast.error("Network error: Could not save party.");
            }
        }
    };

    // Edit status can be toggled locally (unless you want to sync with backend)
    const handleEditParty = async () => {
        if (!selectedParty) return;

        const payload = {
            id: selectedParty.id,
            name: editParty.name,
            symbol: editParty.symbol,
            color: editParty.color,
            description: editParty.description,
            leaderName: editParty.leader,
        };

        try {
            const response = await fetch(`http://localhost:8080/api/v1/parties/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                // Update local parties list with the edited party
                setParties(parties.map((party) =>
                    party.id === selectedParty.id
                        ? {
                            ...party,
                            name: editParty.name,
                            symbol: editParty.symbol,
                            color: editParty.color,
                            description: editParty.description,
                            leader: editParty.leader,
                        }
                        : party
                ));
                setShowEditModal(false);
                setSelectedParty(null);
                toast.success(result.message ?? "Party updated!");
            } else {
                toast.error("Failed to update party.");
            }
        } catch (error) {
            toast.error("Network error: Could not update party.");
        }
    };

    const handleDeleteParty = async () => {
        if (!partyToDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/parties/delete/${partyToDelete.id}`, {
                method: "DELETE", // use DELETE method for deletion
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                // Remove party from local state
                setParties(parties.filter((party) => party.id !== partyToDelete.id));
                setShowDeleteConfirm(false);
                setPartyToDelete(null);

                // Optional: Show backend message if available
                const result = await response.json();
                toast.success(result.message ?? "Party deleted successfully!");
            } else {
                toast.error("Failed to delete party.");
            }
        } catch (error) {
            toast.error("Network error: Could not delete party.");
        }
    };

    const togglePartyStatus = async (partyId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/parties/deactivate/${partyId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const result = await response.json();

                // Optionally, get updated party details from backend
                // Or just update state locally:
                setParties(parties.map((party) =>
                    party.id === partyId ? { ...party, isActive: !party.isActive } : party
                ));

                toast.success(result.message);
            } else {
                toast.error("Failed to deactivate party.");
            }
        } catch (error) {
            toast.error("Network error: Could not deactivate party.");
        }
    };

    const openEditModal = (party: Party) => {
        setSelectedParty(party)
        setEditParty({
            name: party.name,
            symbol: party.symbol,
            color: party.color,
            description: party.description || "",
            foundedYear: party.foundedYear || "",
            leader: party.leader || "",
        })
        setShowEditModal(true)
    }

    const openDeleteConfirm = (party: Party) => {
        setPartyToDelete(party)
        setShowDeleteConfirm(true)
    }

    const stats = {
        totalParties: parties.length,
        activeParties: parties.filter((p) => p.isActive).length,
        inactiveParties: parties.filter((p) => !p.isActive).length,
        totalMembers: parties.reduce((sum, party) => sum + (party.memberCount || 0), 0),
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
                                <span className="text-2xl font-bold">Political Parties</span>
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
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Party
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Political Parties Management</h1>
                            <p className="text-gray-600">Manage political parties, their details, and status</p>
                        </div>
                        <Link href="/admin">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Admin
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Parties</CardTitle>
                                <Flag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalParties}</div>
                                <p className="text-xs text-muted-foreground">Registered parties</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Parties</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{stats.activeParties}</div>
                                <p className="text-xs text-muted-foreground">Currently active</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Inactive Parties</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{stats.inactiveParties}</div>
                                <p className="text-xs text-muted-foreground">Currently inactive</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/*/!* Search and Filters *!/*/}
                {/*<Card className="mb-8">*/}
                {/*    <CardHeader>*/}
                {/*        <CardTitle className="flex items-center">*/}
                {/*            <Search className="h-5 w-5 mr-2" />*/}
                {/*            Search Parties*/}
                {/*        </CardTitle>*/}
                {/*        <CardDescription>Search by party name, leader, or description</CardDescription>*/}
                {/*    </CardHeader>*/}
                {/*    <CardContent>*/}
                {/*        <div className="flex space-x-4">*/}
                {/*            <div className="flex-1">*/}
                {/*                <div className="relative">*/}
                {/*                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />*/}
                {/*                    <Input*/}
                {/*                        placeholder="Search parties..."*/}
                {/*                        value={searchTerm}*/}
                {/*                        onChange={(e) => setSearchTerm(e.target.value)}*/}
                {/*                        className="pl-10"*/}
                {/*                    />*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <Button variant="outline" onClick={() => setSearchTerm("")} disabled={!searchTerm}>*/}
                {/*                Clear*/}
                {/*            </Button>*/}
                {/*        </div>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}

                {/* Parties Grid */}
                <div className="grid gap-6">
                    {filteredParties.map((party) => (
                        <Card key={party.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                                <div className="grid lg:grid-cols-4 gap-0">
                                    {/* Party Symbol and Color */}
                                    <div
                                        className="lg:col-span-1 p-6 flex flex-col items-center text-center text-white"
                                        style={{ backgroundColor: party.color }}
                                    >
                                        <div className="text-6xl mb-4">{party.symbol}</div>
                                        <h3 className="text-xl font-bold mb-2">{party.name}</h3>
                                        <Badge
                                            variant={party.isActive ? "default" : "secondary"}
                                            className={party.isActive ? "bg-white text-gray-900" : "bg-gray-200 text-gray-700"}
                                        >
                                            {party.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>

                                    {/* Party Details */}
                                    <div className="lg:col-span-2 p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-lg font-semibold mb-2">Party Information</h4>
                                                {party.description && <p className="text-gray-700 leading-relaxed mb-3">{party.description}</p>}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    {party.leader && (
                                                        <div>
                                                            <Label className="text-sm text-gray-500">Party Leader</Label>
                                                            <p className="font-medium">{party.leader}</p>
                                                        </div>
                                                    )}
                                                    {party.foundedYear && (
                                                        <div>
                                                            <Label className="text-sm text-gray-500">Founded</Label>
                                                            <p className="font-medium">{party.foundedYear}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <Label className="text-sm text-gray-500">Members</Label>
                                                        <p className="font-medium">{party.memberCount?.toLocaleString() || "0"}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm text-gray-500">Color Code</Label>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-4 h-4 rounded border" style={{ backgroundColor: party.color }}></div>
                                                            <p className="font-mono text-sm">{party.color}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:col-span-1 p-6 border-l bg-gray-50 flex flex-col justify-center space-y-3">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(party)} className="w-full">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => togglePartyStatus(party.id)}
                                            className={`w-full ${
                                                party.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"
                                            }`}
                                        >
                                            {party.isActive ? (
                                                <>
                                                    <AlertCircle className="h-4 w-4 mr-2" />
                                                    Deactivate
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Activate
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openDeleteConfirm(party)}
                                            className="w-full text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {filteredParties.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No parties found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? "Try adjusting your search criteria" : "No political parties have been added yet"}
                            </p>
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Party
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Add Party Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Political Party
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Party Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Democratic Party"
                                    value={newParty.name}
                                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="symbol">Party Symbol *</Label>
                                <Input
                                    id="symbol"
                                    placeholder="🌟"
                                    value={newParty.symbol}
                                    onChange={(e) => setNewParty({ ...newParty, symbol: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="color">Party Color *</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={newParty.color}
                                        onChange={(e) => setNewParty({ ...newParty, color: e.target.value })}
                                        className="w-16 h-10 p-1 border rounded"
                                    />
                                    <Input
                                        placeholder="#3B82F6"
                                        value={newParty.color}
                                        onChange={(e) => setNewParty({ ...newParty, color: e.target.value })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="leader">Party Leader</Label>
                                <Input
                                    id="leader"
                                    placeholder="John Silva"
                                    value={newParty.leader}
                                    onChange={(e) => setNewParty({ ...newParty, leader: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="foundedYear">Founded Year</Label>
                            <Input
                                id="foundedYear"
                                type="number"
                                placeholder="1995"
                                value={newParty.foundedYear}
                                onChange={(e) => setNewParty({ ...newParty, foundedYear: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of the party's ideology and goals..."
                                value={newParty.description}
                                onChange={(e) => setNewParty({ ...newParty, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        {/* Removed Active Status field since backend controls it */}

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddParty} disabled={!newParty.name || !newParty.symbol}>
                                <Save className="h-4 w-4 mr-2" />
                                Add Party
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Party Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Edit className="h-5 w-5 mr-2" />
                            Edit Political Party
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editName">Party Name *</Label>
                                <Input
                                    id="editName"
                                    placeholder="Democratic Party"
                                    value={editParty.name}
                                    onChange={(e) => setEditParty({ ...editParty, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editSymbol">Party Symbol *</Label>
                                <Input
                                    id="editSymbol"
                                    placeholder="🌟"
                                    value={editParty.symbol}
                                    onChange={(e) => setEditParty({ ...editParty, symbol: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editColor">Party Color *</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="editColor"
                                        type="color"
                                        value={editParty.color}
                                        onChange={(e) => setEditParty({ ...editParty, color: e.target.value })}
                                        className="w-16 h-10 p-1 border rounded"
                                    />
                                    <Input
                                        placeholder="#3B82F6"
                                        value={editParty.color}
                                        onChange={(e) => setEditParty({ ...editParty, color: e.target.value })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editLeader">Party Leader</Label>
                                <Input
                                    id="editLeader"
                                    placeholder="John Silva"
                                    value={editParty.leader}
                                    onChange={(e) => setEditParty({ ...editParty, leader: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editFoundedYear">Founded Year</Label>
                            <Input
                                id="editFoundedYear"
                                type="number"
                                placeholder="1995"
                                value={editParty.foundedYear}
                                onChange={(e) => setEditParty({ ...editParty, foundedYear: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editDescription">Description</Label>
                            <Textarea
                                id="editDescription"
                                placeholder="Brief description of the party's ideology and goals..."
                                value={editParty.description}
                                onChange={(e) => setEditParty({ ...editParty, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        {/* Removed Active Status field for edit modal as well; if you want to allow status change, add it here */}

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditParty} disabled={!editParty.name || !editParty.symbol}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-red-600">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            Delete Political Party
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Are you sure you want to delete <strong>{partyToDelete?.name}</strong>? This action cannot be undone.
                        </p>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Deleting this party will also remove it from all associated elections and candidates.
                            </AlertDescription>
                        </Alert>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteParty}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Party
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}