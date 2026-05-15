
"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Brain, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Deck, Flashcard } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StudySessionProps {
  deck: Deck;
  onClose: (updatedDeck?: Deck) => void;
}

export function StudySession({ deck, onClose }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [localDeck, setLocalDeck] = useState<Deck>(deck);
  const [sessionFinished, setSessionFinished] = useState(false);

  const currentCard = localDeck.cards[currentIndex];
  const totalCards = localDeck.cards.length;
  const masteredCount = localDeck.cards.filter(c => c.mastered).length;
  const progress = ((currentIndex + 1) / totalCards) * 100;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionFinished(true);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleMastery = () => {
    const updatedCards = localDeck.cards.map((c, idx) => 
      idx === currentIndex ? { ...c, mastered: !c.mastered } : c
    );
    const updatedDeck = { ...localDeck, cards: updatedCards };
    setLocalDeck(updatedDeck);
  };

  if (sessionFinished) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-fade-in-up">
          <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse" />
            <Brain className="w-16 h-16 text-accent" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">Session Complete</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Great work! You've reviewed all {totalCards} concepts in this deck.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-card p-6 rounded-2xl border border-border/50">
              <p className="text-3xl font-bold text-accent">{masteredCount}</p>
              <p className="text-sm text-muted-foreground">Mastered</p>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border/50">
              <p className="text-3xl font-bold text-primary">{totalCards - masteredCount}</p>
              <p className="text-sm text-muted-foreground">Needs Review</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full h-14 text-lg" onClick={() => onClose(localDeck)}>
              Return to Library
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => {
              setCurrentIndex(0);
              setSessionFinished(false);
            }}>
              <RotateCcw className="w-4 h-4 mr-2" /> Study Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Top Bar */}
      <header className="p-6 flex items-center justify-between border-b border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onClose(localDeck)} className="hover:bg-white/10">
            <X className="w-6 h-6" strokeWidth={1.5} />
          </Button>
          <div>
            <h2 className="font-semibold text-lg line-clamp-1">{localDeck.title}</h2>
            <p className="text-xs text-muted-foreground">Card {currentIndex + 1} of {totalCards}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Session Progress</p>
            <Progress value={progress} className="w-48 h-1.5" />
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-border/50">
            <BarChart2 className="w-4 h-4" strokeWidth={1.5} /> Stats
          </Button>
        </div>
      </header>

      {/* Main Focus Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        {/* 3D Flashcard */}
        <div 
          className="w-full max-w-2xl aspect-[4/3] sm:aspect-[3/2] perspective-1000 cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={cn(
            "relative w-full h-full flashcard-inner preserve-3d shadow-2xl transition-all duration-500",
            isFlipped ? "rotate-y-180" : ""
          )}>
            {/* Front Side */}
            <div className="absolute inset-0 bg-card border-2 border-border/50 rounded-3xl backface-hidden flex flex-col items-center justify-center p-12 text-center group-hover:border-primary/40 transition-colors">
              <span className="absolute top-8 left-10 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Concept Question</span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline leading-tight">{currentCard.question}</h3>
              <p className="absolute bottom-8 text-sm text-muted-foreground font-medium animate-pulse">Click to reveal answer</p>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 bg-primary border-2 border-white/20 rounded-3xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-12 text-center text-primary-foreground">
              <span className="absolute top-8 left-10 text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold">Answer Key</span>
              <div className="max-h-full overflow-y-auto w-full custom-scrollbar">
                <p className="text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed">{currentCard.answer}</p>
              </div>
              <p className="absolute bottom-8 text-sm text-white/60 font-medium">Click to flip back</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-12 flex items-center gap-4 w-full max-w-2xl justify-between">
          <div className="flex gap-4">
            <Button variant="secondary" size="lg" className="h-14 w-14 rounded-2xl bg-card border border-border/50" onClick={handlePrev} disabled={currentIndex === 0}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button variant="secondary" size="lg" className="h-14 w-14 rounded-2xl bg-card border border-border/50" onClick={handleNext}>
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <Button 
            variant="outline" 
            size="lg" 
            className={cn(
              "h-14 px-8 rounded-2xl transition-all border-2",
              currentCard.mastered 
                ? "bg-accent/10 border-accent text-accent hover:bg-accent/20" 
                : "border-border/50 text-muted-foreground hover:border-accent/40 hover:text-accent"
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleMastery();
            }}
          >
            <CheckCircle2 className={cn("w-5 h-5 mr-3 transition-transform", currentCard.mastered ? "scale-110" : "scale-100")} />
            {currentCard.mastered ? "Mastered" : "Mark Mastered"}
          </Button>
        </div>
      </main>

      {/* Mastery Tracking Bar */}
      <footer className="p-6 bg-card/50 backdrop-blur-md border-t border-border/30">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground font-medium">{masteredCount} Concepts Mastered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground font-medium">{totalCards - masteredCount} Learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
