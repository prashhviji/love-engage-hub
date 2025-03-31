
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  birthday?: string;
  notes?: string;
  lastInteraction?: string;
  importantDates?: ImportantDate[];
}

export interface ImportantDate {
  id: string;
  contactId: string;
  title: string;
  date: string;
  type: 'birthday' | 'anniversary' | 'other';
  description?: string;
  reminder?: boolean;
  reminderDays?: number;
}

export interface Survey {
  id: string;
  title: string;
  date: string;
  questions: Question[];
  responses: Response[];
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple-choice' | 'rating';
  options?: string[];
}

export interface Response {
  id: string;
  questionId: string;
  contactId: string;
  answer: string;
  date: string;
}

interface RelationshipContextType {
  contacts: Contact[];
  importantDates: ImportantDate[];
  surveys: Survey[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addImportantDate: (date: Omit<ImportantDate, 'id'>) => void;
  updateImportantDate: (id: string, date: Partial<ImportantDate>) => void;
  deleteImportantDate: (id: string) => void;
  addSurvey: (survey: Omit<Survey, 'id'>) => void;
  updateSurvey: (id: string, survey: Partial<Survey>) => void;
  deleteSurvey: (id: string) => void;
  getUpcomingDates: (days: number) => ImportantDate[];
  getContactById: (id: string) => Contact | undefined;
}

const RelationshipContext = createContext<RelationshipContextType | undefined>(undefined);

export function RelationshipProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  // Load data from localStorage when the component mounts
  useEffect(() => {
    if (user) {
      const userId = user.id;
      const storedContacts = localStorage.getItem(`contacts_${userId}`);
      const storedDates = localStorage.getItem(`importantDates_${userId}`);
      const storedSurveys = localStorage.getItem(`surveys_${userId}`);
      
      if (storedContacts) setContacts(JSON.parse(storedContacts));
      if (storedDates) setImportantDates(JSON.parse(storedDates));
      if (storedSurveys) setSurveys(JSON.parse(storedSurveys));
    }
  }, [user]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const userId = user.id;
      localStorage.setItem(`contacts_${userId}`, JSON.stringify(contacts));
      localStorage.setItem(`importantDates_${userId}`, JSON.stringify(importantDates));
      localStorage.setItem(`surveys_${userId}`, JSON.stringify(surveys));
    }
  }, [contacts, importantDates, surveys, user]);

  // Contacts CRUD
  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = {
      ...contact,
      id: crypto.randomUUID(),
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (id: string, contactUpdate: Partial<Contact>) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, ...contactUpdate } : contact
      )
    );
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    // Also delete all important dates associated with this contact
    setImportantDates(importantDates.filter((date) => date.contactId !== id));
  };

  // Important Dates CRUD
  const addImportantDate = (date: Omit<ImportantDate, 'id'>) => {
    const newDate = {
      ...date,
      id: crypto.randomUUID(),
    };
    setImportantDates([...importantDates, newDate]);
  };

  const updateImportantDate = (id: string, dateUpdate: Partial<ImportantDate>) => {
    setImportantDates(
      importantDates.map((date) =>
        date.id === id ? { ...date, ...dateUpdate } : date
      )
    );
  };

  const deleteImportantDate = (id: string) => {
    setImportantDates(importantDates.filter((date) => date.id !== id));
  };

  // Surveys CRUD
  const addSurvey = (survey: Omit<Survey, 'id'>) => {
    const newSurvey = {
      ...survey,
      id: crypto.randomUUID(),
    };
    setSurveys([...surveys, newSurvey]);
  };

  const updateSurvey = (id: string, surveyUpdate: Partial<Survey>) => {
    setSurveys(
      surveys.map((survey) =>
        survey.id === id ? { ...survey, ...surveyUpdate } : survey
      )
    );
  };

  const deleteSurvey = (id: string) => {
    setSurveys(surveys.filter((survey) => survey.id !== id));
  };

  // Helper function to get upcoming important dates
  const getUpcomingDates = (days: number) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    
    return importantDates.filter((date) => {
      const eventDate = new Date(date.date);
      // Only compare month and day
      const thisYearEventDate = new Date(
        today.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );
      
      return thisYearEventDate >= today && thisYearEventDate <= futureDate;
    });
  };

  // Helper function to get a contact by ID
  const getContactById = (id: string) => {
    return contacts.find((contact) => contact.id === id);
  };

  const value = {
    contacts,
    importantDates,
    surveys,
    addContact,
    updateContact,
    deleteContact,
    addImportantDate,
    updateImportantDate,
    deleteImportantDate,
    addSurvey,
    updateSurvey,
    deleteSurvey,
    getUpcomingDates,
    getContactById,
  };

  return <RelationshipContext.Provider value={value}>{children}</RelationshipContext.Provider>;
}

export function useRelationship() {
  const context = useContext(RelationshipContext);
  if (context === undefined) {
    throw new Error('useRelationship must be used within a RelationshipProvider');
  }
  return context;
}
