
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoSectionProps {
  title?: string;
  videoId?: string; // YouTube video ID, e.g. "dQw4w9WgXcQ"
  description?: string;
}

export const VideoSection = ({
  title = "Learn More",
  videoId = "dQw4w9WgXcQ",
  description = "Watch this short video to learn how She's Strong Ghana supports early detection and care.",
}: VideoSectionProps) => {
  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="shadow-medical bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            )}
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="Informational Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </AspectRatio>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
