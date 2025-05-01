import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-0">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            Get in Touch
          </h1>
          <p className="text-muted-foreground">
            Have a question, feedback, or just want to say hi? We're here to
            help!
          </p>
        </div>

        <Card className="mt-12 p-8 md:p-12 shadow-md border-none bg-muted/30 dark:bg-zinc-900">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold">
              We'd love to hear from you
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Whether it's about plans, features, or anything else — drop us a
              message. Our team will get back to you as soon as possible.
            </p>
          </CardHeader>

          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="query-type">What’s this about?</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Support Help</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="partnerships">Partnerships</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="msg">Your Message</Label>
                <Textarea
                  id="msg"
                  rows={4}
                  placeholder="Share your question or feedback with us..."
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
