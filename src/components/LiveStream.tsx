import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import PageContainer from "./PageContainer";

interface LiveStreamProps {
  videoId?: string;
}

const LiveStream = ({ videoId = "jfKfPfyJRdk" }: LiveStreamProps) => {
  return (
    <PageContainer>
      <div className="p-4">
        <Card className="max-w-5xl mx-auto bg-white">
          <CardHeader>
            <CardTitle>Live Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default LiveStream;
