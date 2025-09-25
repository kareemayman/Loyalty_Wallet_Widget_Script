import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, Apple, Smartphone, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nasnavApi, yeshteryApi } from "@/lib/utils";
import AppleLogo from "/public/Apple.png";
import GoogleLogo from "/public/Google.png";

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
      if (!user && !isLoading && !isAuthenticating) {
        setIsAuthenticating(true);
        try {
          // Mock credentials for widget testing
          // Login will be handled from chat services when it's done
          const mockCredentials = {
            email: "test_user@yopmail.com",
            password: "abc12345",
            orgId: 2,
            isEmployee: false,
          };

          await login(mockCredentials, "user");
        } catch (error) {
          toast({
            title: "Authentication failed",
            description: "Could not authenticate widget",
            variant: "destructive",
          });
        } finally {
          setIsAuthenticating(false);
        }
      } else if (user?.token && isTokenExpired(user.token)) {
        // Token is expired, clear it and re-authenticate
        console.log("Token expired, clearing and re-authenticating");
        clearStoredTokens();
        logout();
        // This will trigger the useEffect to re-authenticate
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
    <div className="min-h-screen bg-white">
      <div className="w-[fit-content] mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* QR Code Section */}
          <div className="text-center mb-6">
            {!walletRes && (
              <div className="w-[150px] h-[150px] mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
            )}
            {walletRes && (
              <div className="mx-auto mb-4 flex items-center justify-center">
                <img
                  src={walletRes}
                  width={150}
                  height={150}
                  alt="QR Code"
                  className="rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Heading */}
          <div className="text-center mb-2">
            <h1 className="text-[28px] sm:text-[40px] text-gray-800 font-abeezee font-[400]">Scan Barcode for Bonus Points</h1>
          </div>

          {/* Subtitle */}
          <div className="text-center mb-8">
            <p className="text-[14px] sm:text-[18px] text-[#626262] font-acme font-[400] leading-[150%]">
              Keep your loyalty wallet pass handy and never miss rewards.
            </p>
          </div>

          {/* Wallet Buttons */}
          <div className="flex gap-6 justify-center">
            <Button
              onClick={() => handleWalletAction("apple")}
              className="flex-1 bg-white hover:bg-gray-50 text-black border-2 border-[#009BA7] hover:border-[#009BA7] rounded-none py-4 px-8 flex items-center justify-center text-[16px] font-[500] max-w-[165px] max-h-[44px] gap-1.5 sm:max-w-[251px] sm:max-h-[52px] font-abyssinica sm:text-[18px] sm:font-[400] leading-[150%]"
              size="lg"
            >
              <img src={AppleLogo} alt="Apple" className="h-5 w-5" />
              <span className="font-medium">Apple</span>
            </Button>
            <Button
              onClick={() => handleWalletAction("google")}
              className="flex-1 bg-white hover:bg-gray-50 text-black border-2 border-[#009BA7] hover:border-[#009BA7] rounded-none py-4 px-8 flex items-center justify-center text-[16px] font-[500] max-w-[165px] max-h-[44px] gap-1.5 sm:max-w-[251px] sm:max-h-[52px] font-abyssinica sm:text-[18px] sm:font-[400] leading-[150%]"
              size="lg"
            >
              <img src={GoogleLogo} alt="Google" className="h-5 w-5" />
              <span className="font-medium">Google</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyWalletWidget;
