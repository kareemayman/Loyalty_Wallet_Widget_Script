import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, Apple, Smartphone, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nasnavApi, yeshteryApi } from "@/lib/utils";

export const LoyaltyWalletWidget = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { toast } = useToast();
  const [walletRes, setWalletRes] = useState("");
  const [isAppleWallet, setIsAppleWallet] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check if token is expired (basic JWT check)
  const isTokenExpired = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now;
    } catch (e) {
      return true; // If we can't parse it, consider it expired
    }
  };

  // Clear stored tokens
  const clearStoredTokens = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
  };

  // Mock authentication for widget
  useEffect(() => {
    const authenticateWidget = async () => {
      // Wait for auth context to finish loading
      if (isLoading || isAuthenticating) return;

      // Check if we need to authenticate
      const needsAuth = !user || (user?.token && isTokenExpired(user.token));

      if (needsAuth) {
        setIsAuthenticating(true);
        try {
          // Clear any existing invalid tokens
          if (user?.token && isTokenExpired(user.token)) {
            console.log("Token expired, clearing and re-authenticating");
            clearStoredTokens();
            logout();
          }

          // Mock credentials for widget testing
          const mockCredentials = {
            email: "test_user@yopmail.com",
            password: "abc12345",
            orgId: 2,
            isEmployee: false,
          };

          await login(mockCredentials, "user");
          toast({
            title: "Widget Authenticated",
            description: "Using mock credentials for testing",
          });
        } catch (error) {
          toast({
            title: "Authentication failed",
            description: "Could not authenticate widget",
            variant: "destructive",
          });
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    authenticateWidget();
  }, [user, isLoading, isAuthenticating, login, logout, toast]);

  const handleWalletAction = (type: "apple" | "google") => {
    toast({
      title: `${type === "apple" ? "Apple" : "Google"} Wallet`,
      description: `Opening ${type === "apple" ? "Apple" : "Google"} Wallet integration...`,
    });

    if (type === "apple") return handleAppleWallet();
    handleGoogleWallet();
  };

  const handleAppleWallet = async () => {
    if (!user?.token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access your loyalty wallet",
        variant: "destructive",
      });
      return;
    }

    // Check if token is expired before making API call
    if (isTokenExpired(user.token)) {
      console.log("Token expired, re-authenticating...");
      clearStoredTokens();
      logout();
      return;
    }

    try {
      const response = await fetch(nasnavApi + "wallet/apple/qrCode", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      });

      if (!response.ok) {
        // If 401/403, token might be invalid, try to re-authenticate
        if (response.status === 401 || response.status === 403) {
          console.log("API returned 401/403, clearing token and re-authenticating");
          clearStoredTokens();
          logout();
          return;
        }
        throw new Error("Failed to generate QR code");
      }

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setWalletRes(imgUrl);
      setIsAppleWallet(true);
    } catch (error) {
      toast({
        title: "Failed to generate QR code",
        description: "Please check your authentication and try again",
        variant: "destructive",
      });
    }
  };

  const handleGoogleWallet = async () => {
    if (!user?.token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access your loyalty wallet",
        variant: "destructive",
      });
      return;
    }

    // Check if token is expired before making API call
    if (isTokenExpired(user.token)) {
      console.log("Token expired, re-authenticating...");
      clearStoredTokens();
      logout();
      return;
    }

    try {
      const response = await fetch(nasnavApi + "wallet/google/qrCode", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      });

      if (!response.ok) {
        // If 401/403, token might be invalid, try to re-authenticate
        if (response.status === 401 || response.status === 403) {
          console.log("API returned 401/403, clearing token and re-authenticating");
          clearStoredTokens();
          logout();
          return;
        }
        throw new Error("Failed to generate QR code");
      }

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setWalletRes(imgUrl);
      setIsAppleWallet(false);
    } catch (error) {
      toast({
        title: "Failed to generate QR code",
        description: "Please check your authentication and try again",
        variant: "destructive",
      });
    }
  };

  // Handle loading state
  if (isLoading || isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
          <div className="animate-pulse text-lg">
            {isAuthenticating ? "Authenticating widget..." : "Loading wallet..."}
          </div>
        </div>
      </div>
    );
  }

  // Handle no user after authentication attempt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loyalty Wallet</h2>
          <p className="text-muted-foreground mb-4">
            Unable to authenticate widget. Please try again.
          </p>
          <Button
            onClick={() => {
              setIsAuthenticating(false);
              // This will trigger the useEffect to retry authentication
            }}
            className="bg-gradient-primary"
          >
            Retry Authentication
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <GradientCard gradient="gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent-foreground">
              <Wallet className="h-5 w-5" />
              Loyalty Wallet
            </CardTitle>
            <CardDescription className="text-accent-foreground/80">
              Add to your mobile wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleWalletAction("apple")}
              className="w-full bg-black hover:bg-gray-800 text-white"
              size="lg"
            >
              <Apple className="h-5 w-5 mr-2" />
              Add to Apple Wallet
            </Button>
            <Button
              onClick={() => handleWalletAction("google")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Add to Google Wallet
            </Button>
            <Separator />
            <div className="text-center">
              {!walletRes && <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-2" />}
              {walletRes && (
                <img
                  style={{ margin: "auto" }}
                  src={walletRes}
                  width={100}
                  height={100}
                  alt="QR Code"
                />
              )}
              <p className="text-sm text-muted-foreground">
                Scan QR code to access your digital loyalty card
              </p>
            </div>
          </CardContent>
        </GradientCard>
      </div>
    </div>
  );
};

export default LoyaltyWalletWidget;
