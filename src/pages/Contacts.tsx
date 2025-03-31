
import { useState } from 'react';
import { useRelationship, Contact } from '@/contexts/RelationshipContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, MoreVertical, Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ContactForm = ({ 
  contact, 
  onSubmit, 
  onCancel 
}: { 
  contact?: Contact, 
  onSubmit: (data: Omit<Contact, 'id'>) => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>({
    name: contact?.name || '',
    relationship: contact?.relationship || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    birthday: contact?.birthday || '',
    notes: contact?.notes || '',
    lastInteraction: contact?.lastInteraction || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship</Label>
          <select
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-input bg-background"
            required
          >
            <option value="">Select relationship</option>
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Partner">Partner</option>
            <option value="Colleague">Colleague</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthday">Birthday (optional)</Label>
          <Input
            id="birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">
          {contact ? 'Update Contact' : 'Add Contact'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Contacts = () => {
  const { contacts, addContact, updateContact, deleteContact } = useRelationship();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = (data: Omit<Contact, 'id'>) => {
    addContact(data);
    setIsAddDialogOpen(false);
    toast({
      title: "Contact Added",
      description: `${data.name} has been added to your contacts.`,
    });
  };

  const handleEditContact = (data: Omit<Contact, 'id'>) => {
    if (selectedContact) {
      updateContact(selectedContact.id, data);
      setIsEditDialogOpen(false);
      toast({
        title: "Contact Updated",
        description: `${data.name}'s information has been updated.`,
      });
    }
  };

  const handleDeleteContact = () => {
    if (selectedContact) {
      deleteContact(selectedContact.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Contact Deleted",
        description: `${selectedContact.name} has been removed from your contacts.`,
      });
    }
  };

  return (
    <div className="container py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your relationships with friends, family, and partners
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </header>

      <div className="flex items-center space-x-2 mb-6">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No contacts match your search"
              : "You haven't added any contacts yet"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Contact
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{contact.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedContact(contact);
                          setIsEditDialogOpen(true);
                        }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedContact(contact);
                          setIsDeleteDialogOpen(true);
                        }} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {contact.relationship}
                  </div>
                  {contact.birthday && (
                    <div className="flex items-center mb-2 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Birthday: {format(new Date(contact.birthday), 'MMMM d')}</span>
                    </div>
                  )}
                  {contact.email && <p className="text-sm mb-1">Email: {contact.email}</p>}
                  {contact.phone && <p className="text-sm mb-1">Phone: {contact.phone}</p>}
                  {contact.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{contact.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSubmit={handleAddContact}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <ContactForm
              contact={selectedContact}
              onSubmit={handleEditContact}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Contact Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete {selectedContact?.name}? This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteContact}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
