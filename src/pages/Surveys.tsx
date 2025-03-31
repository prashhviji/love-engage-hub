
import { useState } from 'react';
import { useRelationship, Survey, Question } from '@/contexts/RelationshipContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, ClipboardCheck, BarChart } from 'lucide-react';
import { format } from 'date-fns';

const SurveyForm = ({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: Omit<Survey, 'id'>) => void,
  onCancel: () => void
}) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([
    { text: '', type: 'text', options: [] }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', options: [] }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    
    // Handle options for multiple-choice questions
    if (field === 'type' && value === 'multiple-choice') {
      updatedQuestions[index].options = ['Option 1', 'Option 2', 'Option 3'];
    }
    
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      const options = [...updatedQuestions[questionIndex].options!];
      options[optionIndex] = value;
      updatedQuestions[questionIndex].options = options;
      setQuestions(updatedQuestions);
    }
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [
        ...updatedQuestions[questionIndex].options!,
        `Option ${updatedQuestions[questionIndex].options!.length + 1}`
      ];
      setQuestions(updatedQuestions);
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      const options = [...updatedQuestions[questionIndex].options!];
      options.splice(optionIndex, 1);
      updatedQuestions[questionIndex].options = options;
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add unique IDs to questions
    const questionsWithIds = questions.map(q => ({
      ...q,
      id: crypto.randomUUID()
    }));
    
    onSubmit({
      title,
      date: new Date().toISOString(),
      questions: questionsWithIds,
      responses: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Survey Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Relationship Check-in"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Questions</h3>
        </div>

        {questions.map((question, index) => (
          <div key={index} className="p-4 border rounded-md space-y-3">
            <div className="flex justify-between items-start">
              <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Input
              id={`question-${index}`}
              value={question.text}
              onChange={(e) => updateQuestion(index, 'text', e.target.value)}
              placeholder="Enter your question"
              required
            />

            <div className="space-y-2">
              <Label htmlFor={`question-type-${index}`}>Question Type</Label>
              <select
                id={`question-type-${index}`}
                value={question.type}
                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="text">Text (Free Response)</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="rating">Rating (1-5)</option>
              </select>
            </div>

            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-3 pl-4 border-l-2 mt-4">
                <Label>Answer Options</Label>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    {question.options!.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index, optionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(index)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            )}
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={questions.some(q => !q.text.trim())}>
          Create Survey
        </Button>
      </DialogFooter>
    </form>
  );
};

const Surveys = () => {
  const { surveys, addSurvey, deleteSurvey } = useRelationship();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleAddSurvey = (data: Omit<Survey, 'id'>) => {
    addSurvey(data);
    setIsAddDialogOpen(false);
    toast({
      title: "Survey Created",
      description: `${data.title} has been created successfully.`,
    });
  };

  const handleDeleteSurvey = () => {
    if (selectedSurvey) {
      deleteSurvey(selectedSurvey.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Survey Deleted",
        description: `${selectedSurvey.title} has been deleted.`,
      });
      setSelectedSurvey(null);
    }
  };

  return (
    <div className="container py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Surveys</h1>
          <p className="text-muted-foreground">
            Create and manage surveys to understand your relationships better
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Survey
        </Button>
      </header>

      {surveys.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Surveys Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first survey to gather insights about your relationships
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Survey
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
                <CardDescription>
                  Created on {format(new Date(survey.date), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {survey.questions.length} questions • {survey.responses.length} responses
                </p>
                <div className="space-y-2">
                  {survey.questions.slice(0, 2).map((question, index) => (
                    <div key={index} className="text-sm border-l-2 pl-3 py-1">
                      {question.text}
                    </div>
                  ))}
                  {survey.questions.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      + {survey.questions.length - 2} more questions
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button size="sm">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Collect Responses
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Survey Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
          </DialogHeader>
          <SurveyForm
            onSubmit={handleAddSurvey}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Survey Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Survey</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{selectedSurvey?.title}"? This action cannot be undone 
            and all responses will be lost.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteSurvey}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Surveys;
