

'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Zap, Shield } from "lucide-react";

export function HeroBlock() {
  return (
    <section className="relative w-full py-20 md:py-32  overflow-hidden">
      {/* Dark overlay for smooth gradient effect only in dark mode */}
      <div className="absolute inset-0 z-0 " />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-12 text-center">
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                BluePrint
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Manage tasks, sprints, and your team — all in one internal dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2 px-8">
              Enter Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              View SOPs
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8 max-w-4xl">
            {[{
              icon: Users, title: "Team Roles", desc: "Assign & track responsibilities across departments."
            }, {
              icon: Zap, title: "Speed-Oriented", desc: "Minimal UI & fast flows optimized for internal teams."
            }, {
              icon: Shield, title: "Secure", desc: "Access-controlled, encrypted, and internal only."
            }].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card border"
              >
                <div className="p-3 bg-primary/10 rounded-full">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground text-center">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
