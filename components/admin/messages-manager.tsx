"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, Eye, Trash2, Mail, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

interface MessagesManagerProps {
  onUpdate?: () => void
}

export function MessagesManager({ onUpdate }: MessagesManagerProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      })

      if (response.ok) {
        setMessages(messages.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg)))
        onUpdate?.()
      }
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const deleteMessage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== id))
        toast({
          title: "Success",
          description: "Message deleted successfully",
        })
        onUpdate?.()
      } else {
        throw new Error("Failed to delete message")
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  const viewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    setIsDialogOpen(true)
    if (!message.is_read) {
      markAsRead(message.id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return <div>Loading messages...</div>
  }

  const unreadCount = messages.filter((msg) => !msg.is_read).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contact Messages
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No messages found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id} className={!message.is_read ? "bg-blue-50" : ""}>
                  <TableCell>
                    {message.is_read ? <Badge variant="secondary">Read</Badge> : <Badge variant="default">New</Badge>}
                  </TableCell>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {message.email}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {message.message.substring(0, 100)}
                    {message.message.length > 100 && "..."}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDate(message.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => viewMessage(message)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteMessage(message.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="font-medium">{formatDate(selectedMessage.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => window.open(`mailto:${selectedMessage.email}`, "_blank")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
