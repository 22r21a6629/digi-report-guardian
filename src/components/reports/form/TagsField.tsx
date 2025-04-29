
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TagsFieldProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function TagsField({ tags, onAddTag, onRemoveTag }: TagsFieldProps) {
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = () => {
    if (currentTag.trim() !== "") {
      onAddTag(currentTag.trim());
      setCurrentTag("");
    }
  };

  return (
    <div>
      <Label>Tags</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Add tags"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <Button type="button" size="sm" onClick={handleAddTag}>
          Add Tag
        </Button>
      </div>
      <div className="flex flex-wrap mt-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="mr-2 mb-2">
            {tag}
            <button
              type="button"
              className="ml-1 inline-flex items-center rounded-full bg-secondary px-1 py-0.5 text-xs font-semibold ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onRemoveTag(tag)}
            >
              <span className="sr-only">Remove</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
