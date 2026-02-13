import { useState } from "react";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AuthStatus = "guest" | "authenticated";

export interface AuthState {
  status: AuthStatus;
  userName: string;
  email: string;
}

interface AuthPanelProps {
  auth: AuthState;
  onLogin: (payload: { email: string; password: string }) => boolean;
  onSignup: (payload: { name: string; email: string; password: string }) => boolean;
  onLogout: () => void;
}

export const AuthPanel = ({ auth, onLogin, onSignup, onLogout }: AuthPanelProps) => {
  const [open, setOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-3">
      <Badge variant={auth.status === "guest" ? "secondary" : "default"}>
        {auth.status === "guest" ? "Guest" : `Signed in as ${auth.userName}`}
      </Badge>

      {auth.status === "guest" ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Welcome back</DialogTitle>
              <DialogDescription>
                Sign in or create an account to save progress.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                  />
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    const didLogin = onLogin({ email: loginEmail, password: loginPassword });
                    if (didLogin) {
                      setOpen(false);
                    }
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Your name"
                    value={signupName}
                    onChange={(event) => setSignupName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(event) => setSignupEmail(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                  />
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    const didSignup = onSignup({
                      name: signupName,
                      email: signupEmail,
                      password: signupPassword,
                    });
                    if (didSignup) {
                      setOpen(false);
                    }
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  Create account
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      ) : (
        <Button variant="outline" className="gap-2" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      )}
    </div>
  );
};
