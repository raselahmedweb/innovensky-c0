"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image_url?: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  created_at: string
}

interface TeamManagerProps {
  onUpdate?: () => void
}

export function TeamManager({ onUpdate }: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image_url: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/admin/team")
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingMember ? `/api/admin/team/${editingMember.id}` : "/api/admin/team"
      const method = editingMember ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Team member ${editingMember ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchMembers()
        onUpdate?.()
      } else {
        throw new Error("Failed to save team member")
      }
    } catch (error) {
      console.error("Error saving team member:", error)
      toast({
        title: "Error",
        description: "Failed to save team member",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image_url: member.image_url || "",
      linkedin_url: member.linkedin_url || "",
      github_url: member.github_url || "",
      twitter_url: member.twitter_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Team member deleted successfully",
        })
        fetchMembers()
        onUpdate?.()
      } else {
        throw new Error("Failed to delete team member")
      }
    } catch (error) {
      console.error("Error deleting team member:", error)
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      image_url: "",
      linkedin_url: "",
      github_url: "",
      twitter_url: "",
    })
    setEditingMember(null)
  }

  if (loading && members.length === 0) {
    return <div>Loading team members...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Team Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMember ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Profile Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter_url">Twitter URL</Label>
                    <Input
                      id="twitter_url"
                      type="url"
                      value={formData.twitter_url}
                      onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingMember ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No team members found. Add your first team member!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Social Links</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{member.role}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{member.bio}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {member.linkedin_url && <Badge variant="outline">LinkedIn</Badge>}
                      {member.github_url && <Badge variant="outline">GitHub</Badge>}
                      {member.twitter_url && <Badge variant="outline">Twitter</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
