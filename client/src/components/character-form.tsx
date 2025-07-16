import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, UserPlus, Loader2 } from "lucide-react";
import openai from "@/lib/openai";

const characterSchema = z.object({
  name: z.string().min(1, "Character name is required"),
  description: z.string().min(5, "Please provide a more detailed description"),
});

type CharacterFormValues = z.infer<typeof characterSchema>;

interface CharacterFormProps {
  onAddCharacter: (character: { name: string; description: string }) => void;
}

export default function CharacterForm({ onAddCharacter }: CharacterFormProps) {
  const [open, setOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = (data: CharacterFormValues) => {
    onAddCharacter(data);
    form.reset();
    setOpen(false);
    
    toast({
      title: "Character added",
      description: `${data.name} has been added to your comic.`,
    });
  };

  const enhanceDescription = async () => {
    const { name, description } = form.getValues();
    
    if (!name || !description) {
      toast({
        title: "Missing information",
        description: "Please provide a name and basic description first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEnhancing(true);
    
    try {
      const result = await openai.generateCharacterDetails(name, description);
      
      // Update the description field with the enhanced description
      form.setValue("description", result.fullDescription || description);
      
      toast({
        title: "Description enhanced",
        description: "AI has enhanced your character description.",
      });
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "Failed to enhance character description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Character
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new character</DialogTitle>
          <DialogDescription>
            Define your character's name and description. The AI will maintain consistency throughout your comic.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter character name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your character's appearance, personality, and background"
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={enhanceDescription}
                    disabled={isEnhancing}
                    className="mt-2"
                  >
                    {isEnhancing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Character</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
