
import { useState } from 'react';
import { useRelationship, ImportantDate } from '@/contexts/RelationshipContext';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, MoreVertical, Pencil, Trash2, Bell, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const DateForm = ({ 
  date, 
  onSubmit, 
  onCancel 
}: { 
  date?: ImportantDate, 
  onSubmit: (data: Omit<ImportantDate, 'id'>) => void, 
  onCancel: () => void 
}) => {
  const { contacts } = useRelationship();
  const [formData, setFormData] = useState<Omit<ImportantDate, 'id'>>({
    contactId: date?.contactId || '',
    title: date?.title || '',
    date: date?.date || '',
    type: date?.type || 'other',
    description: date?.description || '',
    reminder: date?.reminder || true,
    reminderDays: date?.reminderDays || 7,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, reminder: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactId">Person</Label>
          <select
            id="contactId"
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-input bg-background"
            required
          >
            <option value="">Select a person</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>{contact.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Birthday, Anniversary"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-input bg-background"
            required
          >
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="reminder" 
            checked={formData.reminder} 
            onCheckedChange={handleSwitchChange} 
          />
          <Label htmlFor="reminder">Set reminder</Label>
        </div>
        
        {formData.reminder && (
          <div className="space-y-2">
            <Label htmlFor="reminderDays">Remind me days before</Label>
            <Input
              id="reminderDays"
              name="reminderDays"
              type="number"
              min="1"
              max="30"
              value={formData.reminderDays}
              onChange={handleChange}
              required
            />
          </div>
        )}
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">
          {date ? 'Update Date' : 'Add Date'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const ImportantDates = () => {
  const { importantDates, addImportantDate, updateImportantDate, deleteImportantDate, getContactById } = useRelationship();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<ImportantDate | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredDates = importantDates.filter(date => {
    const contact = getContactById(date.contactId);
    return (
      date.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact && contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleAddDate = (data: Omit<ImportantDate, 'id'>) => {
    addImportantDate(data);
    setIsAddDialogOpen(false);
    toast({
      title: "Date Added",
      description: `${data.title} has been added to your important dates.`,
    });
  };

  const handleEditDate = (data: Omit<ImportantDate, 'id'>) => {
    if (selectedDate) {
      updateImportantDate(selectedDate.id, data);
      setIsEditDialogOpen(false);
      toast({
        title: "Date Updated",
        description: `${data.title} has been updated.`,
      });
    }
  };

  const handleDeleteDate = () => {
    if (selectedDate) {
      deleteImportantDate(selectedDate.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Date Deleted",
        description: `${selectedDate.title} has been removed from your important dates.`,
      });
    }
  };

  const getNextOccurrence = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    
    // Set the event to this year
    const thisYearEvent = new Date(
      today.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    
    // If the event has already passed this year, set it to next year
    if (thisYearEvent < today) {
      thisYearEvent.setFullYear(today.getFullYear() + 1);
    }
    
    return thisYearEvent;
  };

  return (
    <div className="container py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Important Dates</h1>
          <p className="text-muted-foreground">
            Never miss birthdays, anniversaries, and other special occasions
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Date
        </Button>
      </header>

      <div className="flex items-center space-x-2 mb-6">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search dates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredDates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No dates match your search"
              : "You haven't added any important dates yet"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Important Date
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDates.map((date) => {
            const contact = getContactById(date.contactId);
            const nextOccurrence = getNextOccurrence(date.date);
            const daysUntil = differenceInDays(nextOccurrence, new Date());
            
            return (
              <Card key={date.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{date.title}</h3>
                      {contact && (
                        <p className="text-sm text-muted-foreground">{contact.name}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedDate(date);
                          setIsEditDialogOpen(true);
                        }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedDate(date);
                          setIsDeleteDialogOpen(true);
                        }} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center mt-4 mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(date.date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  {date.description && (
                    <p className="text-sm text-muted-foreground my-2">{date.description}</p>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {date.reminder && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Bell className="h-3 w-3 mr-1" />
                          <span>Remind {date.reminderDays} days before</span>
                        </div>
                      )}
                    </div>
                    <div className={`text-sm font-medium ${daysUntil <= 7 ? 'text-relationship-secondary' : ''}`}>
                      {daysUntil === 0 
                        ? 'Today!' 
                        : daysUntil === 1 
                          ? 'Tomorrow' 
                          : `${daysUntil} days`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Date Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Important Date</DialogTitle>
          </DialogHeader>
          <DateForm
            onSubmit={handleAddDate}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Date Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Important Date</DialogTitle>
          </DialogHeader>
          {selectedDate && (
            <DateForm
              date={selectedDate}
              onSubmit={handleEditDate}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Date Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Important Date</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete {selectedDate?.title}? This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteDate}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportantDates;
