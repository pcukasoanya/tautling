
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, FileText, Layout, Loader2 } from "lucide-react";
import { generateDeckFromSubject } from "@/ai/flows/generate-deck-from-subject";
import { generateDeckFromUploadedText } from "@/ai/flows/generate-deck-from-uploaded-text";
import { Deck } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (deck: Deck) => void;
}

export function CreateDeckModal({ isOpen, onClose, onCreated }: CreateDeckModalProps) {
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [textDoc, setTextDoc] = useState("");
  const { toast } = useToast();

  const handleGenerateFromSubject = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    try {
      const result = await generateDeckFromSubject({ subject });
      const newDeck: Deck = {
        id: crypto.randomUUID(),
        title: subject,
        description: `AI-generated study cards about ${subject}`,
        category: "Generated",
        createdAt: Date.now(),
        cards: result.deck.map(card => ({
          ...card,
          id: crypto.randomUUID(),
          mastered: false
        }))
      };
      onCreated(newDeck);
      setSubject("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Something went wrong while creating your flashcards."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromText = async () => {
    if (!textDoc.trim()) return;
    setLoading(true);
    try {
      const result = await generateDeckFromUploadedText({ textDocument: textDoc });
      const newDeck: Deck = {
        id: crypto.randomUUID(),
        title: "Text Analysis Study Deck",
        description: "Flashcards generated from your uploaded text summary.",
        category: "Extracted",
        createdAt: Date.now(),
        cards: result.flashcards.map(card => ({
          ...card,
          id: crypto.randomUUID(),
          mastered: false
        }))
      };
      onCreated(newDeck);
      setTextDoc("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to extract flashcards from the provided text."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border/50 p-0 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} />
              Smart Deck Generator
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Leverage GenAI to build a comprehensive flashcard deck in seconds.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="subject" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger value="subject" className="flex items-center gap-2">
                <Layout className="w-4 h-4" /> Subject
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Text Upload
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="subject" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="subject">What do you want to learn?</Label>
                <Input 
                  id="subject" 
                  placeholder="e.g. Fundamental principles of Organic Chemistry" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">Mnemonix will research and structure the key concepts for you.</p>
              </div>
              <Button 
                className="w-full h-12 text-lg shadow-lg shadow-primary/20" 
                onClick={handleGenerateFromSubject}
                disabled={loading || !subject.trim()}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Generate Master Deck
              </Button>
            </TabsContent>

            <TabsContent value="text" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="text-content">Paste your study material or lecture summary</Label>
                <Textarea 
                  id="text-content" 
                  placeholder="Paste here..." 
                  className="min-h-[200px] bg-background resize-none"
                  value={textDoc}
                  onChange={(e) => setTextDoc(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Our AI will extract definitions and key Q&As automatically.</p>
              </div>
              <Button 
                className="w-full h-12 text-lg shadow-lg shadow-primary/20" 
                onClick={handleGenerateFromText}
                disabled={loading || !textDoc.trim()}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Extract Concepts
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
