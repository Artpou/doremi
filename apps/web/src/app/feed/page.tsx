import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Feed } from "@/components/Feed";

export default function FeedPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Latest Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Feed />
        </CardContent>
      </Card>
    </div>
  );
}
