
"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, BrainCircuit, BarChart3, Search, Play, Settings, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateDeckModal } from "@/components/CreateDeckModal";
import { StudySession } from "@/components/StudySession";
import { Deck } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function MnemonixDashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load decks from local storage on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem("mnemonix_decks");
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks));
    } else {
      // Sample data for first-time users
      const sampleDecks: Deck[] = [
        {
          id: "sample-1",
          title: "Quantum Mechanics Fundamentals",
          description: "Key concepts of wave-particle duality and uncertainty principles.",
          category: "Physics",
          createdAt: Date.now(),
          cards: [
            { id: "1", question: "What is the Schrodinger Equation?", answer: "A linear partial differential equation that governs the wave function of a quantum-mechanical system.", mastered: false },
            { id: "2", question: "Explain Wave-Particle Duality", answer: "The concept that every elementary particle or quantic entity may be partly described in terms not only of particles, but also of waves.", mastered: true },
          ]
        },
        {
          id: "sample-2",
          title: "Art History: Italian Renaissance",
          description: "Major works and artists from the 14th to 16th century.",
          category: "Humanities",
          createdAt: Date.now() - 86400000,
          cards: [
            { id: "3", question: "Who painted the Sistine Chapel ceiling?", answer: "Michelangelo Buonarroti.", mastered: false }
          ]
        }
      ];
      setDecks(sampleDecks);
      localStorage.setItem("mnemonix_decks", JSON.stringify(sampleDecks));
    }
  }, []);

  const saveDecks = (updatedDecks: Deck[]) => {
    setDecks(updatedDecks);
    localStorage.setItem("mnemonix_decks", JSON.stringify(updatedDecks));
  };

  const deleteDeck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = decks.filter(d => d.id !== id);
    saveDecks(updated);
  };

  const filteredDecks = decks.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalCards: decks.reduce((acc, d) => acc + d.cards.length, 0),
    masteredCards: decks.reduce((acc, d) => acc + d.cards.filter(c => c.mastered).length, 0),
    activeDecks: decks.length
  };

  if (activeDeck) {
    return (
      <StudySession 
        deck={activeDeck} 
        onClose={(updatedDeck) => {
          if (updatedDeck) {
            const updatedDecks = decks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
            saveDecks(updatedDecks);
          }
          setActiveDeck(null);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar / Navigation (Conceptual) */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Mnemonix</h1>
            <p className="text-muted-foreground text-lg">Your cognitive mastery hub.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <Input 
                placeholder="Search your library..." 
                className="pl-10 bg-card border-border/50 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="rounded-full px-6 shadow-lg shadow-primary/20" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" strokeWidth={2} /> Create Deck
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Concepts</p>
                <p className="text-2xl font-bold">{stats.totalCards}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 hover:border-accent/50 transition-colors">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mastered</p>
                <p className="text-2xl font-bold">{stats.masteredCards}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 hover:border-white/20 transition-colors">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Decks</p>
                <p className="text-2xl font-bold">{stats.activeDecks}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Library Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              Curated Library 
              <Badge variant="secondary" className="font-normal">{filteredDecks.length}</Badge>
            </h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Recently Viewed</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Alphabetical</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDecks.map((deck, idx) => {
              const placeholder = PlaceHolderImages[idx % PlaceHolderImages.length];
              const masteredCount = deck.cards.filter(c => c.mastered).length;
              const progress = deck.cards.length > 0 ? (masteredCount / deck.cards.length) * 100 : 0;

              return (
                <Card 
                  key={deck.id} 
                  className="group relative overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all duration-500 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => setActiveDeck(deck)}
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image 
                      src={placeholder.imageUrl} 
                      alt={deck.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                      data-ai-hint={placeholder.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border-white/10">{deck.category}</Badge>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 hover:bg-destructive/80 border border-white/10"
                      onClick={(e) => deleteDeck(deck.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{deck.title}</CardTitle>
                    <CardDescription className="line-clamp-2 h-10">{deck.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{deck.cards.length} cards</span>
                      <span className="text-accent font-medium">{Math.round(progress)}% Mastery</span>
                    </div>
                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-1000" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Updated {new Date(deck.createdAt).toLocaleDateString()}</span>
                    <Button size="sm" variant="ghost" className="group-hover:text-primary">
                      Study <Play className="ml-2 w-3 h-3" fill="currentColor" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}

            {/* Empty State / Call to Action */}
            {filteredDecks.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-2xl">
                <div className="p-4 bg-muted rounded-full">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">No decks found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or create a new deck with AI.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  Create Your First Deck
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>

      <CreateDeckModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreated={(newDeck) => {
          saveDecks([newDeck, ...decks]);
          setIsCreateModalOpen(false);
          setActiveDeck(newDeck);
        }}
      />
    </div>
  );
}
